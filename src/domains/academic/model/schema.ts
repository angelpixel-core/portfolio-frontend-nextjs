export interface Knowledge {
  paradigm?: string; // Ej: "OOP", "Functional"
  fundamentals: string[]; // Ej: ["Abstraction", "Encapsulation"]
}

export interface EducationInfo {
  topic: string; // Ej: "Computer Science"
  technologies: string[]; // Ej: ["React", "Node.js"]
  knowledge: Knowledge[]; // Lista de conocimientos por paradigma
}

export interface EducationModel {
  id: string;
  type: string; // Ej: "Bachelor's Degree"
  time: string; // Ej: "2016 - 2020"
  place: string; // Ej: "University of Buenos Aires"
  info: EducationInfo[] | string; // Puede venir preformateado o estructurado
}
