export type IsoDateString = string;
export type CalendarYearString = string;
export type UrlString = string;

export interface BaseRecord {
  id: string;
  archived: boolean;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface WorkHistoryRecord extends BaseRecord {
  title: string;
  company: string;
  startDate: IsoDateString;
  endDate: IsoDateString | null;
  responsibilities: string[];
  clients: string[];
  technologies: string[];
  projects: string[];
  links: UrlString[];
  feedbackRecognition: string[];
  awards: string[];
  lessonsLearned: string[];
  successes: string[];
  failures: string[];
}

export interface EducationCourseRecord {
  id: string;
  programId: string;
  course: string;
  year: CalendarYearString;
  skills: string[];
  topics: string[];
  synopsis: string;
  comments: string;
  links: UrlString[];
}

export interface EducationRecord extends BaseRecord {
  program: string;
  institution: string;
  startDate: IsoDateString;
  endDate: IsoDateString | null;
  skills: string[];
  description: string;
  comments: string;
  links: UrlString[];
  courseIds?: string[];
  courses: EducationCourseRecord[];
}

export interface InterestRecord extends BaseRecord {
  interestName: string;
  description: string;
  whyItIsInteresting: string;
  howOrWhyDidYouStart: string;
  whatWouldYouLoveToDoWithIt: string;
  links: UrlString[];
}

export interface FaqRecord extends BaseRecord {
  question: string;
  answer: string;
  links: UrlString[];
}

export interface KnowledgeBaseData {
  workHistory: WorkHistoryRecord[];
  education: EducationRecord[];
  interests: InterestRecord[];
  faqs: FaqRecord[];
}
