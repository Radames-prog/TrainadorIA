import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutPlan, WorkoutSplit, Goal, ExperienceLevel } from './types';
import ProfileEditor from './components/ProfileEditor';
import WorkoutView from './components/WorkoutView';
import { generateWorkout } from './services/geminiService';
import { Bot, Github } from 'lucide-react';

// Initial state for user profile
const defaultProfile: UserProfile = {
  lastWorkout: WorkoutSplit.NONE,
  goal: Goal.HYPERTROPHY,
  level: ExperienceLevel.INTERMEDIATE,
  weeklyFrequency: 4,
  availableTime: 60,
  restrictions: '',
  gender: 'Masculino',
  age: 30,
  weight: 75,
  height: 175,
  daysSinceLastWorkout: 1
};

const STORAGE_KEY = 'smartfit_profile_data';

const App: React.FC = () => {
  // Initialize state from local storage if available, otherwise use default
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Merge saved data with defaultProfile to ensure all fields exist (in case of schema updates)
        return { ...defaultProfile, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to load profile from local storage:", e);
    }
    return defaultProfile;
  });

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save profile to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateWorkout(profile);
      setWorkoutPlan(plan);
      // Auto-update last workout locally for UX (though in real app, we'd save to DB)
      // This is just a visual feedback that the app "moved forward"
      // setProfile(p => ({ ...p, lastWorkout: plan.workoutLetter as WorkoutSplit, daysSinceLastWorkout: 0 })); 
    } catch (err) {
      setError("Não foi possível gerar o treino. Verifique sua chave de API ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              SmartFit <span className="text-emerald-400 font-mono">AI</span>
            </h1>
          </div>
          <a href="#" className="text-slate-500 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-sm underline hover:text-red-300">Fechar</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full lg:h-[calc(100vh-8rem)]">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 h-full">
            <ProfileEditor 
              profile={profile} 
              setProfile={setProfile} 
              onGenerate={handleGenerate} 
              isLoading={loading} 
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 h-full min-h-[500px]">
            <WorkoutView plan={workoutPlan} isLoading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;