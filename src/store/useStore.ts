import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Inmate,
  Course,
  CourseHour,
  Training,
  TrainingRecord,
  Assessment,
  CrisisIntervention,
  BehaviorRecord,
  Violation,
  FamilyVisit,
  VideoRecord,
  ReleaseAssessment,
  JobOpportunity,
  InmateProfileStats,
} from '@/types';
import {
  initialInmates,
  initialCourses,
  initialCourseHours,
  initialTrainings,
  initialTrainingRecords,
  initialAssessments,
  initialCrisisInterventions,
  initialBehaviorRecords,
  initialViolations,
  initialFamilyVisits,
  initialVideoRecords,
  initialReleaseAssessments,
  initialJobOpportunities,
} from '@/data/mockData';

interface AppState {
  inmates: Inmate[];
  courses: Course[];
  courseHours: CourseHour[];
  trainings: Training[];
  trainingRecords: TrainingRecord[];
  assessments: Assessment[];
  crisisInterventions: CrisisIntervention[];
  behaviorRecords: BehaviorRecord[];
  violations: Violation[];
  familyVisits: FamilyVisit[];
  videoRecords: VideoRecord[];
  releaseAssessments: ReleaseAssessment[];
  jobOpportunities: JobOpportunity[];
  activeInmate: Inmate | null;

  setActiveInmate: (inmate: Inmate | null) => void;
  searchInmates: (keyword: string, zone?: string) => Inmate[];

  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  addCourseHour: (courseHour: Omit<CourseHour, 'id'>) => void;

  addTraining: (training: Omit<Training, 'id'>) => void;
  updateTraining: (id: string, updates: Partial<Training>) => void;
  addTrainingRecord: (record: Omit<TrainingRecord, 'id'>) => void;
  updateTrainingRecord: (id: string, updates: Partial<TrainingRecord>) => void;

  addBehaviorRecord: (record: Omit<BehaviorRecord, 'id'>) => void;
  updateBehaviorRecord: (id: string, updates: Partial<BehaviorRecord>) => void;
  getBehaviorRecordsByDate: (date: string) => BehaviorRecord[];
  getAvgBehaviorScoreByDate: (date: string) => number;

  updateFamilyVisit: (id: string, updates: Partial<FamilyVisit>) => void;
  addVideoRecord: (record: Omit<VideoRecord, 'id'>) => void;

  addReleaseAssessment: (assessment: Omit<ReleaseAssessment, 'id'>) => void;

  getInmateStats: (inmateId: string) => InmateProfileStats;
  getInmateCourseHours: (inmateId: string) => CourseHour[];
  getInmateTrainings: (inmateId: string) => Training[];
  getInmateAssessments: (inmateId: string) => Assessment[];
  getInmateBehaviorRecords: (inmateId: string, limit?: number) => BehaviorRecord[];
  getInmateFamilyVisits: (inmateId: string) => FamilyVisit[];
  getInmateReleaseAssessment: (inmateId: string) => ReleaseAssessment | undefined;

  getSoonReleaseInmates: (months?: number) => Inmate[];
  calculateJobMatch: (inmateId: string, jobId: string) => number;

  resetToInitial: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      inmates: initialInmates,
      courses: initialCourses,
      courseHours: initialCourseHours,
      trainings: initialTrainings,
      trainingRecords: initialTrainingRecords,
      assessments: initialAssessments,
      crisisInterventions: initialCrisisInterventions,
      behaviorRecords: initialBehaviorRecords,
      violations: initialViolations,
      familyVisits: initialFamilyVisits,
      videoRecords: initialVideoRecords,
      releaseAssessments: initialReleaseAssessments,
      jobOpportunities: initialJobOpportunities,
      activeInmate: null,

      setActiveInmate: (inmate) => set({ activeInmate: inmate }),

