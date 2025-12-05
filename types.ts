
export enum WorkoutSplit {
  A = 'A',
  B = 'B',
  C = 'C',
  NONE = 'NONE'
}

export enum Goal {
  HYPERTROPHY = 'Hipertrofia',
  WEIGHT_LOSS = 'Perda de Peso',
  HYPERTROPHY_AND_WEIGHT_LOSS = 'Hipertrofia e Perda de Peso',
  STRENGTH = 'Ganho de Força',
  CONDITIONING = 'Condicionamento Geral'
}

export enum ExperienceLevel {
  BEGINNER = 'Iniciante',
  INTERMEDIATE = 'Intermediário',
  ADVANCED = 'Avançado'
}

export interface UserProfile {
  lastWorkout: WorkoutSplit;
  goal: Goal;
  level: ExperienceLevel;
  weeklyFrequency: number; // days per week
  availableTime: number; // minutes
  restrictions: string; // Free text for now
  gender: 'Masculino' | 'Feminino' | 'Outro';
  age: number;
  weight: number; // kg
  height: number; // cm
  daysSinceLastWorkout: number;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  notes?: string;
}

export interface WorkoutPlan {
  workoutLetter: string; // A, B, or C
  targetMuscles: string;
  summary: string;
  exercises: Exercise[];
  observations: string[];
  loadAdjustmentAdvice: string; // Specific advice on weight management
}
