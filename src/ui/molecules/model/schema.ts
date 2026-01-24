// Placeholder types for Education component
// TODO: Move to proper domain model location

export interface EducationKnowledge {
  paradigm?: string;
  fundamentals: string[];
}

export interface EducationInfo {
  topic: string;
  technologies: string[];
  knowledge: EducationKnowledge[];
}

export interface EducationModel {
  type: string;
  time: string;
  place: string;
  info: EducationInfo[] | string;
}
