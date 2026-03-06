import React, { useState, useEffect, useRef } from 'react';
import { Mic, UploadCloud, Activity, CalendarDays, Brain, Globe, CheckCircle2, FileText, ChevronRight, User, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
    const [recordVoice, setRecordVoice] = useState(false);
    const [log, setLog] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [patientData, setPatientData] = useState(null);
    const [agentRunning, setAgentRunning] = useState(false);
    const [browserAction, setBrowserAction] = useState("");

    const endOfLogRef = useRef(null);

    const addLog = (msg, type = "info") => {
        setLog(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    };

    useEffect(() => {
        endOfLogRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [log]);

    const handleVoiceRecording = () => {
        setRecordVoice(!recordVoice);
        if (!recordVoice) {
            addLog("🎤 Nova 2 Sonic: Listening to patient audio stream...", "processing");
            setTimeout(() => {
                addLog("✅ Nova 2 Sonic: Audio transcribed and intent extracted.", "success");
                setPatientData(prev => ({
                    ...prev,
                    symptoms: "Severe migraine, light sensitivity, and nausea for 2 days.",
                    intent: "book_appointment",
                    urgency: "High"
                }));
                setRecordVoice(false);

                // Trigger Triage
                setTimeout(() => {
                    addLog("🧠 Nova 2 Lite: Triaging symptoms...", "processing");
                    setTimeout(() => {
                        addLog("🏥 Nova 2 Lite: Patient routed to Neurology. Priority: Urgent.", "alert");
                        setPatientData(prev => ({
                            ...prev,
                            department: "Neurology",
                            triageScore: 8.5
                        }));
                    }, 1500);
                }, 1000);
            }, 3000);
        }
    };

    const handleDocumentUpload = () => {
        addLog("📄 Nova Multimodal: Analyzing handwritten prescription image...", "processing");
        setTimeout(() => {
            addLog("✅ Nova Multimodal: Extracted entities successfully.", "success");
            setPatientData(prev => ({
                ...prev,
                medicines: ["Sumatriptan 50mg", "Ondansetron 4mg"],
                previousDiagnosis: "Migraine with Aura",
            }));
        }, 2500);
    };

    const triggerAgent = () => {
        setAgentRunning(true);
        addLog("🤖 Nova Act: Initializing UI Automation Agent...", "processing");

        const actions = [
            "Navigating to hospital portal login...",
            "Authenticating via SSO...",
            "Locating patient record field...",
            "Entering extracted symptoms: 'Severe migraine...'",
            "Selecting department: 'Neurology'...",
            "Finding earliest availability...",
            "Clicking 'Confirm Booking' button...",
            "Booking complete."
        ];

        let delay = 1000;
        actions.forEach((action, index) => {
            setTimeout(() => {
                setBrowserAction(action);
                addLog(`🌐 Nova Act: ${action}`, "info");

                if (index === actions.length - 1) {
                    setTimeout(() => {
                        setAgentRunning(false);
                        addLog("🎉 NovaCare Workflow Completed Successfully!", "success");
                        setPatientData(prev => ({ ...prev, status: "Appointment Confirmed" }));
                    }, 1000);
                }
            }, delay);
            delay += 1200;
        });
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-gray-100 font-sans selection:bg-indigo-500/30">
            {/* Background Glow */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 flex flex-col min-h-screen">
                {/* Header */}
                <header className="flex justify-between items-center py-6 border-b border-gray-800/50 mb-6 text-indigo-400">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Brain className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                NovaCare <span className="text-indigo-400 font-medium text-lg border ml-2 border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded-md">Enterprise</span>
                            </h1>
                            <p className="text-xs text-gray-400 font-medium tracking-wide">AMAZON NOVA HACKATHON</p>
                        </div>
                    </div>

                    <div className="flex space-x-2 bg-gray-900/50 p-1.5 rounded-lg border border-gray-800 backdrop-blur-md">
                        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-gray-400 hover:text-gray-200'}`}>Triage Dashboard</button>
                        <button onClick={() => setActiveTab('architecture')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'architecture' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-gray-400 hover:text-gray-200'}`}>System Flow</button>
                    </div>
                </header>

                {activeTab === 'dashboard' && (
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-auto pb-6">

                        {/* Left Column: Actions & Patient Data */}
                        <div className="lg:col-span-4 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                            {/* Input Actions Card */}
                            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50" />
                                <h2 className="text-lg font-semibold mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-blue-400" /> Intake & Triage</h2>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleVoiceRecording}
                                        className={`w-full relative overflow-hidden flex items-center justify-between p-4 rounded-xl border transition-all ${recordVoice ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800'}`}
                                    >
                                        <div className="flex items-center space-x-3 relative z-10">
                                            <div className={`p-2 rounded-lg ${recordVoice ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                                <Mic className={`w-5 h-5 ${recordVoice ? 'animate-pulse' : ''}`} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-sm text-gray-200">{recordVoice ? 'Recording Patient...' : 'Voice Triage'}</p>
                                                <p className="text-xs text-gray-500">Powered by Nova 2 Sonic</p>
                                            </div>
                                        </div>
                                        {recordVoice && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                                    </button>

                                    <button
                                        onClick={handleDocumentUpload}
                                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:border-purple-500/50 hover:bg-gray-800 transition-all"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 rounded-lg bg-purple-500/20">
                                                <UploadCloud className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-sm text-gray-200">Upload Prescription</p>
                                                <p className="text-xs text-gray-500">Nova Multimodal Embeddings</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Patient Live Profile */}
                            <AnimatePresence>
                                {patientData && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex-1 flex flex-col"
                                    >
                                        <h2 className="text-lg font-semibold mb-4 flex items-center border-b border-gray-800 pb-3"><User className="w-5 h-5 mr-2 text-indigo-400" /> Live Patient Profile</h2>

                                        <div className="flex-1 space-y-4 text-sm mt-2">
                                            {patientData.symptoms && (
                                                <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Extracted Symptoms</p>
                                                    <p className="text-gray-200">{patientData.symptoms}</p>
                                                </div>
                                            )}

                                            {patientData.department && (
                                                <div className="flex space-x-3">
                                                    <div className="flex-1 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                                                        <p className="text-indigo-400 text-xs mb-1 uppercase tracking-wider">Routed Dept</p>
                                                        <p className="text-gray-200 font-medium flex items-center"><Stethoscope className="w-4 h-4 mr-1" /> {patientData.department}</p>
                                                    </div>
                                                    <div className="flex-1 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                                                        <p className="text-red-400 text-xs mb-1 uppercase tracking-wider">Urgency</p>
                                                        <p className="text-gray-200 font-medium">{patientData.urgency} ({patientData.triageScore}/10)</p>
                                                    </div>
                                                </div>
                                            )}

                                            {patientData.medicines && (
                                                <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/20">
                                                    <p className="text-purple-400 text-xs mb-1 uppercase tracking-wider">Extracted Medications</p>
                                                    <ul className="list-disc list-inside text-gray-300">
                                                        {patientData.medicines.map((med, i) => <li key={i}>{med}</li>)}
                                                    </ul>
                                                </div>
                                            )}

                                            {patientData.status && (
                                                <div className="mt-auto pt-4 flex items-center text-green-400 font-medium">
                                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                                    {patientData.status}
                                                </div>
                                            )}
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>

                        {/* Middle & Right Columns: Browser & Logs */}
                        <div className="lg:col-span-8 flex flex-col space-y-6 h-full">

                            {/* Top: Browser Simulation (Nova Act) */}
                            <div className="bg-[#121214] border border-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">

                                {/* Browser Header */}
                                <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="bg-gray-800 text-xs text-gray-400 px-6 py-1.5 rounded-full font-mono border border-gray-700 flex items-center">
                                        <Globe className="w-3 h-3 mr-2" /> hospital-portal.internal/book
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={triggerAgent}
                                            disabled={agentRunning || !patientData?.triageScore}
                                            className={`text-xs px-3 py-1.5 rounded font-bold transition-all flex items-center ${agentRunning ? 'bg-indigo-600/50 text-indigo-300 cursor-not-allowed' : patientData?.triageScore ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-gray-800 text-gray-500'}`}
                                        >
                                            <CalendarDays className="w-4 h-4 mr-1" /> Automate UI (Nova Act)
                                        </button>
                                    </div>
                                </div>

                                {/* Browser Content */}
                                <div className="flex-1 p-6 relative bg-white/5 flex flex-col items-center justify-center min-h-[300px]">
                                    {!agentRunning && !patientData?.status ? (
                                        <div className="text-gray-600 flex flex-col items-center">
                                            <Globe className="w-16 h-16 mb-4 opacity-20" />
                                            <p>Nova Act Browser Sandbox</p>
                                            <p className="text-xs mt-2">Waiting for trigger...</p>
                                        </div>
                                    ) : (
                                        <div className="w-full max-w-lg bg-gray-900 rounded-lg border border-gray-700 shadow-2xl overflow-hidden p-6 relative">
                                            {agentRunning && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse" />}
                                            <h3 className="text-gray-200 font-medium mb-4 pb-2 border-b border-gray-800">Hospital Booking System</h3>

                                            <div className="space-y-4 text-sm font-mono opacity-80">
                                                <div className="flex items-center space-x-2 text-indigo-400 mb-6">
                                                    <span className="animate-spin text-lg">⚙</span>
                                                    <span>{browserAction}</span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="h-8 bg-gray-800 rounded border border-gray-700 w-full flex items-center px-3 opacity-50"><span className="text-gray-500">Patient Data: </span> <span className="text-gray-300 ml-2">{patientData?.symptoms ? 'Filled' : ''}</span></div>
                                                    <div className="h-8 bg-gray-800 rounded border border-gray-700 w-3/4 flex items-center px-3 opacity-50"><span className="text-gray-500">Department: </span> <span className="text-gray-300 ml-2">{patientData?.department}</span></div>
                                                    <div className="h-10 bg-blue-600/20 border border-blue-500/30 rounded w-1/2 flex items-center justify-center text-blue-400 mt-4 opacity-50">Submit Booking</div>
                                                </div>
                                            </div>

                                            {/* Overlay cursor simulation */}
                                            {agentRunning && (
                                                <motion.div
                                                    animate={{
                                                        x: [0, 150, 50, 200, 100],
                                                        y: [0, 50, 120, 80, 160]
                                                    }}
                                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute top-4 left-4 z-50 pointer-events-none"
                                                >
                                                    <svg viewBox="0 0 1024 1024" className="w-6 h-6 text-white drop-shadow-md" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M110.16 877.056L670.368 471.18 368.64 430.08l-5.12-421.888L110.16 877.056z" /></svg>
                                                </motion.div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom: Execution Log Console */}
                            <div className="bg-[#0D0D0E] border border-gray-800 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-xl">
                                <div className="bg-gray-900/80 px-4 py-2 border-b border-gray-800 flex items-center text-xs font-mono text-gray-500">
                                    <FileText className="w-3 h-3 mr-2" /> Amazon Nova Model Orchestration Logs
                                </div>
                                <div className="p-4 font-mono text-sm overflow-auto custom-scrollbar flex-1 space-y-2">
                                    {log.map((l, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i}
                                            className="flex items-start whitespace-nowrap"
                                        >
                                            <span className="text-gray-600 mr-3 shrink-0">[{l.time}]</span>
                                            <span className={`${l.type === 'processing' ? 'text-blue-400' :
                                                l.type === 'success' ? 'text-green-400' :
                                                    l.type === 'alert' ? 'text-yellow-400 text-shadow-glow' :
                                                        'text-gray-300'
                                                }`}>
                                                {l.msg}
                                            </span>
                                        </motion.div>
                                    ))}
                                    <div ref={endOfLogRef} />
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {activeTab === 'architecture' && (
                    <div className="flex-1 bg-gray-900/40 border border-gray-800 rounded-2xl p-8 flex items-center justify-center">
                        <div className="text-center max-w-3xl">
                            <h2 className="text-3xl font-bold mb-8 text-white">NovaCare Data Flow</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg z-10">
                                    <Mic className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-200">Patient Input</h3>
                                    <p className="text-sm text-gray-400 mt-2">Voice, Text, Documents</p>
                                </div>

                                <div className="bg-indigo-900/50 p-6 rounded-xl border border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.2)] z-10 scale-105">
                                    <Brain className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-200">Amazon Nova Models</h3>
                                    <ul className="text-xs text-indigo-200 mt-3 space-y-1 text-left inline-block">
                                        <li>• Nova 2 Sonic (Speech to JSON)</li>
                                        <li>• Nova Multimodal (Docs to Entities)</li>
                                        <li>• Nova 2 Lite (Fast Reasoning)</li>
                                    </ul>
                                </div>

                                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg z-10">
                                    <Globe className="w-10 h-10 text-green-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-200">Nova Act Exec</h3>
                                    <p className="text-sm text-gray-400 mt-2">Agent automates end hospital systems.</p>
                                </div>

                                {/* Connection lines omitted for simplicity in React, but visualized by visual structure */}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
