import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, RefreshCw, Zap, Star } from 'lucide-react';
import { evaluateCreativity } from '../lib/gemini';

interface Exercise {
  type: string;
  target: string;
  instruction: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onRefresh: () => void;
}

export default function ExerciseCard({ exercise, onRefresh }: ExerciseCardProps) {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const result = await evaluateCreativity(exercise.type, exercise.target, answer);
    setFeedback(result);
    setLoading(false);
  };

  const handleReset = () => {
    setAnswer('');
    setFeedback(null);
    onRefresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-8 border border-indigo-50 shadow-xl shadow-indigo-100"
      id="exercise-card"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
             {exercise.type.replace('_', ' ')}
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{exercise.target}</h2>
        </div>
        <button
          onClick={handleReset}
          className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          title="Refresh Exercise"
          id="refresh-btn"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <p className="mb-8 text-lg text-slate-600 leading-relaxed font-medium">{exercise.instruction}</p>

      {!feedback ? (
        <div className="space-y-6">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ваша креативна відповідь тут..."
            className="w-full h-40 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-indigo-100 focus:bg-white p-6 focus:outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
            id="answer-input"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !answer.trim()}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-100 disabled:opacity-50 transition-all group"
            id="submit-btn"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Аналізувати креативність
              </>
            )}
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-600 rounded-[28px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-300"
            id="feedback-section"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < feedback.score ? "#FCD34D" : "transparent"}
                      stroke={i < feedback.score ? "#FCD34D" : "white"}
                      className={i < feedback.score ? "text-amber-300" : "opacity-30"}
                    />
                  ))}
                </div>
                <span className="text-2xl font-black ml-auto">{feedback.score}/10</span>
              </div>
              <p className="text-lg leading-relaxed mb-8 italic text-indigo-50">
                "{feedback.feedback}"
              </p>
              <button
                onClick={handleReset}
                className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-indigo-50 transition-all text-sm shadow-md"
                id="next-exercise-btn"
              >
                Наступний виклик
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <Zap size={14} className="text-amber-400" /> Powered by Gemini Neural Engine
      </div>
    </motion.div>
  );
}
