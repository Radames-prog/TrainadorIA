import React from 'react';
import { UserProfile, Goal, ExperienceLevel, WorkoutSplit } from '../types';
import { Activity, Calendar, Clock, AlertCircle, User, Ruler, Weight } from 'lucide-react';

interface ProfileEditorProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, setProfile, onGenerate, isLoading }) => {
  
  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-500/10 rounded-full">
          <User className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Perfil do Atleta</h2>
          <p className="text-slate-400 text-sm">Configure seus dados para o treino de hoje</p>
        </div>
      </div>

      <div className="space-y-5 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Row 1: Gender & Age */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Gênero</label>
            <select
              value={profile.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            >
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Idade</label>
            <div className="relative">
              <input
                type="number"
                min="14"
                max="100"
                value={profile.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-3 top-3.5 text-slate-500 text-xs font-bold">ANOS</span>
            </div>
          </div>
        </div>

        {/* Row 2: Weight & Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Peso</label>
            <div className="relative">
              <Weight className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min="30"
                max="300"
                value={profile.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-9 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-3 top-3.5 text-slate-500 text-xs font-bold">KG</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Altura</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="number"
                min="100"
                max="250"
                value={profile.height}
                onChange={(e) => handleChange('height', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-9 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute right-3 top-3.5 text-slate-500 text-xs font-bold">CM</span>
            </div>
          </div>
        </div>

        {/* Row 3: Split & Days Since */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Último Treino</label>
            <select
              value={profile.lastWorkout}
              onChange={(e) => handleChange('lastWorkout', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            >
              <option value={WorkoutSplit.NONE}>Nenhum (Começar)</option>
              <option value={WorkoutSplit.A}>Treino A</option>
              <option value={WorkoutSplit.B}>Treino B</option>
              <option value={WorkoutSplit.C}>Treino C</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Dias sem treinar</label>
            <input
              type="number"
              min="0"
              value={profile.daysSinceLastWorkout}
              onChange={(e) => handleChange('daysSinceLastWorkout', Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Objetivo Atual</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(Goal).map((g) => (
              <button
                key={g}
                onClick={() => handleChange('goal', g)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  profile.goal === g 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Level & Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Nível</label>
             <select
                value={profile.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none"
             >
               {Object.values(ExperienceLevel).map(l => <option key={l} value={l}>{l}</option>)}
             </select>
          </div>
           <div>
             <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Freq. Semanal</label>
             <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3">
               <Calendar className="w-4 h-4 text-slate-500 mr-2" />
               <input
                  type="number"
                  min="1" max="7"
                  value={profile.weeklyFrequency}
                  onChange={(e) => handleChange('weeklyFrequency', Number(e.target.value))}
                  className="w-full bg-transparent p-3 text-white outline-none"
               />
             </div>
          </div>
        </div>

        {/* Time Available */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Tempo Disponível (min)</label>
          <div className="relative">
             <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
             <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={profile.availableTime}
              onChange={(e) => handleChange('availableTime', Number(e.target.value))}
              className="w-full mt-2 accent-emerald-500"
             />
             <div className="text-right text-xs text-emerald-400 font-mono mt-1">{profile.availableTime} min</div>
          </div>
        </div>

        {/* Restrictions */}
        <div>
           <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Restrições / Lesões</label>
           <div className="relative">
             <AlertCircle className="absolute left-3 top-3 w-4 h-4 text-red-400" />
             <textarea
                value={profile.restrictions}
                onChange={(e) => handleChange('restrictions', e.target.value)}
                placeholder="Ex: Dor no ombro direito, sem impacto..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:border-red-500/50 outline-none min-h-[80px] text-sm"
             />
           </div>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex justify-center items-center gap-2 ${
            isLoading 
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/20 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando Treino...
            </>
          ) : (
            <>
              <Activity className="w-5 h-5" />
              GERAR TREINO DO DIA
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileEditor;