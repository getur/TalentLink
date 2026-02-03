
export type UserType = 'Administrator' | 'Manager' | 'Member';

export type Department = 
  | 'OGV' | 'oGTa' | 'oGTe' | 'iGV' | 'iGTa' | 'iGTe' | 'iCX' 
  | 'MKT' | 'MKT B2C' | 'MKT B2B' | 'EwA' | 'BD' | 'PR' | 'MXP' | 'F&L' | 'ECB';

export type PositionType = 'OC' | 'EST/NST' | 'LCVP' | 'LCP' | 'MCVP' | 'MCP';

export type Office = 'MC' | 'LC Beira' | 'LC ISCTEM' | 'LC GAZA' | 'LC UEM';

export type Duration = 'Short' | 'Medium' | 'Long';

export type OpportunityStatus = 'Active' | 'Archived' | 'Draft';

export type ApplicationStatus = 'Pending' | 'Interviewing' | 'Accepted' | 'Rejected';

export interface Education {
  institution_name: string;
  degree: string;
  field_of_study: string;
  status: 'Ongoing' | 'Completed' | 'Paused';
  start_date: string;
  end_date?: string;
  description: string;
}

export interface ProfessionalExperience {
  organization: string;
  title: string;
  is_external: boolean;
  location: string;
  start_date: string;
  end_date?: string;
  responsibilities: string;
}

export interface Skill {
  skill_name: string;
  category: 'Hard' | 'Soft';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Language {
  language_name: string;
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Fluent' | 'Native';
  certifications?: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  user_type: UserType;
  linkedin_url?: string;
  // Member Details
  birthday?: string;
  country?: string;
  address?: string;
  join_date?: string;
  office?: Office;
  current_pos_type?: PositionType;
  department?: Department;
  cv_link?: string;
  bio?: string;
  education: Education[];
  professional: ProfessionalExperience[];
  skills: Skill[];
  languages: Language[];
  saved_opportunity_ids: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  department: Department;
  pos_type: PositionType;
  duration: Duration;
  office: Office;
  description: string; // Markdown supported
  post_date: string;
  due_date: string;
  status: OpportunityStatus;
  responsible_contact: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  questionnaire: string[]; // Array of questions
  logo?: string;
}

export interface Application {
  id: string;
  opportunity_id: string;
  user_id: string;
  applied_at: string;
  answers: Record<string, string>; // Questionnaire responses
  status: ApplicationStatus;
}
