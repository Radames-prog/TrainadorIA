import React from 'react';
import { WorkoutPlan } from '../types';
import { Dumbbell, Info, CheckCircle2, Clock } from 'lucide-react';

interface WorkoutViewProps {
  plan: WorkoutPlan | null;
  isLoading: boolean;
}

const WorkoutView: React.FC<WorkoutViewProps> = ({ plan, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed animate-pulse">
        <Dumbbell className="w-16 h-16 text-slate-700 mb-4 animate-bounce" />
        <p className="text-slate-500 text-lg font-medium">A IA está montando sua ficha...</p>
        <p className="text-slate-600 text-sm mt-2">Analisando biomecânica e volume.</p>
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
          Preencha seus dados ao lado e clique em "Gerar Treino" para receber sua rotina personalizada de hoje.
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
      </div>

      {/* Content - Scrollable */}
      <div className="flex-grow overflow-y-auto p-6 custom-scrollbar space-y-8">
        
        {/* Exercises List */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Dumbbell className="w-4 h-4" /> Sequência de Exercícios
          </h3>
          
          <div className="space-y-3">
            {plan.exercises.map((ex, index) => (
              <div 
                key={index} 
                className="group bg-slate-900/50 hover:bg-slate-900 border border-slate-700/50 hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 items-center">
                    <span className="text-slate-600 font-mono text-sm font-bold w-6">{index + 1}.</span>
                    <div>
                      <h4 className="text-white font-semibold text-lg group-hover:text-emerald-300 transition-colors">
                        {ex.name}
                      </h4>
                      {ex.notes && (
                        <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                          <Info className="w-3 h-3" /> {ex.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <div className="font-mono text-emerald-400 font-bold text-lg">{ex.sets} x {ex.reps}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Séries x Reps</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
        <p className="text-xs text-slate-600">
          * Respeite seus limites. Em caso de dor aguda, interrompa o exercício.
        </p>
      </div>
    </div>
  );
};

export default WorkoutView;