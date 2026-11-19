import Dexie, { type Table } from 'dexie';

export interface WorkoutSessionRecord {
  id?: number;
  ts: number;
  date: string; // YYYY-MM-DD
  dayIndex: number;
  dayName: string;
  totalSets: number;
  totalReps: number;
  durationMinutes: number;
  exercisesLogged: Record<string, { setIndex: number; reps: number; load: string }[]>;
}

export interface BodyweightRecord {
  id?: number;
  date: string;
  weightKg: number;
}

export interface DailyFoodRecord {
  date: string; // primary key
  proteinGrams: number;
  caloriesKcal: number;
}

export interface ExerciseLastLog {
  exerciseId: string; // primary key
  lastUpdated: number;
  sets: { reps: string; load: string; completed?: boolean }[];
}

export class HypertrophyDatabase extends Dexie {
  sessions!: Table<WorkoutSessionRecord, number>;
  bodyweight!: Table<BodyweightRecord, number>;
  foodLogs!: Table<DailyFoodRecord, string>;
  exerciseLastLogs!: Table<ExerciseLastLog, string>;

  constructor() {
    super('HypertrophyCoach3D_DB');
    this.version(1).stores({
      sessions: '++id, ts, date, dayIndex',
      bodyweight: '++id, date',
      foodLogs: 'date',
      exerciseLastLogs: 'exerciseId, lastUpdated'
    });
  }
}

export const db = new HypertrophyDatabase();
