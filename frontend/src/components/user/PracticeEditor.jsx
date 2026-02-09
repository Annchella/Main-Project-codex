import React, { useState } from "react";
import api from "../../services/api";
import Editor from "@monaco-editor/react";
import { Play, Sparkles, Terminal, RefreshCw, AlertCircle, X, ChevronRight, Settings } from "lucide-react";

const PracticeEditor = () => {
  const [code, setCode] = useState("// Write your algorithmic code here...\n\nfunction solution() {\n  // your logic\n}");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiReview, setAiReview] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/compile/run", {
        code,
        language
      });
      setOutput(res.data.output);
    } catch (error) {
      setOutput("Error: Internal execution failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleAiReview = async () => {
    setReviewLoading(true);
    setShowAiPanel(true);
    setAiReview("");
    try {
      const res = await api.post("/api/ai/review", {
        code,
        language
      });
      setAiReview(res.data.review);
    } catch (error) {
      setAiReview("AI Review failed. Make sure your mentor is online!");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-900 text-white font-sans flex flex-col overflow-hidden">

      <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
        <header className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Terminal className="text-blue-500 w-6 h-6" />
              Practice <span className="text-blue-400">Editor</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1">Master your logic with real-time feedback</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 pl-8 pr-4 py-2 rounded-xl text-xs font-semibold appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-slate-700 transition-colors cursor-pointer text-slate-300"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <button
              onClick={handleAiReview}
              className="group flex items-center gap-2 px-5 py-2.5 bg-purple-600/10 border border-purple-500/20 text-purple-400 font-bold rounded-xl hover:bg-purple-600/20 transition-all hover:scale-105 text-xs"
            >
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              AI Code Mentor
            </button>
            <button
              onClick={handleRun}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-xs shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              Run Code
            </button>
          </div>
        </header>

        <div className="flex-1 grid lg:grid-cols-12 gap-6 overflow-hidden">
          {/* Editor & Console Block */}
          <div className={`flex flex-col overflow-hidden transition-all duration-300 ${showAiPanel ? "lg:col-span-8" : "lg:col-span-12"} bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Tab Bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-b border-slate-700/50 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <span className="ml-2 text-xs font-mono text-slate-500">
                solution.{language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}
              </span>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 relative bg-slate-900/10">
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

            {/* Console Panel */}
            <div className="bg-slate-950 border-t border-slate-800 p-5 h-[20vh] overflow-y-auto custom-scrollbar shrink-0">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Console Output
              </h3>
              <div className="font-mono text-xs leading-relaxed">
                {loading ? (
                  <div className="flex items-center gap-2 text-blue-400 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Executing runtime environment...
                  </div>
                ) : output ? (
                  <div className={output.includes("Error") ? "text-red-400" : "text-emerald-400"}>
                    <span className="opacity-50 mr-2">$</span> {output}
                  </div>
                ) : (
                  <span className="text-slate-600 italic">No output yet. Run your code to see results.</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Mentor Slide-out */}
          {showAiPanel && (
            <div className="lg:col-span-4 bg-slate-800/50 border border-purple-500/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full animate-in slide-in-from-right-4">
              <div className="p-4 bg-purple-600/10 border-b border-purple-500/20 flex justify-between items-center text-purple-400 font-bold shrink-0">
                <span className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-5 h-5 font-bold" /> AI Mentor Feedback
                </span>
                <button onClick={() => setShowAiPanel(false)} className="hover:bg-purple-600/20 p-1 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-900/50">
                {reviewLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-slate-700/50 rounded animate-pulse w-full"></div>
                    <div className="h-32 bg-slate-700/50 rounded animate-pulse w-full mt-8"></div>
                  </div>
                ) : aiReview ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap break-words text-slate-300 leading-relaxed font-sans text-xs">
                      {aiReview}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-100/70">Expert insights generated. Refactor your patterns based on these notes to reach senior-level logic.</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeEditor;
