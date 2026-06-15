import { create } from 'zustand';
import {
  inmates,
  courses,
  courseHours,
  trainings,
  assessments,
  crisisInterventions,
  behaviorRecords,
  violations,
  familyVisits,
  releaseAssessments,
  jobOpportunities,
} from '@/data/mockData';
import {
  Inmate,
  Course,
  CourseHour,
  Training,
  Assessment,
  CrisisIntervention,
  BehaviorRecord,
  Violation,
  FamilyVisit,
  ReleaseAssessment,
  JobOpportunity,
} from '@/types';

interface AppState {
  inmates: Inmate[];
  courses: Course[];
  courseHours: CourseHour[];
  trainings: Training[];
  assessments: Assessment[];
  crisisInterventions: CrisisIntervention[];
  behaviorRecords: BehaviorRecord[];
  violations: Violation[];
  familyVisits: FamilyVisit[];
  releaseAssessments: ReleaseAssessment[];
  jobOpportunities: JobOpportunity[];
  activeInmate: Inmate | null;
  setActiveInmate: (inmate: Inmate | null) => void;
  searchInmates: (keyword: string) => Inmate[];
}

export const useStore = create<AppState>((set, get) => ({
  inmates,
  courses,
  courseHours,
  trainings,
  assessments,
  crisisInterventions,
  behaviorRecords,
  violations,
  familyVisits,
  releaseAssessments,
  jobOpportunities,
  activeInmate: null,
  setActiveInmate: (inmate) => set({ activeInmate: inmate }),
  searchInmates: (keyword) => {
    const { inmates } = get();
    if (!keyword.trim()) return inmates;
    return inmates.filter(
      (inmate) =>
        inmate.name.includes(keyword) ||
        inmate.inmateNumber.includes(keyword) ||
        inmate.prisonZone.includes(keyword)
    );
  },
}));
