
import React, { useState, useEffect } from 'react';
import { WorkoutPlan } from '../types';
import { Dumbbell, Info, CheckCircle2, ShieldCheck, Scale, History, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WorkoutViewProps {
  plan: WorkoutPlan | null;
  isLoading: boolean;
}

const STORAGE_WEIGHTS_KEY = 'smartfit_exercise_weights';

const WorkoutView: React.FC<WorkoutViewProps> = ({ plan, isLoading }) => {
  // State to store current user inputs: { "Exercise Name": "50" }
  const [exerciseWeights, setExerciseWeights] = useState<Record<string, string>>({});
  
  // State to store the weights loaded from storage (baseline for comparison)
  const [previousWeights, setPreviousWeights] = useState<Record<string, string>>({});

  // Load weights from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WEIGHTS_KEY);
      if (saved) {
        const parsedWeights = JSON.parse(saved);
        setExerciseWeights(parsedWeights);
        // We capture the "baseline" weights only once on mount to compare progress during this session
        setPreviousWeights(parsedWeights);
      }
    } catch (e) {
      console.warn("Failed to load weights", e);
    }
  }, []);

  // Handler to update weight and save to local storage
  const handleWeightChange = (exerciseName: string, weight: string) => {
    // Normalize key to improve matching (lowercase, trimmed)
    const key = exerciseName.trim();
    
    const newWeights = { ...exerciseWeights, [key]: weight };
    setExerciseWeights(newWeights);
    localStorage.setItem(STORAGE_WEIGHTS_KEY, JSON.stringify(newWeights));
  };

  // Helper to render progress indicator
  const renderProgress = (name: string, currentVal: string) => {
    const key = name.trim();
    const prevVal = previousWeights[key];

    if (!prevVal || !currentVal) return null;

    const current = parseFloat(currentVal.replace(',', '.'));
    const previous = parseFloat(prevVal.replace(',', '.'));

    if (isNaN(current) || isNaN(previous) || previous === 0) return null;

    const diff = current - previous;
    const percentage = ((diff / previous) * 100).toFixed(0);

    if (diff > 0) {
      return (
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 absolute -bottom-5 right-0">
          <TrendingUp className="w-3 h-3" />
          <span>+{percentage}%</span>
        </div>
      );
    } else if (diff < 0) {
      return (
        <div className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 absolute -bottom-5 right-0">
          <TrendingDown className="w-3 h-3" />
          <span>{percentage}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium absolute -bottom-5 right-0">
          <Minus className="w-3 h-3" />
          <span>Manter</span>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed animate-pulse">
        <Dumbbell className="w-16 h-16 text-slate-700 mb-4 animate-bounce" />
        <p className="text-slate-500 text-lg font-medium">A IA está montando sua ficha...</p>
        <p className="text-slate-600 text-sm mt-2">Calculando biomecânica, segurança articular e volume.</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
        <div className="bg-slate-800 p-4 rounded-full mb-4">
          <Dumbbell className="w-12 h-12 text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Pronto para treinar?</h3>
        <p className="text-slate-400 text-center max-w-md">
          Preencha seus dados ao lado e clique em "Gerar Treino" para receber sua rotina personalizada com foco em segurança e resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 overflow-hidden flex flex-col h-full max-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-emerald-500 text-slate-900 font-black text-2xl w-10 h-10 flex items-center justify-center rounded-lg shadow-lg shadow-emerald-500/20">
                {plan.workoutLetter}
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Treino do Dia</h2>
            </div>
            <p className="text-emerald-400 font-medium ml-13">{plan.targetMuscles}</p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Foco</span>
            <span className="text-slate-200 bg-slate-700/50 px-3 py-1 rounded-full text-sm border border-slate-600">
              {plan.summary}
            </span>
          </div>
        </div>
        
        {/* Safety Badge */}
        <div className="mt-4 flex items-center gap-2 bg-slate-900/50 py-1.5 px-3 rounded-lg border border-slate-700/50 w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs text-slate-400 font-medium">Treino verificado para seu perfil biométrico</span>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-grow overflow-y-auto p-6 custom-scrollbar space-y-8">
        
        {/* Exercises List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4" /> Sequência de Exercícios
            </h3>
            <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Registre suas cargas para acompanhar o progresso
            </span>
          </div>
          
          <div className="space-y-4">
            {plan.exercises.map((ex, index) => {
              const currentWeight = exerciseWeights[ex.name.trim()] || '';
              
              return (
                <div 
                  key={index} 
                  className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-700/50 hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex gap-4 items-start sm:items-center flex-grow">
                      <span className="text-slate-600 font-mono text-sm font-bold w-6 pt-1 sm:pt-0">{index + 1}.</span>
                      <div className="flex-grow">
                        <h4 className="text-white font-semibold text-lg group-hover:text-emerald-300 transition-colors">
                          {ex.name}
                        </h4>
                        {ex.notes && (
                          <p className="text-slate-400 text-sm mt-1 flex items-start gap-1.5">
                            <Info className="w-3 h-3 mt-1 sm:mt-0.5 flex-shrink-0 text-emerald-500/70" /> 
                            <span>{ex.notes}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Controls Row: Weight Input & Sets Display */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0 pl-10 sm:pl-0">
                      
                      {/* Weight Input */}
                      <div className="flex flex-col items-end mr-2 relative mb-1">
                         <div className="relative group/input z-10">
                           <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                             <History className="w-3 h-3 text-slate-500 group-focus-within/input:text-emerald-500 transition-colors" />
                           </div>
                           <input 
                              type="text" 
                              inputMode="decimal"
                              placeholder="0"
                              value={currentWeight}
                              onChange={(e) => handleWeightChange(ex.name, e.target.value)}
                              className="w-20 bg-slate-950 border border-slate-700 rounded-md py-1.5 pl-7 pr-2 text-right text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono"
                           />
                           <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 pointer-events-none hidden group-hover:block">kg</span>
                         </div>
                         <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider mt-1 mb-2">Carga (Kg)</span>
                         
                         {/* Progress Indicator */}
                         {renderProgress(ex.name, currentWeight)}
                      </div>

                      {/* Sets & Reps */}
                      <div className="text-right min-w-[80px]">
                        <div className="font-mono text-emerald-400 font-bold text-lg">{ex.sets} x {ex.reps}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Séries x Reps</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Load Adjustment Advice (New Section) */}
        {plan.loadAdjustmentAdvice && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-4 items-start">
            <div className="bg-amber-500/20 p-2 rounded-lg shrink-0">
              <Scale className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-amber-500 font-bold text-sm uppercase tracking-wider mb-1">
                Ajuste de Carga Recomendado
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {plan.loadAdjustmentAdvice}
              </p>
            </div>
          </div>
        )}

        {/* Observations */}
        <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
           <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
             <CheckCircle2 className="w-4 h-4" /> Observações do Treinador
           </h3>
           <ul className="space-y-2">
             {plan.observations.map((obs, idx) => (
               <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm leading-relaxed">
                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                 {obs}
               </li>
             ))}
           </ul>
        </div>

      </div>
      
      {/* Footer / Disclaimer */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/30 text-center">
        <p className="text-xs text-slate-500">
          * A SmartFit AI utiliza seus dados (Idade, Peso, Restrições) para sugerir este treino. Respeite seus limites.
        </p>
      </div>
    </div>
  );
};

export default WorkoutView;
