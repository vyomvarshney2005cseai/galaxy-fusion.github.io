export type UserRole = 'student' | 'mentor' | 'college_admin';
export type MentorType = 'Faculty' | 'Alumni' | 'Expert';
export type CollabPillar = 'all' | 'student-student' | 'student-faculty' | 'student-college';

export interface CollegeInstance {
  id: string;
  name: string;
  shortName: string;
  city: string;
  university: string;
  domain: string;
  verifiedStudents: number;
  activeTeams: number;
  openingsCount: number;
  accentColor: string;
}

export interface Certification {
  name: string;
  org: string;
  year?: string;
}

export interface Profile {
  id: string;
  college_id?: string;
  college_name?: string;
  name: string;
  roll: string;
  role: UserRole;
  mentor_type?: MentorType | null;
  expertise?: string | null;
  branch?: string;
  year?: string;
  headline?: string;
  bio?: string;
  github_handle?: string;
  linkedin_handle?: string;
  cgpa?: string;
  connections_count?: number;
  commits_count?: number;
  streak_days?: number;
  looking_for_team?: boolean;
  availability_badge?: string;
  profile_image_url?: string | null;
  skills: string[];
  certs: { name: string; org: string }[];
  resume_name?: string | null;
  created_at?: string;
}

export interface ProjectRepo {
  id: string;
  college_id?: string;
  title: string;
  repo_name?: string;
  description: string;
  github_url: string;
  language?: string;
  language_color?: string;
  stars?: number;
  forks?: number;
  commits?: number;
  topics?: string[];
  owner_name?: string;
  owner_roll?: string;
  owner_branch?: string;
  looking_for_contributors?: boolean;
  needed_contributor_skill?: string;
  last_updated?: string;
  user_id: string;
  created_at?: string;
}

export interface CampusPost {
  id: string;
  college_id?: string;
  collab_type: 'student-student' | 'student-faculty' | 'student-college';
  author_name: string;
  author_roll: string;
  author_headline: string;
  author_role: 'Student' | 'Faculty' | 'Alumni' | 'College T&P';
  timestamp: string;
  type: 'teammate_ask' | 'repo_launch' | 'faculty_lab' | 'college_opening';
  content: string;
  tags: string[];
  teammate_ask?: {
    project_title: string;
    category: 'Hackathon' | 'Project' | 'Startup' | 'Competition';
    needed_skills: string[];
    slots_left: number;
    total_slots: number;
  };
  linked_repo?: {
    name: string;
    language: string;
    language_color: string;
    stars: number;
    forks: number;
    url: string;
  };
  likes: number;
  comments: number;
  liked?: boolean;
}

export interface SkillGroup {
  id: string;
  college_id?: string;
  skill: string;
  branch: string;
  year: string;
  description?: string;
  creator_id: string;
  member_ids?: string[];
  last_message?: string;
  created_at?: string;
}

export interface JoinRequest {
  id: string;
  group_id: string;
  user_id: string;
  name: string;
  roll: string;
  status: 'pending' | 'approve' | 'decline';
  created_at?: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  created_at: string;
}

export interface HackathonTeam {
  id: string;
  college_id?: string;
  category?: 'Hackathon' | 'Major Project' | 'Campus Startup' | 'Competition';
  hackathon_name: string;
  team_name: string;
  leader_name: string;
  leader_roll: string;
  leader_branch: string;
  problem_statement: string;
  current_members: number;
  max_members: number;
  existing_skills: string[];
  missing_skills: string[];
  deadline: string;
  applied?: boolean;
}

export interface FacultyProjectSlot {
  id: string;
  college_id?: string;
  faculty_name: string;
  faculty_id: string;
  department: string;
  designation: string;
  title: string;
  type: 'Research Lab' | 'Major Project' | 'SIH Mentorship' | 'Paper Co-Author';
  description: string;
  required_skills: string[];
  slots_open: number;
  perks: string;
  applied?: boolean;
}

export interface JobOpening {
  id: string;
  college_id?: string;
  opening_type?: 'Placement Drive' | 'Campus Internship' | 'Incubation Grant' | 'College Role';
  company: string;
  role: string;
  salary: string;
  tier?: 'Super Dream' | 'Dream' | 'Core' | 'College Grant';
  min_cgpa?: number;
  eligibility: string;
  skills_required?: string[];
  posted_by?: string;
  posted_by_label?: string;
  applicants_count?: number;
  created_at?: string;
  applied?: boolean;
}

export interface TownhallProposal {
  id: string;
  college_id?: string;
  title: string;
  category: 'Lab & Infra' | 'Placement & T&P' | 'Hackathon Funding' | 'Academic';
  author_roll: string;
  upvotes: number;
  upvoted?: boolean;
  status: 'Approved by Dean' | 'In Progress' | 'Under T&P Review';
  college_response?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'image';
  link?: string | null;
  description?: string;
  file_name?: string | null;
  uploaded_by_name?: string;
  created_at?: string;
}

export interface CampusNotification {
  id: string;
  to_user_id?: string;
  from_user_name: string;
  type: 'mentor_msg' | 'event' | 'update' | 'team_invite';
  message: string;
  created_at: string;
}