      searchInmates: (keyword, zone) => {
        const { inmates } = get();
        let result = inmates;
        if (zone && zone !== 'all') {
          result = result.filter((i) => i.prisonZone === zone);
        }
        if (keyword.trim()) {
          result = result.filter(
            (inmate) =>
              inmate.name.includes(keyword) ||
              inmate.inmateNumber.includes(keyword)
          );
        }
        return result;
      },

      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses, { ...course, id: generateId() }],
        })),

      updateCourse: (id, updates) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      addCourseHour: (courseHour) =>
        set((state) => ({
          courseHours: [...state.courseHours, { ...courseHour, id: generateId() }],
        })),

      addTraining: (training) =>
        set((state) => ({
          trainings: [...state.trainings, { ...training, id: generateId() }],
        })),

      updateTraining: (id, updates) =>
        set((state) => ({
          trainings: state.trainings.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      addTrainingRecord: (record) =>
        set((state) => ({
          trainingRecords: [...state.trainingRecords, { ...record, id: generateId() }],
        })),

      updateTrainingRecord: (id, updates) =>
        set((state) => ({
          trainingRecords: state.trainingRecords.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      addBehaviorRecord: (record) =>
        set((state) => ({
          behaviorRecords: [...state.behaviorRecords, { ...record, id: generateId() }],
        })),

      updateBehaviorRecord: (id, updates) =>
        set((state) => ({
          behaviorRecords: state.behaviorRecords.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      getBehaviorRecordsByDate: (date) => {
        const { behaviorRecords, inmates } = get();
        const records = behaviorRecords.filter((r) => r.date === date);
        const existingInmateIds = new Set(records.map((r) => r.inmateId));
        const missingRecords = inmates
          .filter((i) => !existingInmateIds.has(i.id) && i.status === '在押')
          .map((i) => ({
            id: `temp-${i.id}`,
            inmateId: i.id,
            inmateName: i.name,
            date,
            discipline: 0,
            labor: 0,
            study: 0,
            cooperation: 0,
            totalScore: 0,
            remark: '待评分',
          }));
        return [...records, ...missingRecords];
      },

      getAvgBehaviorScoreByDate: (date) => {
        const records = get().getBehaviorRecordsByDate(date);
        const scoredRecords = records.filter((r) => r.totalScore > 0);
        if (scoredRecords.length === 0) return 0;
        return (
          scoredRecords.reduce((sum, r) => sum + r.totalScore, 0) /
          scoredRecords.length
        );
      },

      updateFamilyVisit: (id, updates) =>
        set((state) => ({
          familyVisits: state.familyVisits.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        })),

      addVideoRecord: (record) =>
        set((state) => ({
          videoRecords: [...state.videoRecords, { ...record, id: generateId() }],
        })),

      addReleaseAssessment: (assessment) =>
        set((state) => ({
          releaseAssessments: [
            ...state.releaseAssessments,
            { ...assessment, id: generateId() },
          ],
        })),

      getInmateStats: (inmateId) => {
        const {
          courseHours,
          trainings,
          trainingRecords,
          assessments,
          behaviorRecords,
          familyVisits,
          releaseAssessments,
        } = get();

        const inmateCourseHours = courseHours.filter(
          (h) => h.inmateId === inmateId && h.status === '已完成'
        );
        const totalCourseHours = inmateCourseHours.reduce(
          (sum, h) => sum + h.hours,
          0
        );
        const completedCourses = new Set(
          inmateCourseHours.map((h) => h.courseId)
        ).size;

        const inmateTrainingRecords = trainingRecords.filter(
          (r) => r.inmateId === inmateId
        );
        const activeTrainings = inmateTrainingRecords.filter(
          (r) => r.progress < 100
        ).length;
        const completedTrainings = inmateTrainingRecords.filter(
          (r) => r.progress >= 100 || r.passed
        ).length;

        const inmateAssessments = assessments.filter(
          (a) => a.inmateId === inmateId
        );
        const latestAssessment = inmateAssessments.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        const inmateBehaviorRecords = behaviorRecords.filter(
          (r) => r.inmateId === inmateId && r.totalScore > 0
        );
        const avgBehaviorScore =
          inmateBehaviorRecords.length > 0
            ? inmateBehaviorRecords.reduce((sum, r) => sum + r.totalScore, 0) /
              inmateBehaviorRecords.length
            : 0;

        const totalFamilyVisits = familyVisits.filter(
          (v) => v.inmateId === inmateId
        ).length;

        const inmateReleaseAssessment = releaseAssessments.find(
          (r) => r.inmateId === inmateId
        );

        return {
          totalCourseHours,
          completedCourses,
          activeTrainings,
          completedTrainings,
          latestPsychologyLevel: latestAssessment?.level || '未测评',
          avgBehaviorScore: Math.round(avgBehaviorScore * 10) / 10,
          totalFamilyVisits,
          hasReleaseAssessment: !!inmateReleaseAssessment,
          releaseAssessmentResult: inmateReleaseAssessment?.result,
        };
      },

      getInmateCourseHours: (inmateId) => {
        return get().courseHours.filter((h) => h.inmateId === inmateId);
      },

      getInmateTrainings: (inmateId) => {
        const { trainings, trainingRecords } = get();
        const inmateRecordIds = trainingRecords
          .filter((r) => r.inmateId === inmateId)
          .map((r) => r.trainingId);
        return trainings.filter((t) => inmateRecordIds.includes(t.id));
      },

      getInmateAssessments: (inmateId) => {
        return get().assessments.filter((a) => a.inmateId === inmateId);
      },

      getInmateBehaviorRecords: (inmateId, limit) => {
        const records = get()
          .behaviorRecords.filter((r) => r.inmateId === inmateId)
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        return limit ? records.slice(0, limit) : records;
      },

      getInmateFamilyVisits: (inmateId) => {
        return get()
          .familyVisits.filter((v) => v.inmateId === inmateId)
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      },

      getInmateReleaseAssessment: (inmateId) => {
        return get().releaseAssessments.find((r) => r.inmateId === inmateId);
      },

      getSoonReleaseInmates: (months = 12) => {
        const { inmates } = get();
        const now = new Date('2024-01-15');
        return inmates.filter((i) => {
          const releaseDate = new Date(i.releaseDate);
          const diffMonths =
            (releaseDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24 * 30);
          return diffMonths <= months && diffMonths > 0 && i.status === '在押';
        });
      },

      calculateJobMatch: (inmateId, jobId) => {
        const { inmates, jobOpportunities, releaseAssessments } = get();
        const inmate = inmates.find((i) => i.id === inmateId);
        const job = jobOpportunities.find((j) => j.id === jobId);
        const assessment = releaseAssessments.find(
          (r) => r.inmateId === inmateId
        );

        if (!inmate || !job) return 0;

        let score = 0;
        const skillMatches = inmate.skills.filter((s) =>
          job.skills.some((js) => js.includes(s) || s.includes(js))
        ).length;
        score += (skillMatches / Math.max(job.skills.length, 1)) * 60;

        if (assessment) {
          if (assessment.overallScore >= 80) score += 30;
          else if (assessment.overallScore >= 70) score += 20;
          else if (assessment.overallScore >= 60) score += 10;
        } else {
          score += 15;
        }

        if (inmate.educationLevel === '研究生') score += 10;
        else if (inmate.educationLevel === '本科') score += 8;
        else if (inmate.educationLevel === '大专') score += 6;
        else if (inmate.educationLevel === '高中') score += 4;
        else if (inmate.educationLevel === '初中') score += 2;

        return Math.min(Math.round(score), 100);
      },

      resetToInitial: () =>
        set({
          inmates: initialInmates,
          courses: initialCourses,
          courseHours: initialCourseHours,
          trainings: initialTrainings,
          trainingRecords: initialTrainingRecords,
          assessments: initialAssessments,
          crisisInterventions: initialCrisisInterventions,
          behaviorRecords: initialBehaviorRecords,
          violations: initialViolations,
          familyVisits: initialFamilyVisits,
          videoRecords: initialVideoRecords,
          releaseAssessments: initialReleaseAssessments,
          jobOpportunities: initialJobOpportunities,
        }),
    }),
    {
      name: 'prison-education-storage',
    }
  )
);
