import { X, Sparkles, Clock, Layers, Award, BookOpen, GraduationCap } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4" id="about-modal-container">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />

      {/* Modal Dialog container */}
      <div className="bg-white dark:bg-[#0f1326] border border-slate-200 dark:border-[#1d2442] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative z-10 animate-scale-up flex flex-col max-h-[85vh]">
        {/* Top brand header bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="p-6 border-b border-slate-100 dark:border-[#1d2442]/60 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-[#0a0d1b]/40">
          <div className="flex items-center gap-3 select-none">
            <div className="h-9 w-9 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-sans font-black text-slate-900 dark:text-white text-base">About QuizMaster</h3>
              <p className="text-[9.5px] font-mono uppercase tracking-wider text-slate-405 dark:text-slate-550 leading-none mt-0.5">
                Technical overview of our interactive engine
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1c234a] rounded-lg text-slate-404 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer"
            id="close-about-btn"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left font-sans text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans leading-snug">
              What is QuizMaster?
            </h4>
            <p className="text-xs sm:text-[13px] leading-relaxed">
              QuizMaster is a responsive, client-first interactive assessment platform created to audit proficiency in Computer Science, Astronomy, History, Geography, and Pop Culture. The tool supports instant switching between local snapshot databases and full REST API delivery, giving you an end-to-end evaluation flow.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-[#1d2442]/50 my-2" />

          {/* Scoring Mechanisms Panel */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Academic Scoring Mechanisms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-3.5 bg-slate-50 dark:bg-[#0c0f1e] rounded-2xl border border-slate-205/60 dark:border-[#1d2442]/40 flex items-start gap-3">
                <div className="text-amber-500 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-white text-xs leading-none">Complexity Weighting</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
                    Points reward difficulty:
                    <br />• Easy: <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">10 PTS</span>
                    <br />• Medium: <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">15 PTS</span>
                    <br />• Hard: <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">20 PTS</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-[#0c0f1e] rounded-2xl border border-slate-205/60 dark:border-[#1d2442]/40 flex items-start gap-3">
                <div className="text-blue-500 mt-0.5">
                  <Clock className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-white text-xs leading-none">Velocity Bonus</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
                    Lock in quick responses! An additional <span className="text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">+5 PTS speed bonus</span> is gained for correct answers completed within 5 seconds of the countdown.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-[#1d2442]/50 my-2" />

          {/* Interactive features summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Interactive Engines Includes
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-500 mt-0.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200 font-bold">Dual-Source Pipelines:</strong> Play instantly using the secure packed offline database or fetch dynamic global sets from online databases.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-500 mt-0.5 shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200 font-bold">Academic Commentary:</strong> Review missed content immediately with explanatory cards and fact descriptions detailing each outcome.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-500 mt-0.5 shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-800 dark:text-slate-200 font-bold">Local Syncing Records:</strong> High scores are cached fully inside your local sandboxed browser storage for frictionless retention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4.5 bg-slate-50/50 dark:bg-[#0a0d1b]/40 border-t border-slate-100 dark:border-[#1d2442]/60 shrink-0 flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">
          <span>Version 1.25.0 // stable</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 hover:bg-slate-200 dark:bg-[#11162d] dark:hover:bg-[#1d2442] text-slate-600 dark:text-slate-400 dark:hover:text-white border border-slate-205 dark:border-[#1d2442] hover:border-slate-405 transition-all text-xs font-bold leading-none rounded-xl cursor-pointer hover:scale-105 active:scale-95"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
}
