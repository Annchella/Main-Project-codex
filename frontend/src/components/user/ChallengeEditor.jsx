import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Sparkles, Terminal, ChevronLeft, CheckCircle, XCircle, Clock, Award, RefreshCw, Settings, Info, ChevronDown, ChevronUp } from "lucide-react";
import Editor from "@monaco-editor/react";

const ChallengeEditor = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState(null);
    const [output, setOutput] = useState("");
    const [showHints, setShowHints] = useState(false);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const res = await api.get(`/challenges/${challengeId}`);
                setChallenge(res.data);
                setCode(res.data.baseCode || "// Write your solution here...");
            } catch (error) {
                console.error("Error fetching challenge:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenge();
    }, [challengeId]);

    const handleRunCode = async () => {
        setRunning(true);
        setOutput("");
        try {
            const res = await api.post("/compile/run", {
                code,
                language,
            });
            setOutput(res.data.output);
        } catch (err) {
            setOutput("Error: Internal execution failure.");
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setResults(null);
        try {
            const res = await api.post("/challenges/submit", {
                challengeId,
                code,
                language
            });
            setResults(res.data);
        } catch (error) {
            alert("Submission failed. Please check your connection.");
        } finally {
            setSubmitting(false);
        }
    };

    const getIOHint = () => {
        switch (language) {
            case "javascript":
                return `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);\nconst a = parseInt(input[0]);\nconst b = parseInt(input[1]);\nconsole.log(a + b);`;
            case "python":
                return `import sys\ninput_data = sys.stdin.read().split()\nif len(input_data) >= 2:\n    a = int(input_data[0])\n    b = int(input_data[1])\n    print(a + b)`;
            case "java":
                return `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            System.out.println(a + b);\n        }\n    }\n}`;
            case "cpp":
                return `#include <iostream>\nint main() {\n    int a, b;\n    if (std::cin >> a >> b) {\n        std::cout << a + b;\n    }\n    return 0;\n}`;
            default:
                return "";
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!challenge) return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6 text-red-400">
                <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Challenge Not Found</h2>
            <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
                The challenge you're looking for doesn't exist, or the ID has changed due to a recent platform update.
            </p>
            <button
                onClick={() => navigate("/user/challenges")}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
                <ChevronLeft className="w-5 h-5" />
                Back to Challenges
            </button>
        </div>
    );

    return (
        <div className="h-screen bg-slate-900 text-white font-sans flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden grid lg:grid-cols-12">
                {/* Left: Problem Statement */}
                <div className="lg:col-span-4 border-r border-slate-800 pt-6 px-8 pb-8 overflow-y-auto custom-scrollbar">

                    <button
                        onClick={() => navigate("/user/challenges")}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Challenges
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <Award className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Challenge</span>
                    </div>

                    <h1 className="text-3xl font-extrabold mb-6 tracking-tight">{challenge.title}</h1>

                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed mb-6">
                        <p className="whitespace-pre-wrap">{challenge.description}</p>
                    </div>

                    {/* Sample Test Cases Section */}
                    <div className="mb-6 space-y-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">Sample Test Cases</span>
                        </div>
                        <div className="space-y-3">
                            {challenge.testCases?.slice(0, 1).map((test, idx) => (
                                <div key={idx} className="bg-slate-800/20 rounded-xl border border-slate-700/50 overflow-hidden">
                                    <div className="flex bg-slate-800/40 border-b border-slate-700/50 divide-x divide-slate-700/50">
                                        <div className="flex-1 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Input</div>
                                        <div className="flex-1 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Expected Output</div>
                                    </div>
                                    <div className="flex divide-x divide-slate-700/50 font-mono text-xs">
                                        <div className="flex-1 px-4 py-3 text-blue-300 bg-slate-900/30 whitespace-pre-wrap">{test.input || "(empty)"}</div>
                                        <div className="flex-1 px-4 py-3 text-emerald-300 bg-slate-900/30 whitespace-pre-wrap">{test.expectedOutput}</div>
                                    </div>
                                </div>
                            ))}
                            {challenge.testCases?.length > 1 && (
                                <p className="text-[10px] text-slate-500 italic px-1">
                                    + {challenge.testCases.length - 1} more hidden test cases
                                </p>
                            )}
                        </div>
                    </div>

                    {/* How to Handle Input Section */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5">
                        <button
                            onClick={() => setShowHints(!showHints)}
                            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-blue-500/10"
                        >
                            <div className="flex items-center gap-2 text-blue-400">
                                <Info className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">How to handle input?</span>
                            </div>
                            {showHints ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                        </button>
                        {showHints && (
                            <div className="px-4 pb-4 animate-in slide-in-from-top-2">
                                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                                    Submissions use <code className="text-blue-300 bg-blue-500/10 px-1 rounded">stdin</code>.
                                    Read inputs based on the problem description:
                                </p>
                                <pre className="p-3 bg-slate-950 rounded-xl text-[10px] font-mono text-blue-200 border border-slate-800 overflow-x-auto">
                                    {getIOHint()}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Points/Difficulty */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                            <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Difficulty</span>
                            <span className="font-bold text-blue-400">{challenge.difficulty}</span>
                        </div>
                        <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                            <span className="block text-xs text-slate-500 uppercase font-bold mb-1">XP Points</span>
                            <span className="font-bold text-yellow-500">+50 XP</span>
                        </div>
                    </div>

                    {results && (
                        <div className={`p-6 rounded-2xl border ${results.allPassed ? "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "bg-red-500/10 border-red-500/20"} animate-in zoom-in-95`}>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className={`text-lg font-bold flex items-center gap-2 ${results.allPassed ? "text-emerald-400" : "text-red-400"}`}>
                                    {results.allPassed ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    {results.allPassed ? "All Tests Passed!" : "Submission Failed"}
                                </h4>
                                <span className="text-xs font-mono opacity-50">Score: {results.allPassed ? "100/100" : "0/100"}</span>
                            </div>

                            {results.allPassed && (
                                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">XP Credited</p>
                                                <p className="text-xl font-black text-white">+{results.xpAwarded || 50} XP</p>
                                            </div>
                                        </div>
                                        {results.leveledUp && (
                                            <div className="flex flex-col items-end">
                                                <div className="px-3 py-1 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                                                    Level Up!
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                {results.results.map((res, i) => (
                                    <div key={i} className="flex flex-col gap-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400 font-medium">Test Case {i + 1}</span>
                                            <span className={res.passed ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                                                {res.passed ? "Passed" : "Failed"}
                                            </span>
                                        </div>
                                        {!res.passed && (
                                            <div className="mt-1 space-y-1.5 font-mono text-[10px]">
                                                <div className="flex gap-2">
                                                    <span className="text-slate-500 w-16">Expected:</span>
                                                    <span className="text-emerald-400 break-all">{res.expected || "(empty)"}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-slate-500 w-16">Actual:</span>
                                                    <span className="text-red-400 break-all">{res.actual || res.error || "(empty)"}</span>
                                                </div>
                                                {res.status && (
                                                    <div className="text-[9px] text-slate-600 italic mt-1">
                                                        Status: {res.status}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Code Editor & Submission */}
                <div className="lg:col-span-8 flex flex-col bg-slate-950 divide-y divide-slate-800">
                    <div className="flex items-center justify-between px-6 py-3 bg-slate-900/80 border-b border-slate-800">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg text-xs font-mono text-slate-400 border border-slate-700">
                                <Terminal className="w-3 h-3" /> main.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}
                            </div>

                            <div className="relative group">
                                <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-slate-800 border border-slate-700 pl-8 pr-4 py-1.5 rounded-xl text-xs font-semibold appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-slate-700 transition-colors cursor-pointer text-slate-300"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleRunCode}
                                disabled={running || submitting}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                Run Code
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || running}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                            >
                                {submitting ? <Clock className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-current" />}
                                Submit Solution
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative bg-slate-900">
                        <Editor
                            height="100%"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            options={{
                                fontSize: 14,
                                lineNumbers: "on",
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 20 },
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            }}
                            onChange={(value) => setCode(value)}
                        />
                    </div>

                    {/* Console Output */}
                    <div className="h-[25vh] bg-slate-950 p-5 overflow-auto custom-scrollbar flex flex-col">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> Console Output
                            </h3>
                            {running && <div className="text-[10px] text-blue-400 animate-pulse font-bold uppercase">Executing...</div>}
                        </div>

                        <pre className="font-mono text-xs leading-relaxed flex-1">
                            {output ? (
                                <div className={output.includes("Error") ? "text-red-400" : "text-emerald-400"}>
                                    <span className="opacity-50 mr-2">$</span> {output}
                                </div>
                            ) : (
                                <div className="text-slate-600 italic">No output yet. Run your code to see results.</div>
                            )}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeEditor;
