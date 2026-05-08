/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, TrendingUp, History, Info, Menu, X, Github } from 'lucide-react';
import { generateExercise } from './lib/gemini';
import ExerciseCard from './components/ExerciseCard';

export default function App() {
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchNewExercise = useCallback(async () => {
    setLoading(true);
    const newEx = await generateExercise();
    setExercise(newEx);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNewExercise();
  }, [fetchNewExercise]);

  return (
    <div className="min-h-screen flex flex-col font-sans" id="app-container">
      {/* Sidebar / Header */}
      <header className="border-b border-indigo-50 bg-white sticky top-0 z-50 px-6 md:px-10 py-6 flex justify-between items-center" id="main-header">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <div className="w-4 h-4 bg-white rounded-full ring-4 ring-white/30"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-indigo-900 tracking-tight leading-none">SPARK.UA</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Creativity Gym</p>
          </div>
        </div>

        <nav className="hidden md:flex gap-8 items-center text-sm font-bold text-slate-500">
          <a href="#" className="text-indigo-600 border-b-2 border-indigo-600 pb-1 px-1">Тренування</a>
          <a href="#" className="hover:text-indigo-500 transition-all">Досягнення</a>
          <a href="#" className="hover:text-indigo-500 transition-all">Прогрес</a>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition-all">Профіль</button>
        </nav>

        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          id="mobile-menu-toggle"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left Stats Column */}
        <aside className="w-80 border-r border-indigo-50 bg-white p-8 hidden md:flex flex-col gap-10">
          <section id="sidebar-nav" className="flex-1">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Навігація</h3>
            <nav className="space-y-3">
              {[
                { icon: '⚡', label: 'Дашборд', active: true },
                { icon: '🎨', label: 'Вправи', active: false },
                { icon: '🏆', label: 'Досягнення', active: false },
                { icon: '📖', label: 'Журнал', active: false },
              ].map(item => (
                <a 
                  key={item.label}
                  href="#" 
                  className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${item.active ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <span className="text-xl">{item.icon}</span> {item.label}
                </a>
              ))}
            </nav>
          </section>

          <section id="daily-tip" className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 shadow-sm shadow-amber-100/50">
            <p className="text-xs font-black text-amber-700 uppercase mb-3 tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> Порада дня
            </p>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              Зміна середовища стимулює нейронні зв'язки. Спробуй працювати в іншому місці сьогодні!
            </p>
          </section>
        </aside>

        {/* Content Section */}
        <section className="flex-1 bg-[#FAFAFF] p-6 md:p-12 lg:p-16" id="workout-area">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[500px]"
                id="loading-state"
              >
                <div className="w-20 h-20 bg-indigo-100 rounded-[32px] flex items-center justify-center text-indigo-600 animate-bounce">
                  <Brain size={40} />
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-8">Готуємо креативні нейрони...</h2>
                <p className="text-slate-400 mt-2 font-medium">Створюємо індивідуальну вправу спеціально для вас.</p>
              </motion.div>
            ) : exercise && (
              <div className="max-w-3xl mx-auto" key="exercise-content">
                <header className="mb-12">
                  <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Привіт, Артеме! 👋</h2>
                  <p className="text-slate-500 text-lg font-medium">Твій креативний м'яз сьогодні готовий до навантажень.</p>
                </header>

                <div className="relative group">
                  {/* Decorative background gradient */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[40px] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                  <ExerciseCard exercise={exercise} onRefresh={fetchNewExercise} />
                </div>
                
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8 flex flex-col justify-between shadow-sm shadow-emerald-100">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-100 mb-6">✍️</div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-900 mb-2">Фрірайтинг</h3>
                      <p className="text-sm text-emerald-800/70 mb-6 leading-relaxed">5 хвилин потоку думок без зупинки та жодної цензури.</p>
                      <div className="flex justify-between items-center text-xs font-black text-emerald-700 uppercase tracking-widest">
                        <span>⏱️ 5 хв</span>
                        <span className="bg-emerald-100 px-2 py-1 rounded-lg">+15 XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-rose-50 border border-rose-100 rounded-[32px] p-8 flex flex-col justify-between shadow-sm shadow-rose-100">
                    <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-rose-100 mb-6">👁️</div>
                    <div>
                      <h3 className="text-lg font-bold text-rose-900 mb-2">Інший кут</h3>
                      <p className="text-sm text-rose-800/70 mb-6 leading-relaxed">Опишіть звичний процес очима мурахи або інопланетянина.</p>
                      <div className="flex justify-between items-center text-xs font-black text-rose-700 uppercase tracking-widest">
                        <span>⏱️ 10 хв</span>
                        <span className="bg-rose-100 px-2 py-1 rounded-lg">+25 XP</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-sky-50 border border-sky-100 rounded-[32px] p-8 flex flex-col justify-between shadow-sm shadow-sky-100">
                    <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-sky-100 mb-6">🧩</div>
                    <div>
                      <h3 className="text-lg font-bold text-sky-900 mb-2">Метод об'єкта</h3>
                      <p className="text-sm text-sky-800/70 mb-6 leading-relaxed">Комбінуйте несумісні характеристики для нового продукту.</p>
                      <div className="flex justify-between items-center text-xs font-black text-sky-700 uppercase tracking-widest">
                        <span>⏱️ 15 хв</span>
                        <span className="bg-sky-100 px-2 py-1 rounded-lg">+40 XP</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-8"
            id="mobile-menu"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <Brain size={24} />
                <h1 className="text-xl font-black uppercase tracking-tighter">Sparky</h1>
              </div>
              <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
            </div>
            <nav className="flex flex-col gap-8 text-4xl font-black uppercase tracking-tighter">
              <a href="#" onClick={() => setIsMenuOpen(false)}>Workout</a>
              <a href="#" className="opacity-20" onClick={() => setIsMenuOpen(false)}>Streak</a>
              <a href="#" className="opacity-20" onClick={() => setIsMenuOpen(false)}>Lab Logs</a>
              <a href="#" className="opacity-20" onClick={() => setIsMenuOpen(false)}>Settings</a>
            </nav>
            <div className="mt-auto pt-8 border-t border-brand-line/10 flex justify-between items-center font-mono text-[10px] uppercase opacity-50">
              <span>© 2026 Sparky Labs</span>
              <Github size={16} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
