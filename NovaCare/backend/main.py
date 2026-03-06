from fastapi import FastAPI, Depends, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, database, nova_integration

# Initialize Database
database.init_db()

app = FastAPI(title="NovaCare API")

# Allow Frontend CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to NovaCare API using Amazon Nova"}

@app.post("/register_patient")
def register_patient(name: str, phone: str, db: Session = Depends(database.get_db)):
    new_patient = models.Patient(name=name, phone=phone)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@app.post("/process_voice")
async def process_voice(patient_id: int, file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    """Accepts voice audio, transcribes with Nova Sonic, inserts visit."""
    audio_bytes = await file.read()
    intent_data = nova_integration.process_voice_to_intent(audio_bytes)
    
    # Store the visit based on voice request
    visit = models.Visit(
        patient_id=patient_id, 
        symptoms=intent_data.get('extracted_info', {}).get('symptoms', ''),
        status='voice_processed'
    )
    db.add(visit)
    db.commit()
    return {"message": "Voice processed", "intent": intent_data, "visit_id": visit.id}

@app.post("/upload_document")
async def upload_document(patient_id: int, file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    """Process PDF/Image prescriptions using Nova Multimodal."""
    content = await file.read()
    parsed_info = nova_integration.analyze_document_multimodal(content, file.content_type)
    
    doc = models.Document(
        patient_id=patient_id,
        file_url=file.filename,
        parsed_data=parsed_info
    )
    db.add(doc)
    db.commit()
    return {"message": "Document parsed", "extracted_data": parsed_info}

@app.post("/triage/{visit_id}")
def run_triage(visit_id: int, db: Session = Depends(database.get_db)):
    """Run Nova Lite reasoning on a visit"""
    visit = db.query(models.Visit).filter(models.Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
        
    triage_result = nova_integration.reason_and_triage({"patient_id": visit.patient_id}, visit.symptoms)
    
    visit.triage_result = triage_result
    visit.assigned_department = triage_result.get("department", "General")
    visit.status = "triaged"
    db.commit()
    
    return {"message": "Triage complete", "result": triage_result}

@app.post("/trigger_ui_agent/{visit_id}")
def trigger_agent(visit_id: int, db: Session = Depends(database.get_db)):
    """Triggers Nova Act to book appointment on UI"""
    visit = db.query(models.Visit).filter(models.Visit.id == visit_id).first()
    
    task_desc = f"Book appointment in {visit.assigned_department} for patient with symptoms {visit.symptoms}"
    agent_result = nova_integration.trigger_nova_act_agent(task_desc, {"patient_id": visit.patient_id})
    
    log = models.AgentLog(
        patient_id=visit.patient_id,
        action="Book Appointment",
        status=agent_result["status"],
        details=agent_result
    )
    db.add(log)
    db.commit()
    
    return {"message": "Agent triggered", "agent_details": agent_result}
