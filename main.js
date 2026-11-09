// main.js — React Native Web Runtime for Galaxy Fusion
// Individual College Collaboration Hub (Student–Student · Student–Faculty · Student–College)
// Mirrors App.tsx and src/screens/* using React 18 + React Native primitives & live Supabase backend.

const { useState, useEffect, createElement: h } = React;

const SUPABASE_URL = 'https://pfsklgdqabozkglltqax.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmc2tsZ2RxYWJvemtnbGx0cWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjU5NzAsImV4cCI6MjA5MDg0MTk3MH0.iEDVq_sjN3rC2w_Ywu4YYOmAFyn5tnT8URrNgkASOao';
const EMAIL_DOMAIN = '@galaxy.local';

const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
function rollToEmail(roll) {
  return String(roll || '').toLowerCase().trim() + EMAIL_DOMAIN;
}

// React Native Primitive Adapters for Web
const View = ({ style, className = '', children, onClick }) =>
  h('div', { className, style: { display: 'flex', flexDirection: 'column', ...style }, onClick }, children);

const Text = ({ style, className = '', children, onClick }) =>
  h('span', { className, style: { display: 'inline-block', ...style }, onClick }, children);

const TouchableOpacity = ({ style, className = '', onPress, disabled, children }) =>
  h(
    'button',
    {
      type: 'button',
      disabled,
      className: `rn-touchable ${className}`,
      onClick: onPress,
      style: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: 'inherit',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      },
    },
    children
  );

const TextInput = ({ style, value, onChangeText, placeholder, secureTextEntry, multiline }) =>
  multiline
    ? h('textarea', {
        value,
        placeholder,
        onChange: (e) => onChangeText && onChangeText(e.target.value),
        style: {
          fontFamily: 'inherit',
          resize: 'none',
          outline: 'none',
          ...style,
        },
      })
    : h('input', {
        type: secureTextEntry ? 'password' : 'text',
        value,
        placeholder,
        onChange: (e) => onChangeText && onChangeText(e.target.value),
        style: {
          fontFamily: 'inherit',
          outline: 'none',
          ...style,
        },
      });

// --- MULTI-TENANT INDIVIDUAL COLLEGE WORKSPACES ---
const CAMPUS_COLLEGES = [
  {
    id: 'college-glau',
    code: 'GLAU',
    name: 'GLA University, Mathura',
    short_name: 'GLA University',
    city: 'Mathura, UP',
    domain: 'gla.ac.in',
    roll_prefix: '23BCS / 24BCS',
    verified_students: 4820,
    verified_faculty: 310,
    active_openings: 19,
    logo_emoji: '🏛️',
  },
  {
    id: 'college-aktu-iet',
    code: 'AKTU-IET',
    name: 'Institute of Engineering & Technology (AKTU)',
    short_name: 'IET Lucknow (AKTU)',
    city: 'Lucknow, UP',
    domain: 'ietlucknow.ac.in',
    roll_prefix: '230052010',
    verified_students: 3650,
    verified_faculty: 240,
    active_openings: 15,
    logo_emoji: '🎓',
  },
  {
    id: 'college-kiet',
    code: 'KIET',
    name: 'KIET Group of Institutions',
    short_name: 'KIET Ghaziabad',
    city: 'Ghaziabad, UP',
    domain: 'kiet.edu',
    roll_prefix: '2324CS',
    verified_students: 4120,
    verified_faculty: 275,
    active_openings: 14,
    logo_emoji: '🚀',
  },
  {
    id: 'college-akgec',
    code: 'AKGEC',
    name: 'Ajay Kumar Garg Engineering College',
    short_name: 'AKGEC Ghaziabad',
    city: 'Ghaziabad, UP',
    domain: 'akgec.ac.in',
    roll_prefix: '2310027',
    verified_students: 3890,
    verified_faculty: 260,
    active_openings: 12,
    logo_emoji: '⚡',
  },
  {
    id: 'college-jss',
    code: 'JSSATE',
    name: 'JSS Academy of Technical Education',
    short_name: 'JSS Noida',
    city: 'Noida, UP',
    domain: 'jssaten.ac.in',
    roll_prefix: '23JSSCS',
    verified_students: 3940,
    verified_faculty: 255,
    active_openings: 16,
    logo_emoji: '🌟',
  },
];

// --- 3 DEMO ROLES (Student · Faculty · College T&P Cell) ---
const DEMO_STUDENT = {
  id: 'demo-student-aarav',
  name: 'Aarav Sharma',
  roll: '23BCS014',
  role: 'student',
  college_id: 'college-glau',
  college_name: 'GLA University, Mathura',
  branch: 'CSE (AI & ML)',
  year: '3rd Year',
  headline: 'Full-Stack & React Native Builder · SIH Finalist · Open Source Contributor',
  bio: 'Building campus-scale products with React Native, TypeScript, and Supabase. Looking for ML & UI/UX teammates for Smart India Hackathon.',
  github_handle: 'aaravsharma-dev',
  linkedin_handle: 'in/aarav-sharma-23bcs014',
  cgpa: '8.92',
  connections_count: 348,
  commits_count: 412,
  streak_days: 19,
  availability_badge: 'Open to Hackathon',
  skills: ['React Native', 'TypeScript', 'Python', 'Supabase', 'Node.js', 'UI/UX', 'DSA', 'Docker'],
  certs: [
    { name: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services' },
    { name: 'Meta React Native Specialization', org: 'Coursera / Meta' },
    { name: 'Smart India Hackathon Internal Winner', org: 'AKTU Innovation Cell' },
  ],
  resume_name: 'Aarav_Sharma_23BCS014_Resume.pdf',
};

const DEMO_FACULTY = {
  id: 'demo-mentor-neha',
  name: 'Dr. Neha Gupta',
  roll: 'FAC-CSE-08',
  role: 'mentor',
  college_id: 'college-glau',
  college_name: 'GLA University, Mathura',
  mentor_type: 'Faculty',
  expertise: 'Machine Learning, IEEE Research & SIH Faculty Advisor',
  branch: 'CSE Department',
  year: 'Faculty',
  headline: 'Associate Professor (CSE) & AI Vision Research Lab Head',
  bio: 'Leading funded AI/ML & Computer Vision research projects with 3rd/4th year students.',
  github_handle: 'dr-nehagupta-lab',
  cgpa: 'Faculty',
  connections_count: 820,
  commits_count: 145,
  streak_days: 7,
  skills: ['Machine Learning', 'Deep Learning', 'IEEE Research', 'Python', 'Faculty Mentorship'],
  certs: [
    { name: 'Ph.D. in Artificial Intelligence', org: 'IIT Roorkee' },
    { name: 'IEEE Senior Member', org: 'IEEE Computer Society' },
  ],
  resume_name: 'Dr_Neha_Gupta_CV.pdf',
};

const DEMO_COLLEGE_ADMIN = {
  id: 'demo-college-tnp',
  name: 'Prof. Vikramaditya Rathore',
  roll: 'TNP-ADMIN-01',
  role: 'mentor',
  college_id: 'college-glau',
  college_name: 'GLA University, Mathura',
  mentor_type: 'College T&P',
  expertise: 'Dean — Training, Placement & Incubation Cell',
  branch: 'Central Placement & Incubation Cell',
  year: 'College Admin',
  headline: 'Dean of Training & Placement · Startup Incubation & Official College Openings',
  bio: 'Posting verified placement drives, paid on-campus internships, and startup incubation grants for students.',
  github_handle: 'campus-tnp-cell',
  cgpa: 'T&P Cell',
  connections_count: 2450,
  commits_count: 64,
  streak_days: 12,
  skills: ['Campus Placements', 'Corporate Relations', 'Startup Incubation', 'Internship Drives'],
  certs: [{ name: 'Official College Placement & Incubation Authority', org: 'University Administration' }],
  resume_name: 'Official_Placement_Brochure_2026.pdf',
};

const CAMPUS_STUDENTS_DIRECTORY = [
  {
    id: 'peer-isha',
    name: 'Isha Kapoor',
    roll: '23BCS042',
    branch: 'CSE',
    year: '3rd Year',
    headline: 'UI/UX Designer & React Native Frontend Developer',
    github_handle: 'ishakapoor-ui',
    cgpa: '9.14',
    commits_count: 289,
    availability_badge: 'Looking for Teammates',
    skills: ['UI/UX Figma', 'React Native', 'TypeScript', 'Tailwind'],
  },
  {
    id: 'peer-kabir',
    name: 'Kabir Khan',
    roll: '23BCS089',
    branch: 'CSE',
    year: '3rd Year',
    headline: 'Backend Systems · Go, PostgreSQL, Docker & Distributed Systems',
    github_handle: 'kabirkhan-sys',
    cgpa: '8.76',
    commits_count: 510,
    availability_badge: 'Open to Hackathon',
    skills: ['Go', 'PostgreSQL', 'Node.js', 'Docker', 'Cryptography'],
  },
  {
    id: 'peer-sneha',
    name: 'Sneha Yadav',
    roll: '23ECE031',
    branch: 'ECE',
    year: '3rd Year',
    headline: 'Embedded Systems, ROS2 Robotics & Edge-AI Hardware Builder',
    github_handle: 'snehayadav-iot',
    cgpa: '8.85',
    commits_count: 198,
    availability_badge: 'Open to Research',
    skills: ['Embedded C', 'ESP32', 'ROS2', 'IoT Sensors', 'PyTorch'],
  },
  {
    id: 'peer-dev',
    name: 'Dev Malhotra',
    roll: '24BCS105',
    branch: 'CSE (AI & ML)',
    year: '2nd Year',
    headline: 'Computer Vision & LLM Fine-Tuning · PyTorch & FastAPI',
    github_handle: 'devmalhotra-ai',
    cgpa: '9.05',
    commits_count: 234,
    availability_badge: 'Looking for Teammates',
    skills: ['Python', 'PyTorch', 'YOLOv9', 'FastAPI', 'LangChain'],
  },
];

const INITIAL_POSTS = [
  {
    id: 'post-1',
    author_name: 'Aarav Sharma',
    author_roll: '23BCS014',
    author_headline: 'CSE (AI & ML) • 3rd Year • SIH Finalist',
    author_role: 'Student',
    collab_type: 'student-student',
    timestamp: '1h ago',
    content:
      'We are building our Smart India Hackathon (SIH) mobile prototype in React Native + Supabase and need 2 teammates from our college before Friday’s internal evaluation! One-tap apply below if your skills match.',
    tags: ['#AskForTeammates', '#StudentToStudent', '#SIH2026', '#ReactNative'],
    teammate_ask: {
      project_title: 'Galaxy Fusion — Verified Campus Collaboration Network',
      event_or_goal: 'Smart India Hackathon (SIH) Internal Round',
      roles_needed: ['Python ML Engineer', 'UI/UX Figma Designer'],
      spots_left: 2,
      branch_pref: 'CSE / AI / IT / ECE (Any Year)',
    },
    linked_repo: {
      name: 'aaravsharma-dev/galaxy-fusion-mobile',
      language: 'TypeScript',
      language_color: '#3178c6',
      stars: 86,
      forks: 23,
      url: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
    },
    likes: 64,
    comments: 18,
    liked: true,
  },
  {
    id: 'post-2',
    author_name: 'Placement & Incubation Cell',
    author_roll: 'TNP-ADMIN-01',
    author_headline: 'Official College Administration • Training, Placement & Incubation',
    author_role: 'College T&P',
    collab_type: 'student-college',
    timestamp: '3h ago',
    content:
      '🏛️ OFFICIAL COLLEGE OPENING: Applications are now open for (1) Atlassian & Juspay Super Dream Placement Drives, (2) Paid Campus ERP Mobile App Internships (₹10,000/mo), and (3) ₹50,000 Student Startup Seed Grants! Apply directly with your verified CGPA & GitHub profile.',
    tags: ['#CollegeOpening', '#StudentToCollege', '#Placements2026', '#SeedGrant'],
    likes: 148,
    comments: 34,
    liked: false,
  },
  {
    id: 'post-3',
    author_name: 'Dr. Neha Gupta',
    author_roll: 'FAC-CSE-08',
    author_headline: 'Associate Professor (CSE) • AI & Vision Research Lab',
    author_role: 'Faculty',
    collab_type: 'student-faculty',
    timestamp: '5h ago',
    content:
      '🔬 FACULTY RESEARCH LAB OPENING: Looking for 2 undergraduate students from our college to co-author an IEEE paper on Multimodal Drone Crop-Disease Detection. Stipend + minor project credit included.',
    tags: ['#StudentToFaculty', '#FacultyResearch', '#IEEEPaper', '#ComputerVision'],
    teammate_ask: {
      project_title: 'DST-Funded Drone Crop Disease Vision Model',
      event_or_goal: 'IEEE Conference Publication + Funded Lab Slot',
      roles_needed: ['PyTorch / YOLOv9 Student', 'React Native Field App Student'],
      spots_left: 2,
      branch_pref: 'CSE / AI / ECE (3rd or 4th Year)',
    },
    likes: 112,
    comments: 29,
    liked: false,
  },
  {
    id: 'post-4',
    author_name: 'Isha Kapoor',
    author_roll: '23BCS042',
    author_headline: 'CSE • 3rd Year • Frontend & Design Lead',
    author_role: 'Student',
    collab_type: 'student-student',
    timestamp: '1d ago',
    content:
      'Asking for 1 ECE/IoT hardware teammate from our college! Our software stack (React Native + FastAPI) is ready for the Smart Lab Attendance project—we need someone who can wire ESP32-CAM triggers.',
    tags: ['#AskForTeammates', '#CrossBranch', '#IoT', '#ECE'],
    teammate_ask: {
      project_title: 'Smart Lab Attendance Vision + ESP32 Gate',
      event_or_goal: 'Minor Project + AKTU Innovation Exhibition',
      roles_needed: ['ESP32 / Embedded C Hardware Teammate'],
      spots_left: 1,
      branch_pref: 'ECE / EEE / Mechatronics',
    },
    linked_repo: {
      name: 'ishakapoor/smart-attendance-vision',
      language: 'Python',
      language_color: '#3572A5',
      stars: 39,
      forks: 9,
      url: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
    },
    likes: 53,
    comments: 15,
    liked: false,
  },
];

const INITIAL_REPOS = [
  {
    id: 'repo-1',
    title: 'Galaxy Fusion Mobile (React Native)',
    repo_name: 'galaxy-fusion-mobile',
    description:
      'College-verified GitHub + LinkedIn mobile network with Student–Student teammate matching, Faculty Research Lab slots, and Official College T&P openings.',
    github_url: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
    language: 'TypeScript',
    language_color: '#3178c6',
    stars: 86,
    forks: 23,
    commits: 142,
    owner_roll: '23BCS014',
  },
  {
    id: 'repo-2',
    title: 'Campus Bus Tracker',
    repo_name: 'campus-bus-tracker-rn',
    description:
      'Live college bus location tracking for students using React Native Maps, GPS telemetry, and ETA push notifications.',
    github_url: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
    language: 'React Native',
    language_color: '#0891b2',
    stars: 48,
    forks: 14,
    commits: 89,
    owner_roll: '23BCS014',
  },
  {
    id: 'repo-3',
    title: 'Smart Lab Attendance',
    repo_name: 'smart-attendance-vision',
    description:
      'Edge-AI face recognition attendance system for college labs with automatic ERP attendance sheet export.',
    github_url: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
    language: 'Python',
    language_color: '#3572A5',
    stars: 62,
    forks: 19,
    commits: 114,
    owner_roll: '23BCS042',
  },
  {
    id: 'repo-4',
    title: 'GridBot Autonomous Rover',
    repo_name: 'gridbot-ros2-firmware',
    description:
      'ROS2 + ESP32 warehouse navigation robot built by the college Robotics Club for e-Yantra.',
    github_url: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
    language: 'C++',
    language_color: '#f34b7d',
    stars: 34,
    forks: 8,
    commits: 76,
    owner_roll: '23ECE019',
  },
];

const INITIAL_GROUPS = [
  {
    id: 'grp-react-devs',
    skill: 'React & React Native Builders',
    branch: 'CSE / IT',
    year: '3rd',
    creator_id: 'demo-student-aarav',
    member_ids: ['demo-student-aarav', 'demo-isha', 'demo-kabir', 'demo-sneha'],
    last_message: 'Aarav Sharma: Perfect. Let’s ask Dr. Gupta to review on Thursday.',
  },
  {
    id: 'grp-aiml-squad',
    skill: 'AI/ML Hackathon Squad',
    branch: 'CSE (AI & ML)',
    year: '3rd',
    creator_id: 'demo-isha',
    member_ids: ['demo-student-aarav', 'demo-isha', 'demo-dev'],
    last_message: 'Dev Malhotra: Dataset is ready, training YOLOv9 tonight.',
  },
  {
    id: 'grp-cyber-sec',
    skill: 'Cyber Security & CTF',
    branch: 'All Branches',
    year: '2nd',
    creator_id: 'demo-riya',
    member_ids: ['demo-student-aarav', 'demo-riya'],
    last_message: 'Riya Jain: CTF this weekend, anyone joining the web exploit room?',
  },
  {
    id: 'grp-dsa-cp',
    skill: 'DSA & Competitive Programming',
    branch: 'CSE / ECE',
    year: '4th',
    creator_id: 'demo-kabir',
    member_ids: ['demo-kabir'],
    last_message: 'Kabir Khan: Discussing Dynamic Programming on Trees at 9 PM.',
  },
];

const INITIAL_HACKATHON_TEAMS = [
  {
    id: 'hack-1',
    hackathon_name: 'Smart India Hackathon (SIH) Internal Round',
    team_name: 'Team Wings of Fire',
    leader_name: 'Aarav Sharma',
    leader_roll: '23BCS014',
    leader_branch: 'CSE (AI)',
    problem_statement: 'Verified Student Skill & Placement Network (Galaxy Fusion)',
    current_members: 4,
    max_members: 6,
    existing_skills: ['React Native', 'TypeScript', 'Supabase', 'Node.js'],
    missing_skills: ['UI/UX Figma', 'Python ML'],
    deadline: 'Fri, Nov 13',
    applied: false,
  },
  {
    id: 'hack-2',
    hackathon_name: 'AKTU AI Innovation Challenge 2026',
    team_name: 'AgriVision AI',
    leader_name: 'Sneha Yadav',
    leader_roll: '23ECE031',
    leader_branch: 'ECE',
    problem_statement: 'Drone-based crop disease detection using multispectral imagery',
    current_members: 3,
    max_members: 5,
    existing_skills: ['Embedded C', 'IoT Sensors', 'PyTorch'],
    missing_skills: ['React Native App', 'Cloud Backend'],
    deadline: 'Mon, Nov 16',
    applied: false,
  },
  {
    id: 'hack-3',
    hackathon_name: 'Unstop FinTech Campus Sprint',
    team_name: 'ZeroTrust Pay',
    leader_name: 'Kabir Khan',
    leader_roll: '23BCS089',
    leader_branch: 'CSE',
    problem_statement: 'Offline-first UPI micro-payments for campus canteens & print shops',
    current_members: 3,
    max_members: 4,
    existing_skills: ['Go', 'PostgreSQL', 'Cryptography'],
    missing_skills: ['React Native UI'],
    deadline: 'Thu, Nov 19',
    applied: false,
  },
];

const INITIAL_FACULTY_PROJECTS = [
  {
    id: 'fac-proj-1',
    title: 'Multimodal Drone Crop-Disease Detection (IEEE Paper + Lab)',
    faculty_name: 'Dr. Neha Gupta',
    faculty_dept: 'Department of CSE (AI & ML)',
    lab_name: 'Campus AI & Computer Vision Lab',
    type: 'IEEE Research',
    stipend_or_credit: '₹8,000/mo Stipend + Minor Project Credit',
    spots_total: 3,
    spots_filled: 1,
    skills_needed: ['PyTorch', 'YOLOv9', 'React Native', 'Python'],
    description:
      'Co-author an IEEE transaction paper and build a field-ready React Native inspection app for UP farmers.',
    applied: false,
  },
  {
    id: 'fac-proj-2',
    title: 'Autonomous Indoor Campus Delivery Rover (ROS2 + LiDAR)',
    faculty_name: 'Prof. Rajeshwar Tiwari',
    faculty_dept: 'Department of ECE & Robotics',
    lab_name: 'Centre for Robotics & Embedded IoT',
    type: 'Funded Grant',
    stipend_or_credit: '₹5,000/mo + Lab Hardware Access',
    spots_total: 4,
    spots_filled: 2,
    skills_needed: ['ROS2', 'C++', 'ESP32', 'SLAM'],
    description:
      'Building a 4-wheel autonomous rover to deliver library books and lab kits across campus blocks.',
    applied: false,
  },
  {
    id: 'fac-proj-3',
    title: 'Teaching Assistant (TA) — Data Structures & Algorithms Lab',
    faculty_name: 'Prof. Amit Singh',
    faculty_dept: 'Department of Computer Science',
    lab_name: 'Programming & Algorithms Wing',
    type: 'TA Role',
    stipend_or_credit: 'Official TA Certificate + ₹4,000/mo',
    spots_total: 4,
    spots_filled: 3,
    skills_needed: ['C++', 'DSA', 'Code Review', 'GitHub'],
    description:
      'Mentor 1st and 2nd year students during evening lab sessions and review weekly GitHub assignments.',
    applied: false,
  },
];

const INITIAL_JOBS = [
  {
    id: 'job-1',
    company: 'Atlassian (via College T&P Cell)',
    role: 'Software Engineering Intern / Grad',
    salary: '24 LPA',
    tier: 'Super Dream',
    opening_type: 'Placement Drive',
    posted_by_badge: 'Official T&P Drive',
    min_cgpa: 7.5,
    deadline: 'Nov 18, 2026',
    eligibility: 'B.Tech CSE/IT/ECE 2026/2027 batch • CGPA ≥ 7.5 • Strong GitHub portfolio',
    skills_required: ['React Native', 'TypeScript', 'Distributed Systems', 'DSA'],
  },
  {
    id: 'job-2',
    company: 'Juspay (via College T&P Cell)',
    role: 'Frontend / React Native Engineer',
    salary: '16 LPA',
    tier: 'Super Dream',
    opening_type: 'Placement Drive',
    posted_by_badge: 'Official T&P Drive',
    min_cgpa: 7.0,
    deadline: 'Nov 21, 2026',
    eligibility: 'B.Tech CSE/IT/ECE • CGPA ≥ 7.0 • Functional programming & UI systems',
    skills_required: ['React Native', 'TypeScript', 'Functional Programming'],
  },
  {
    id: 'job-3',
    company: 'College IT & ERP Automation Cell',
    role: 'Student React Native & Supabase Intern (In-House)',
    salary: '₹10,000 / mo',
    tier: 'Campus Role',
    opening_type: 'Campus Internship',
    posted_by_badge: 'Dean IT Office',
    min_cgpa: 6.5,
    deadline: 'Nov 15, 2026',
    eligibility: '2nd & 3rd Year Students of this college • Build official campus mobile modules',
    skills_required: ['React Native', 'Supabase', 'TypeScript'],
  },
  {
    id: 'job-4',
    company: 'College Startup Incubation Centre (TBI)',
    role: 'Student Founder Seed Grant (Cohort 4)',
    salary: '₹50,000 Grant',
    tier: 'College Grant',
    opening_type: 'Incubation Grant',
    posted_by_badge: 'Incubation Cell',
    min_cgpa: 6.0,
    deadline: 'Nov 30, 2026',
    eligibility: 'Student teams (2–5 members) with a working GitHub MVP solving a real problem',
    skills_required: ['Working MVP', 'GitHub Repo', 'Team of 2+'],
  },
];

const INITIAL_TOWNHALL = [
  {
    id: 'th-1',
    title: 'Extend 24x7 AI & Robotics Lab access during Smart India Hackathon week',
    category: 'Lab Access',
    upvotes: 142,
    upvoted: true,
    status: 'Approved by Dean',
    college_response:
      'Approved by Dean Academics: Central AI Lab (Block III) will remain open 24x7 with faculty supervision from Nov 10–18.',
  },
  {
    id: 'th-2',
    title: 'Provide AWS / GPU Cloud Credits for 3rd-year B.Tech Minor Projects',
    category: 'Academic',
    upvotes: 98,
    upvoted: false,
    status: 'Under Review',
    college_response:
      'T&P and HOD CSE are finalizing $100/team AWS Activate credits for verified GitHub project teams.',
  },
];

const INITIAL_MENTORS = [
  {
    id: 'mentor-1',
    name: 'Dr. Neha Gupta',
    mentor_type: 'Faculty',
    expertise: 'Machine Learning, Research & SIH Faculty Advisor',
  },
  {
    id: 'mentor-2',
    name: 'Rohit Verma',
    mentor_type: 'Alumni',
    expertise: 'SDE-2 @ Product Startup · System Design & React Native',
  },
  {
    id: 'mentor-3',
    name: 'Priya Nair',
    mentor_type: 'Expert',
    expertise: 'Cloud & DevOps Architect · AWS Community Hero',
  },
  {
    id: 'mentor-4',
    name: 'Prof. Amit Singh',
    mentor_type: 'Faculty',
    expertise: 'Training & Placement Officer · Mock Interviews & Resume Review',
  },
];

const INITIAL_MATERIALS = [
  {
    id: 'mat-1',
    title: 'React Native + Expo Architecture Handbook (Campus Edition)',
    type: 'pdf',
    description: 'Complete guide to building cross-platform mobile apps with Expo & Supabase.',
  },
  {
    id: 'mat-2',
    title: 'Smart India Hackathon Winning Pitch Deck & Repo Checklist',
    type: 'link',
    link: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
    description: 'How to structure your GitHub README, architecture diagram, and SIH deck.',
  },
  {
    id: 'mat-3',
    title: 'Super Dream Placement DSA & System Design Sheet',
    type: 'pdf',
    description: 'Curated 150 problems and design patterns asked in campus placement drives.',
  },
];

const CLUB_CATEGORIES = {
  technical: [
    { name: 'Coding & Open Source Club', members: 210, lead: 'Aarav Sharma', tag: 'GitHub & CP' },
    { name: 'AI/ML & Data Science Society', members: 165, lead: 'Isha Kapoor', tag: 'Deep Learning' },
    { name: 'Robotics & IoT Club', members: 98, lead: 'Kabir Khan', tag: 'ROS2 & Embedded' },
    { name: 'Cyber Security (InfoSec) Club', members: 84, lead: 'Riya Jain', tag: 'CTF & Ethical Hacking' },
  ],
  sports: [
    { name: 'Campus Cricket Club', members: 140, lead: 'Vikram Aditya', tag: 'Inter-College' },
    { name: 'Football FC', members: 112, lead: 'Rohan Mehra', tag: 'Turf League' },
    { name: 'Basketball Squad', members: 76, lead: 'Ananya Roy', tag: 'Zonal Champions' },
    { name: 'Badminton Club', members: 95, lead: 'Karan Patel', tag: 'Indoor Arena' },
  ],
  cultural: [
    { name: 'Nritya Dance Crew', members: 120, lead: 'Sneha Yadav', tag: 'Choreography' },
    { name: 'Octaves Music Society', members: 88, lead: 'Arjun Nair', tag: 'Band & Acoustic' },
    { name: 'Abhinaya Drama Club', members: 64, lead: 'Meera Joshi', tag: 'Theatre & Street Play' },
    { name: 'Fine Arts & Design Guild', members: 92, lead: 'Tanvi Verma', tag: 'UI/UX & Digital Art' },
  ],
};

const HEATMAP_WEEKS = [
  [1, 3, 2, 4, 2, 0, 1],
  [2, 4, 3, 1, 2, 1, 0],
  [0, 2, 4, 4, 3, 2, 1],
  [3, 1, 2, 3, 4, 1, 0],
  [2, 3, 4, 2, 1, 3, 2],
  [1, 2, 1, 3, 4, 2, 0],
  [3, 4, 4, 2, 3, 1, 1],
  [2, 1, 3, 4, 4, 3, 2],
  [0, 3, 2, 1, 3, 4, 1],
  [4, 3, 4, 3, 2, 2, 1],
  [2, 4, 3, 4, 4, 3, 2],
  [3, 2, 4, 3, 4, 4, 3],
];

function GalaxyFusionRNApp() {
  const [selectedCollege, setSelectedCollege] = useState(CAMPUS_COLLEGES[0]);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('welcome');
  const [activeTab, setActiveTab] = useState('feed');

  // Auth form fields
  const [nameInput, setNameInput] = useState('');
  const [rollInput, setRollInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [mentorTypeInput, setMentorTypeInput] = useState('Faculty');
  const [expInput, setExpInput] = useState('');

  // App state
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [pillarFilter, setPillarFilter] = useState('all'); // all | student-student | student-faculty | student-college
  const [repos, setRepos] = useState(INITIAL_REPOS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [joinRequests, setJoinRequests] = useState([
    {
      id: 'req-demo-1',
      group_id: 'grp-react-devs',
      user_id: 'demo-rohan',
      name: 'Rohan Mehra',
      roll: '24BCS055',
      status: 'pending',
    },
  ]);
  const [messagesByGroup, setMessagesByGroup] = useState({
    'grp-react-devs': [
      {
        id: 'm1',
        sender_id: 'demo-isha',
        sender_name: 'Isha Kapoor',
        text: 'Team, SIH internal round is on Friday. Who is taking the React Native frontend?',
        created_at: '10:10 PM',
      },
      {
        id: 'm2',
        sender_id: 'demo-student-aarav',
        sender_name: 'Aarav Sharma',
        text: 'I will build the React Native LinkedIn + GitHub dashboard. Kabir can wire the Supabase API.',
        created_at: '10:18 PM',
      },
      {
        id: 'm3',
        sender_id: 'demo-kabir',
        sender_name: 'Kabir Khan',
        text: 'Done. Pushing the repo link to GitHub Projects tonight.',
        created_at: '10:25 PM',
      },
    ],
  });
  const [hackathonTeams, setHackathonTeams] = useState(INITIAL_HACKATHON_TEAMS);
  const [peers] = useState(CAMPUS_STUDENTS_DIRECTORY);
  const [invitedPeerIds, setInvitedPeerIds] = useState([]);
  const [facultyProjects, setFacultyProjects] = useState(INITIAL_FACULTY_PROJECTS);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [townhall, setTownhall] = useState(INITIAL_TOWNHALL);
  const [mentors] = useState(INITIAL_MENTORS);
  const [materials] = useState(INITIAL_MATERIALS);
  const [suggestions, setSuggestions] = useState([
    'Extend 24x7 Innovation & AI Lab access during Smart India Hackathon week.',
    'Add GitHub Actions CI/CD workshop for 2nd-year students in Technical Club.',
  ]);
  const [notifications] = useState([
    {
      id: 'n1',
      from_user_name: 'Dr. Neha Gupta (Faculty Lab)',
      message: 'Reviewed your Galaxy Fusion React Native repo! Ready for Friday’s SIH review.',
      created_at: '15m ago',
    },
    {
      id: 'n2',
      from_user_name: 'Isha Kapoor (Student–Student)',
      message: 'Requested to join your SIH team "Wings of Fire" as UI/UX Designer.',
      created_at: '1h ago',
    },
    {
      id: 'n3',
      from_user_name: 'College Placement & Incubation Cell',
      message: 'Atlassian (24 LPA), Campus ERP Internship, and ₹50K Seed Grant are now open.',
      created_at: '3h ago',
    },
  ]);

  // Sub-screen states
  const [showComposer, setShowComposer] = useState(false);
  const [composerMode, setComposerMode] = useState('teammate'); // teammate | update
  const [postText, setPostText] = useState('');
  const [repoAttach, setRepoAttach] = useState('');
  const [askProjectTitle, setAskProjectTitle] = useState('');
  const [askGoal, setAskGoal] = useState('');
  const [askRoles, setAskRoles] = useState('');

  const [selectedLang, setSelectedLang] = useState('All');
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [repoTitle, setRepoTitle] = useState('');
  const [repoDesc, setRepoDesc] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [repoLang] = useState('TypeScript');

  const [teamsSubTab, setTeamsSubTab] = useState('hackathons'); // hackathons | peers | groups
  const [showCreateAsk, setShowCreateAsk] = useState(false);
  const [newAskEvent, setNewAskEvent] = useState('');
  const [newAskTeam, setNewAskTeam] = useState('');
  const [newAskProblem, setNewAskProblem] = useState('');
  const [newAskHave, setNewAskHave] = useState('');
  const [newAskNeed, setNewAskNeed] = useState('');
  const [peerSearch, setPeerSearch] = useState('');

  const [groupMode, setGroupMode] = useState('my'); // my | join | create | requests | chat
  const [activeGroupId, setActiveGroupId] = useState('grp-react-devs');
  const [newGroupSkill, setNewGroupSkill] = useState('');
  const [newGroupBranch, setNewGroupBranch] = useState('');
  const [newGroupYear] = useState('3rd');
  const [chatInput, setChatInput] = useState('');

  const [careerSubTab, setCareerSubTab] = useState('placements'); // placements | research | townhall | mentors
  const [tierFilter, setTierFilter] = useState('All');
  const [showCgpaForm, setShowCgpaForm] = useState(false);
  const [cgpas, setCgpas] = useState(['8.8', '8.9', '9.0', '8.9', '9.1', '9.0', '', '']);
  const [showPostJob, setShowPostJob] = useState(false);
  const [jobCompany, setJobCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobElig, setJobElig] = useState('');
  const [showPostLab, setShowPostLab] = useState(false);
  const [labTitle, setLabTitle] = useState('');
  const [labStipend, setLabStipend] = useState('');
  const [labSkills, setLabSkills] = useState('');
  const [labDesc, setLabDesc] = useState('');
  const [townhallInput, setTownhallInput] = useState('');
  const [activeMentor, setActiveMentor] = useState(null);
  const [mentorMsgText, setMentorMsgText] = useState('');

  const [profileSection, setProfileSection] = useState('portfolio');
  const [skillInput, setSkillInput] = useState('');
  const [certNameInput, setCertNameInput] = useState('');
  const [certOrgInput, setCertOrgInput] = useState('');
  const [clubCategory, setClubCategory] = useState('technical');
  const [sugInput, setSugInput] = useState('');
  const [fbRating, setFbRating] = useState(5);
  const [fbInput, setFbInput] = useState('');

  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    if (!user || !sb) return;
    (async () => {
      try {
        const { data: dbProjects } = await sb
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbProjects && dbProjects.length > 0) {
          const mapped = dbProjects.map((p) => ({
            id: p.id,
            title: p.title,
            repo_name: p.title.toLowerCase().replace(/\s+/g, '-'),
            description: p.description || '',
            github_url: p.github_url || 'https://github.com',
            language: 'TypeScript',
            language_color: '#3178c6',
            stars: 19,
            forks: 4,
            commits: 34,
            owner_roll: user.roll,
          }));
          setRepos([...mapped, ...INITIAL_REPOS]);
        }
        const { data: dbJobs } = await sb
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });
        if (dbJobs && dbJobs.length > 0) {
          setJobs([...dbJobs, ...INITIAL_JOBS]);
        }
      } catch {}
    })();
  }, [user]);

  const navigateTo = (tab, sub) => {
    setActiveTab(tab);
    if (tab === 'teams' && sub) setTeamsSubTab(sub);
    if (tab === 'career' && sub) setCareerSubTab(sub);
    if (tab === 'profile' && sub) setProfileSection(sub);
    setShowDrawer(false);
  };

  const switchDemoRole = (roleKey) => {
    if (roleKey === 'student') {
      setUser({
        ...DEMO_STUDENT,
        college_id: selectedCollege.id,
        college_name: selectedCollege.name,
      });
      showToast(`Viewing as Student (${DEMO_STUDENT.name})`, 'success');
    } else if (roleKey === 'faculty') {
      setUser({
        ...DEMO_FACULTY,
        college_id: selectedCollege.id,
        college_name: selectedCollege.name,
      });
      showToast(`Viewing as Faculty (${DEMO_FACULTY.name})`, 'info');
    } else {
      setUser({
        ...DEMO_COLLEGE_ADMIN,
        college_id: selectedCollege.id,
        college_name: selectedCollege.name,
      });
      showToast('Viewing as Official College T&P Cell (Can Post Openings)', 'info');
    }
  };

  const handleSupabaseAuth = async () => {
    if (!rollInput.trim() || passInput.length < 6) {
      showToast('Enter Roll Number / ID and 6+ char Password!', 'error');
      return;
    }
    const isSignup = authMode.includes('signup');
    const isMentor = authMode.includes('mentor');
    if (sb) {
      try {
        if (isSignup) {
          const { error } = await sb.auth.signUp({
            email: rollToEmail(rollInput),
            password: passInput,
            options: {
              data: {
                name: nameInput || 'Campus User',
                roll: rollInput.toUpperCase(),
                role: isMentor ? 'mentor' : 'student',
                mentor_type: isMentor ? mentorTypeInput : null,
                expertise: isMentor ? expInput : null,
              },
            },
          });
          if (error) return showToast(error.message, 'error');
        }
        const { data, error } = await sb.auth.signInWithPassword({
          email: rollToEmail(rollInput),
          password: passInput,
        });
        if (!error && data?.user) {
          const { data: prof } = await sb
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (prof) {
            setUser({
              ...(isMentor ? DEMO_FACULTY : DEMO_STUDENT),
              ...prof,
              college_id: selectedCollege.id,
              college_name: selectedCollege.name,
              skills: Array.isArray(prof.skills) && prof.skills.length ? prof.skills : DEMO_STUDENT.skills,
              certs: Array.isArray(prof.certs) && prof.certs.length ? prof.certs : DEMO_STUDENT.certs,
            });
            showToast(`Signed in to ${selectedCollege.short_name}!`, 'success');
            return;
          }
        }
      } catch {}
    }
    const fallbackProfile = isMentor
      ? {
          ...DEMO_FACULTY,
          name: nameInput || DEMO_FACULTY.name,
          roll: rollInput.toUpperCase(),
          mentor_type: mentorTypeInput,
          expertise: expInput || DEMO_FACULTY.expertise,
          college_id: selectedCollege.id,
          college_name: selectedCollege.name,
        }
      : {
          ...DEMO_STUDENT,
          name: nameInput || DEMO_STUDENT.name,
          roll: rollInput.toUpperCase(),
          college_id: selectedCollege.id,
          college_name: selectedCollege.name,
        };
    setUser(fallbackProfile);
    showToast(`Welcome to ${selectedCollege.short_name}, ${fallbackProfile.name}!`, 'success');
  };

  // ==================== AUTH SCREEN ====================
  if (!user) {
    return h(
      View,
      { className: 'rn-device-shell' },
      toast &&
        h(
          View,
          {
            style: {
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              zIndex: 99,
              backgroundColor: '#0f172a',
              color: '#fff',
              padding: '11px 14px',
              borderRadius: 12,
              borderLeft: `4px solid ${
                toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#22c55e' : '#3b82f6'
              }`,
            },
          },
          h(Text, { style: { fontSize: 12, fontWeight: 700, color: '#fff' } }, toast.msg)
        ),
      authMode === 'welcome'
        ? h(
            View,
            {
              className: 'rn-scroll',
              style: {
                flex: 1,
                background: 'linear-gradient(155deg, #0b4f4a 0%, #0f766e 50%, #0d1117 100%)',
                padding: 22,
                alignItems: 'center',
                textAlign: 'center',
              },
            },
            h(
              View,
              {
                style: {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  padding: '5px 12px',
                  borderRadius: 999,
                  marginBottom: 12,
                },
              },
              h(
                Text,
                { style: { color: '#99f6e4', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em' } },
                'STUDENT–STUDENT · STUDENT–FACULTY · STUDENT–COLLEGE'
              )
            ),
            h(
              Text,
              { style: { fontSize: 30, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' } },
              'Galaxy Fusion'
            ),
            h(
              Text,
              { style: { fontSize: 12, color: '#ccfbf1', marginTop: 4, lineHeight: 1.4, maxWidth: 320 } },
              'Dedicated LinkedIn + GitHub Collaboration Hub for individual colleges. Students ask for teammates, faculty post research labs, and colleges post official openings.'
            ),

            // INDIVIDUAL COLLEGE WORKSPACE SELECTOR
            h(
              View,
              {
                style: {
                  width: '100%',
                  backgroundColor: 'rgba(13,17,23,0.55)',
                  border: '1px solid rgba(94,234,212,0.35)',
                  borderRadius: 16,
                  padding: 12,
                  marginTop: 14,
                  marginBottom: 14,
                  textAlign: 'left',
                  gap: 8,
                },
              },
              h(
                Text,
                { style: { color: '#99f6e4', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em' } },
                '1. SELECT YOUR INDIVIDUAL COLLEGE WORKSPACE'
              ),
              h(
                View,
                { className: 'rn-hscroll', style: { flexDirection: 'row', gap: 6 } },
                CAMPUS_COLLEGES.map((col) => {
                  const active = selectedCollege.id === col.id;
                  return h(
                    TouchableOpacity,
                    {
                      key: col.id,
                      onPress: () => setSelectedCollege(col),
                      style: {
                        padding: '6px 10px',
                        borderRadius: 10,
                        backgroundColor: active ? '#14b8a6' : 'rgba(255,255,255,0.08)',
                        border: `1px solid ${active ? '#5eead4' : 'rgba(255,255,255,0.16)'}`,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      },
                    },
                    h(Text, { style: { fontSize: 12 } }, col.logo_emoji),
                    h(
                      Text,
                      {
                        style: {
                          color: active ? '#042f2e' : '#e2e8f0',
                          fontSize: 11,
                          fontWeight: 800,
                          whiteSpace: 'nowrap',
                        },
                      },
                      col.code
                    )
                  );
                })
              ),
              h(
                View,
                null,
                h(
                  Text,
                  { style: { color: '#ffffff', fontSize: 13, fontWeight: 800 } },
                  `${selectedCollege.logo_emoji} ${selectedCollege.name}`
                ),
                h(
                  Text,
                  { style: { color: '#99f6e4', fontSize: 10, marginTop: 2 } },
                  `${selectedCollege.city} • @${selectedCollege.domain} • ${selectedCollege.verified_students} Students • ${selectedCollege.active_openings} Openings`
                )
              )
            ),

            h(
              View,
              { style: { width: '100%', gap: 9 } },
              h(
                TouchableOpacity,
                {
                  style: {
                    backgroundColor: '#ffffff',
                    padding: '13px',
                    borderRadius: 14,
                    alignItems: 'center',
                  },
                  onPress: () => setAuthMode('student-login'),
                },
                h(
                  Text,
                  { style: { color: '#0f766e', fontWeight: 800, fontSize: 13 } },
                  `Student Sign In (${selectedCollege.code} Roll No.)`
                )
              ),
              h(
                TouchableOpacity,
                {
                  style: {
                    backgroundColor: 'rgba(15,118,110,0.45)',
                    border: '1px solid rgba(94,234,212,0.4)',
                    padding: '12px',
                    borderRadius: 14,
                    alignItems: 'center',
                  },
                  onPress: () => setAuthMode('student-signup'),
                },
                h(Text, { style: { color: '#ffffff', fontWeight: 700, fontSize: 13 } }, 'Create Verified Student Account')
              ),
              h(
                TouchableOpacity,
                {
                  style: { padding: '4px', alignItems: 'center' },
                  onPress: () => setAuthMode('mentor-login'),
                },
                h(
                  Text,
                  { style: { color: '#99f6e4', fontSize: 11, fontWeight: 700 } },
                  'Faculty / College T&P Cell / Alumni Portal →'
                )
              ),
              h(
                View,
                { style: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: '4px 0' } },
                h(View, { style: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.18)' } }),
                h(
                  Text,
                  { style: { color: '#99f6e4', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em' } },
                  `INSTANT ${selectedCollege.code} ROLE PREVIEW`
                ),
                h(View, { style: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.18)' } })
              ),
              h(
                View,
                { style: { flexDirection: 'row', gap: 6 } },
                h(
                  TouchableOpacity,
                  {
                    style: {
                      flex: 1,
                      backgroundColor: 'rgba(13,17,23,0.68)',
                      border: '1px solid rgba(94,234,212,0.45)',
                      padding: '10px 6px',
                      borderRadius: 12,
                      alignItems: 'center',
                    },
                    onPress: () => switchDemoRole('student'),
                  },
                  h(Text, { style: { color: '#ffffff', fontWeight: 800, fontSize: 11 } }, '⚡ Student'),
                  h(Text, { style: { color: '#99f6e4', fontSize: 9, marginTop: 2 } }, 'Ask Teammates')
                ),
                h(
                  TouchableOpacity,
                  {
                    style: {
                      flex: 1,
                      backgroundColor: 'rgba(13,17,23,0.68)',
                      border: '1px solid rgba(165,180,252,0.45)',
                      padding: '10px 6px',
                      borderRadius: 12,
                      alignItems: 'center',
                    },
                    onPress: () => switchDemoRole('faculty'),
                  },
                  h(Text, { style: { color: '#ffffff', fontWeight: 800, fontSize: 11 } }, '🎓 Faculty'),
                  h(Text, { style: { color: '#c7d2fe', fontSize: 9, marginTop: 2 } }, 'Research Labs')
                ),
                h(
                  TouchableOpacity,
                  {
                    style: {
                      flex: 1,
                      backgroundColor: 'rgba(13,17,23,0.68)',
                      border: '1px solid rgba(253,224,71,0.45)',
                      padding: '10px 6px',
                      borderRadius: 12,
                      alignItems: 'center',
                    },
                    onPress: () => switchDemoRole('college'),
                  },
                  h(Text, { style: { color: '#ffffff', fontWeight: 800, fontSize: 11 } }, '🏛️ College T&P'),
                  h(Text, { style: { color: '#fde047', fontSize: 9, marginTop: 2 } }, 'Post Openings')
                )
              )
            )
          )
        : h(
            View,
            { style: { flex: 1, backgroundColor: '#ffffff', padding: 24, gap: 12 } },
            h(
              TouchableOpacity,
              { onPress: () => setAuthMode('welcome') },
              h(Text, { style: { color: '#0f766e', fontWeight: 700, fontSize: 13 } }, '← Back to College Selector')
            ),
            h(
              View,
              {
                style: {
                  alignSelf: 'flex-start',
                  backgroundColor: authMode.includes('mentor') ? '#e0e7ff' : '#ccfbf1',
                  padding: '4px 10px',
                  borderRadius: 999,
                },
              },
              h(
                Text,
                {
                  style: {
                    fontSize: 10,
                    fontWeight: 800,
                    color: authMode.includes('mentor') ? '#4338ca' : '#0f766e',
                  },
                },
                `${selectedCollege.logo_emoji} ${selectedCollege.short_name.toUpperCase()}`
              )
            ),
            h(
              Text,
              { style: { fontSize: 24, fontWeight: 800, color: '#0f172a' } },
              authMode === 'student-login'
                ? 'Student Sign In'
                : authMode === 'student-signup'
                ? 'Create Student Profile'
                : authMode === 'mentor-login'
                ? 'Faculty / College T&P Sign In'
                : 'Register Faculty / College Admin'
            ),
            authMode.includes('signup') &&
              h(TextInput, {
                placeholder: 'Full Name (e.g. Aarav Sharma)',
                value: nameInput,
                onChangeText: setNameInput,
                style: {
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                },
              }),
            h(TextInput, {
              placeholder: authMode.includes('mentor')
                ? 'Faculty / T&P ID (e.g. FAC-CSE-08)'
                : `College Roll Number (e.g. ${selectedCollege.roll_prefix}014)`,
              value: rollInput,
              onChangeText: setRollInput,
              style: {
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 14,
              },
            }),
            authMode === 'mentor-signup' &&
              h(
                View,
                { style: { flexDirection: 'row', gap: 6 } },
                ['Faculty', 'College T&P', 'Alumni'].map((t) =>
                  h(
                    TouchableOpacity,
                    {
                      key: t,
                      onPress: () => setMentorTypeInput(t),
                      style: {
                        flex: 1,
                        padding: '9px',
                        borderRadius: 10,
                        backgroundColor: mentorTypeInput === t ? '#e0e7ff' : '#f1f5f9',
                        alignItems: 'center',
                      },
                    },
                    h(
                      Text,
                      {
                        style: {
                          fontSize: 11,
                          fontWeight: 700,
                          color: mentorTypeInput === t ? '#4338ca' : '#64748b',
                        },
                      },
                      t
                    )
                  )
                )
              ),
            h(TextInput, {
              placeholder: 'Password (min. 6 characters)',
              value: passInput,
              onChangeText: setPassInput,
              secureTextEntry: true,
              style: {
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 14,
              },
            }),
            h(
              TouchableOpacity,
              {
                onPress: handleSupabaseAuth,
                style: {
                  backgroundColor: authMode.includes('mentor') ? '#4f46e5' : '#0f766e',
                  padding: '14px',
                  borderRadius: 14,
                  alignItems: 'center',
                  marginTop: 4,
                },
              },
              h(
                Text,
                { style: { color: '#ffffff', fontWeight: 800, fontSize: 14 } },
                authMode.includes('signup') ? 'Create Verified Account' : `Enter ${selectedCollege.short_name}`
              )
            )
          )
    );
  }

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const activeMessages = messagesByGroup[activeGroup?.id] || [];
  const filteredPosts =
    pillarFilter === 'all' ? posts : posts.filter((p) => p.collab_type === pillarFilter);
  const filteredRepos =
    selectedLang === 'All'
      ? repos
      : repos.filter((r) => (r.language || '').toLowerCase() === selectedLang.toLowerCase());
  const filteredJobs =
    tierFilter === 'All' ? jobs : jobs.filter((j) => (j.tier || 'Dream') === tierFilter);
  const filteredPeers = peers.filter((p) => {
    const q = peerSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.branch.toLowerCase().includes(q) ||
      p.skills.some((s) => s.toLowerCase().includes(q))
    );
  });
  const heatColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  const currentCgpaNum = parseFloat(user.cgpa || '8.92') || 8.92;

  // ==================== MAIN AUTHENTICATED SHELL ====================
  return h(
    View,
    { className: 'rn-device-shell' },

    // Toast
    toast &&
      h(
        View,
        {
          style: {
            position: 'absolute',
            top: 84,
            left: 16,
            right: 16,
            zIndex: 100,
            backgroundColor: '#0f172a',
            padding: '10px 14px',
            borderRadius: 12,
            borderLeft: `4px solid ${
              toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#22c55e' : '#3b82f6'
            }`,
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          },
        },
        h(Text, { style: { color: '#fff', fontSize: 12, fontWeight: 700 } }, toast.msg)
      ),

    // Top Header Bar with Individual College Switcher + 1-Tap Role Switcher
    h(
      View,
      {
        style: {
          backgroundColor: '#0f766e',
          padding: '10px 14px 8px',
          gap: 8,
        },
      },
      h(
        View,
        {
          style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        },
        h(
          View,
          { style: { flexDirection: 'row', alignItems: 'center', gap: 10 } },
          h(
            TouchableOpacity,
            {
              onPress: () => setShowDrawer(true),
              style: {
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.14)',
                justifyContent: 'center',
                alignItems: 'center',
              },
            },
            h(Text, { style: { color: '#fff', fontSize: 16, fontWeight: 800 } }, '☰')
          ),
          h(
            View,
            null,
            h(
              View,
              { style: { flexDirection: 'row', alignItems: 'center', gap: 6 } },
              h(Text, { style: { color: '#ffffff', fontSize: 16, fontWeight: 800 } }, 'Galaxy Fusion'),
              h(
                TouchableOpacity,
                {
                  onPress: () => setShowCollegeModal(true),
                  style: {
                    backgroundColor: 'rgba(13,17,23,0.45)',
                    border: '1px solid rgba(94,234,212,0.4)',
                    padding: '2px 7px',
                    borderRadius: 999,
                  },
                },
                h(
                  Text,
                  { style: { color: '#5eead4', fontSize: 9, fontWeight: 800 } },
                  `${selectedCollege.logo_emoji} ${selectedCollege.code} ▾`
                )
              )
            ),
            h(
              Text,
              { style: { color: '#ccfbf1', fontSize: 10 } },
              `${selectedCollege.short_name} • ${user.name.split(' ')[0]} (${user.roll})`
            )
          )
        ),
        h(
          TouchableOpacity,
          {
            onPress: () => setShowNotifModal(true),
            style: {
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: 'rgba(255,255,255,0.16)',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            },
          },
          h(Text, { style: { fontSize: 15 } }, '🔔'),
          h(View, {
            style: {
              position: 'absolute',
              top: 5,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#ef4444',
            },
          })
        )
      ),
      // 1-Tap Role Switcher Bar
      h(
        View,
        {
          style: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: 'rgba(13,17,23,0.28)',
            padding: '4px 8px',
            borderRadius: 10,
          },
        },
        h(Text, { style: { color: '#99f6e4', fontSize: 9, fontWeight: 800 } }, 'VIEW AS:'),
        [
          { id: 'student', label: '⚡ Student', active: user.role === 'student' },
          {
            id: 'faculty',
            label: '🎓 Faculty',
            active: user.role === 'mentor' && user.mentor_type === 'Faculty',
          },
          {
            id: 'college',
            label: '🏛️ College T&P',
            active: user.role === 'mentor' && user.mentor_type === 'College T&P',
          },
        ].map((r) =>
          h(
            TouchableOpacity,
            {
              key: r.id,
              onPress: () => switchDemoRole(r.id),
              style: {
                padding: '3px 8px',
                borderRadius: 7,
                backgroundColor: r.active ? '#ffffff' : 'transparent',
              },
            },
            h(
              Text,
              {
                style: {
                  fontSize: 10,
                  fontWeight: 800,
                  color: r.active ? '#0f766e' : '#ccfbf1',
                },
              },
              r.label
            )
          )
        )
      )
    ),

    // Main Scrollable Body
    h(
      View,
      { className: 'rn-scroll', style: { flex: 1, padding: 14, paddingBottom: 78, gap: 12 } },

      // ==================== TAB 1: CAMPUS COLLABORATION HUB ====================
      activeTab === 'feed' &&
        h(
          View,
          { style: { gap: 12 } },
          // Individual College Hub Card + 3 Collaboration Pillars
          h(
            View,
            {
              style: {
                backgroundColor: '#0d1117',
                borderRadius: 16,
                padding: 14,
                border: '1px solid #1e293b',
                gap: 10,
              },
            },
            h(
              View,
              { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
              h(
                View,
                { style: { flexDirection: 'row', alignItems: 'center', gap: 8 } },
                h(Text, { style: { fontSize: 22 } }, selectedCollege.logo_emoji),
                h(
                  View,
                  null,
                  h(
                    Text,
                    { style: { color: '#5eead4', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em' } },
                    'INDIVIDUAL COLLEGE WORKSPACE'
                  ),
                  h(Text, { style: { color: '#fff', fontSize: 14, fontWeight: 800 } }, selectedCollege.name),
                  h(
                    Text,
                    { style: { color: '#94a3b8', fontSize: 10 } },
                    `${selectedCollege.city} • Verified @${selectedCollege.domain}`
                  )
                )
              )
            ),
            h(
              View,
              { style: { flexDirection: 'row', gap: 6 } },
              [
                {
                  emoji: '🤝',
                  title: 'Student–Student',
                  sub: 'Ask for Teammates',
                  color: '#5eead4',
                  bg: 'rgba(20,184,166,0.16)',
                  onPress: () => navigateTo('teams', 'hackathons'),
                },
                {
                  emoji: '🔬',
                  title: 'Student–Faculty',
                  sub: 'Research & Labs',
                  color: '#c7d2fe',
                  bg: 'rgba(99,102,241,0.18)',
                  onPress: () => navigateTo('career', 'research'),
                },
                {
                  emoji: '🏛️',
                  title: 'Student–College',
                  sub: `${selectedCollege.active_openings} Openings`,
                  color: '#fde047',
                  bg: 'rgba(234,179,8,0.16)',
                  onPress: () => navigateTo('career', 'placements'),
                },
              ].map((p) =>
                h(
                  TouchableOpacity,
                  {
                    key: p.title,
                    onPress: p.onPress,
                    style: {
                      flex: 1,
                      backgroundColor: p.bg,
                      padding: 9,
                      borderRadius: 11,
                      gap: 2,
                    },
                  },
                  h(Text, { style: { fontSize: 14 } }, p.emoji),
                  h(Text, { style: { color: p.color, fontSize: 10, fontWeight: 800 } }, p.title),
                  h(Text, { style: { color: '#cbd5e1', fontSize: 9 } }, p.sub)
                )
              )
            )
          ),

          // Quick Action Composer ("Ask for Teammates" or "Share GitHub Update")
          h(
            View,
            {
              style: {
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: 12,
                border: '1px solid #e2e8f0',
                gap: 8,
              },
            },
            h(
              View,
              { style: { flexDirection: 'row', gap: 8 } },
              h(
                TouchableOpacity,
                {
                  onPress: () => {
                    setComposerMode('teammate');
                    setShowComposer(!showComposer);
                  },
                  style: {
                    flex: 1,
                    backgroundColor: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    padding: '9px 10px',
                    borderRadius: 10,
                    alignItems: 'center',
                  },
                },
                h(
                  Text,
                  { style: { fontSize: 11, fontWeight: 800, color: '#0f766e' } },
                  '🤝 Ask for Teammates'
                )
              ),
              h(
                TouchableOpacity,
                {
                  onPress: () => {
                    setComposerMode('update');
                    setShowComposer(!showComposer);
                  },
                  style: {
                    flex: 1,
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    padding: '9px 10px',
                    borderRadius: 10,
                    alignItems: 'center',
                  },
                },
                h(Text, { style: { fontSize: 11, fontWeight: 800, color: '#1d4ed8' } }, '🐙 Share GitHub Build')
              )
            ),
            showComposer &&
              h(
                View,
                { style: { gap: 8, marginTop: 4 } },
                composerMode === 'teammate' &&
                  h(
                    View,
                    { style: { gap: 6 } },
                    h(TextInput, {
                      placeholder: 'Project / Team Name (e.g. Smart Bus Tracker)',
                      value: askProjectTitle,
                      onChangeText: setAskProjectTitle,
                      style: {
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: 9,
                        padding: 9,
                        fontSize: 12,
                      },
                    }),
                    h(TextInput, {
                      placeholder: 'Hackathon / Goal (e.g. SIH 2026 / Minor Project)',
                      value: askGoal,
                      onChangeText: setAskGoal,
                      style: {
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: 9,
                        padding: 9,
                        fontSize: 12,
                      },
                    }),
                    h(TextInput, {
                      placeholder: 'Skills Needed (comma-separated, e.g. UI/UX, Python ML)',
                      value: askRoles,
                      onChangeText: setAskRoles,
                      style: {
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: 9,
                        padding: 9,
                        fontSize: 12,
                      },
                    })
                  ),
                h(TextInput, {
                  multiline: true,
                  placeholder:
                    composerMode === 'teammate'
                      ? 'Describe what you are building and who should join...'
                      : 'Share a GitHub commit, research milestone, or college announcement...',
                  value: postText,
                  onChangeText: setPostText,
                  style: {
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: 10,
                    minHeight: 60,
                    fontSize: 12,
                  },
                }),
                h(TextInput, {
                  placeholder: 'Optional GitHub repo (e.g. aarav/campus-bus-tracker)',
                  value: repoAttach,
                  onChangeText: setRepoAttach,
                  style: {
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 9,
                    padding: 9,
                    fontSize: 12,
                  },
                }),
                h(
                  TouchableOpacity,
                  {
                    onPress: () => {
                      if (!postText.trim()) return;
                      const rolesList = askRoles
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setPosts([
                        {
                          id: 'post-' + Date.now(),
                          author_name: user.name,
                          author_roll: user.roll,
                          author_headline: `${user.branch || 'CSE'} • ${selectedCollege.short_name}`,
                          author_role:
                            user.role === 'mentor' ? user.mentor_type || 'Faculty' : 'Student',
                          collab_type:
                            user.role === 'mentor' && user.mentor_type === 'College T&P'
                              ? 'student-college'
                              : user.role === 'mentor'
                              ? 'student-faculty'
                              : 'student-student',
                          timestamp: 'Just now',
                          content: postText.trim(),
                          tags:
                            composerMode === 'teammate'
                              ? ['#AskForTeammates', '#StudentToStudent', `#${selectedCollege.code}`]
                              : ['#CampusBuild', `#${selectedCollege.code}`],
                          teammate_ask:
                            composerMode === 'teammate'
                              ? {
                                  project_title: askProjectTitle.trim() || 'Campus Innovation Project',
                                  event_or_goal: askGoal.trim() || 'Hackathon & Project Build',
                                  roles_needed: rolesList.length ? rolesList : ['React Native', 'Backend'],
                                  spots_left: 2,
                                  branch_pref: 'All Branches (' + selectedCollege.short_name + ')',
                                }
                              : null,
                          linked_repo: repoAttach.trim()
                            ? {
                                name: repoAttach.trim(),
                                language: 'TypeScript',
                                language_color: '#3178c6',
                                stars: 1,
                                forks: 0,
                                url: 'https://github.com/vyomvarshney2005cseai/galaxy-fusion.github.io',
                              }
                            : null,
                          likes: 1,
                          comments: 0,
                          liked: true,
                        },
                        ...posts,
                      ]);
                      setPostText('');
                      setRepoAttach('');
                      setAskProjectTitle('');
                      setAskGoal('');
                      setAskRoles('');
                      setShowComposer(false);
                      showToast(
                        composerMode === 'teammate'
                          ? 'Teammate Request Broadcasted to College!'
                          : 'Published to College Feed!',
                        'success'
                      );
                    },
                    style: {
                      backgroundColor: '#0f766e',
                      padding: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                    },
                  },
                  h(
                    Text,
                    { style: { color: '#fff', fontWeight: 800, fontSize: 12 } },
                    composerMode === 'teammate'
                      ? '🚀 Broadcast Teammate Request'
                      : 'Post to College Hub'
                  )
                )
              )
          ),

          // All 8 Campus Modules Grid
          h(
            View,
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 7,
              },
            },
            [
              { emoji: '🤝', title: 'Ask Team', sub: 'Find Peers', bg: '#059669', tab: 'teams', subView: 'hackathons' },
              { emoji: '🏛️', title: 'Openings', sub: 'College T&P', bg: '#0284c7', tab: 'career', subView: 'placements' },
              { emoji: '🔬', title: 'Faculty Lab', sub: 'IEEE & R&D', bg: '#4f46e5', tab: 'career', subView: 'research' },
              { emoji: '🐙', title: 'GitHub', sub: 'Code Proof', bg: '#0d1117', tab: 'repos' },
              { emoji: '👥', title: 'Skill Chat', sub: 'Live Groups', bg: '#ea580c', tab: 'teams', subView: 'groups' },
              { emoji: '📣', title: 'Townhall', sub: 'Dean Replies', bg: '#7c3aed', tab: 'career', subView: 'townhall' },
              { emoji: '📚', title: 'Materials', sub: 'Study Notes', bg: '#db2777', tab: 'profile', subView: 'materials' },
              { emoji: '🚀', title: 'Clubs', sub: 'Tech & Sports', bg: '#0f766e', tab: 'profile', subView: 'clubs' },
            ].map((m) =>
              h(
                TouchableOpacity,
                {
                  key: m.title,
                  onPress: () => navigateTo(m.tab, m.subView),
                  style: {
                    backgroundColor: m.bg,
                    borderRadius: 13,
                    padding: 9,
                    minHeight: 72,
                    justifyContent: 'space-between',
                  },
                },
                h(Text, { style: { fontSize: 16 } }, m.emoji),
                h(
                  View,
                  null,
                  h(Text, { style: { color: '#fff', fontSize: 10, fontWeight: 800 } }, m.title),
                  h(Text, { style: { color: 'rgba(255,255,255,0.82)', fontSize: 8.5 } }, m.sub)
                )
              )
            )
          ),

          // 3-Pillar Feed Filter Bar
          h(
            View,
            { className: 'rn-hscroll', style: { flexDirection: 'row', gap: 6 } },
            [
              { id: 'all', label: '🌐 All Hub Activity' },
              { id: 'student-student', label: '🤝 Student–Student (Teammates)' },
              { id: 'student-faculty', label: '🔬 Student–Faculty (Research)' },
              { id: 'student-college', label: '🏛️ Student–College (Openings)' },
            ].map((f) =>
              h(
                TouchableOpacity,
                {
                  key: f.id,
                  onPress: () => setPillarFilter(f.id),
                  style: {
                    padding: '6px 11px',
                    borderRadius: 999,
                    backgroundColor: pillarFilter === f.id ? '#0f766e' : '#ffffff',
                    border: '1px solid #e2e8f0',
                  },
                },
                h(
                  Text,
                  {
                    style: {
                      fontSize: 10,
                      fontWeight: 800,
                      color: pillarFilter === f.id ? '#ffffff' : '#475569',
                      whiteSpace: 'nowrap',
                    },
                  },
                  f.label
                )
              )
            )
          ),

          // Feed Stream
          ...filteredPosts.map((post) =>
            h(
              View,
              {
                key: post.id,
                style: {
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  padding: 14,
                  border: '1px solid #e2e8f0',
                  gap: 10,
                },
              },
              h(
                View,
                { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
                h(
                  View,
                  {
                    style: {
                      backgroundColor:
                        post.collab_type === 'student-college'
                          ? '#fef9c3'
                          : post.collab_type === 'student-faculty'
                          ? '#eef2ff'
                          : '#f0fdfa',
                      padding: '2px 8px',
                      borderRadius: 999,
                    },
                  },
                  h(
                    Text,
                    {
                      style: {
                        fontSize: 9,
                        fontWeight: 800,
                        color:
                          post.collab_type === 'student-college'
                            ? '#854d0e'
                            : post.collab_type === 'student-faculty'
                            ? '#4338ca'
                            : '#0f766e',
                      },
                    },
                    post.collab_type === 'student-college'
                      ? '🏛️ STUDENT–COLLEGE OFFICIAL OPENING'
                      : post.collab_type === 'student-faculty'
                      ? '🔬 STUDENT–FACULTY RESEARCH LAB'
                      : '🤝 STUDENT–STUDENT TEAMMATE ASK'
                  )
                ),
                h(Text, { style: { fontSize: 10, color: '#94a3b8' } }, post.timestamp)
              ),
              h(
                View,
                { style: { flexDirection: 'row', gap: 10, alignItems: 'center' } },
                h(
                  View,
                  {
                    style: {
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: '#dbeafe',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  },
                  h(
                    Text,
                    { style: { color: '#1d4ed8', fontWeight: 800, fontSize: 13 } },
                    post.author_name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)
                  )
                ),
                h(
                  View,
                  { style: { flex: 1 } },
                  h(
                    View,
                    { style: { flexDirection: 'row', alignItems: 'center', gap: 6 } },
                    h(Text, { style: { fontSize: 13, fontWeight: 800, color: '#0f172a' } }, post.author_name),
                    h(
                      View,
                      { style: { backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: 6 } },
                      h(Text, { style: { fontSize: 9, fontWeight: 800, color: '#475569' } }, post.author_role)
                    )
                  ),
                  h(Text, { style: { fontSize: 11, color: '#64748b' } }, post.author_headline)
                )
              ),
              h(Text, { style: { fontSize: 12.5, color: '#1e293b', lineHeight: 1.45 } }, post.content),

              // Structured "Looking for Teammates" Card inside Feed
              post.teammate_ask &&
                h(
                  View,
                  {
                    style: {
                      backgroundColor: '#f0fdfa',
                      borderRadius: 12,
                      padding: 12,
                      border: '1px solid #99f6e4',
                      gap: 6,
                    },
                  },
                  h(
                    View,
                    { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
                    h(
                      Text,
                      { style: { fontSize: 10, fontWeight: 800, color: '#0f766e' } },
                      `🎯 ${post.teammate_ask.event_or_goal}`
                    ),
                    h(
                      View,
                      { style: { backgroundColor: '#0f766e', padding: '2px 7px', borderRadius: 999 } },
                      h(
                        Text,
                        { style: { color: '#fff', fontSize: 9, fontWeight: 800 } },
                        `${post.teammate_ask.spots_left} Spots Open`
                      )
                    )
                  ),
                  h(
                    Text,
                    { style: { fontSize: 13, fontWeight: 800, color: '#0f172a' } },
                    post.teammate_ask.project_title
                  ),
                  h(
                    View,
                    { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 } },
                    post.teammate_ask.roles_needed.map((role) =>
                      h(
                        View,
                        {
                          key: role,
                          style: {
                            backgroundColor: '#ffffff',
                            border: '1px solid #5eead4',
                            padding: '2px 8px',
                            borderRadius: 6,
                          },
                        },
                        h(Text, { style: { fontSize: 10, fontWeight: 800, color: '#0f766e' } }, `Needs: ${role}`)
                      )
                    )
                  ),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () =>
                        showToast(
                          `Sent your Verified GitHub + Skill Profile to ${post.author_name}!`,
                          'success'
                        ),
                      style: {
                        backgroundColor: '#0f766e',
                        padding: '8px',
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 2,
                      },
                    },
                    h(
                      Text,
                      { style: { color: '#fff', fontSize: 11, fontWeight: 800 } },
                      '✋ One-Tap Request to Join with My GitHub Profile →'
                    )
                  )
                ),

              post.linked_repo &&
                h(
                  TouchableOpacity,
                  {
                    onPress: () => window.open(post.linked_repo.url, '_blank'),
                    style: {
                      backgroundColor: '#0d1117',
                      borderRadius: 12,
                      padding: 11,
                      border: '1px solid #30363d',
                      gap: 5,
                    },
                  },
                  h(
                    View,
                    { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
                    h(
                      Text,
                      { className: 'mono', style: { color: '#58a6ff', fontSize: 11.5, fontWeight: 700 } },
                      `📦 ${post.linked_repo.name}`
                    ),
                    h(Text, { style: { color: '#39d353', fontSize: 10, fontWeight: 800 } }, 'View Code ↗')
                  ),
                  h(
                    View,
                    { style: { flexDirection: 'row', alignItems: 'center', gap: 12 } },
                    h(Text, { style: { color: '#8b949e', fontSize: 10.5 } }, post.linked_repo.language),
                    h(Text, { style: { color: '#8b949e', fontSize: 10.5 } }, `★ ${post.linked_repo.stars}`),
                    h(Text, { style: { color: '#8b949e', fontSize: 10.5 } }, `⑂ ${post.linked_repo.forks}`)
                  )
                ),
              h(
                View,
                {
                  style: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTop: '1px solid #f1f5f9',
                  },
                },
                h(
                  TouchableOpacity,
                  {
                    onPress: () =>
                      setPosts(
                        posts.map((p) =>
                          p.id === post.id
                            ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
                            : p
                        )
                      ),
                  },
                  h(
                    Text,
                    {
                      style: {
                        fontSize: 11.5,
                        fontWeight: post.liked ? 800 : 600,
                        color: post.liked ? '#0a66c2' : '#475569',
                      },
                    },
                    `${post.liked ? '▲ Endorsed' : '△ Endorse'} (${post.likes})`
                  )
                ),
                h(
                  TouchableOpacity,
                  { onPress: () => navigateTo('teams', 'groups') },
                  h(Text, { style: { fontSize: 11.5, color: '#475569', fontWeight: 600 } }, `💬 Discuss (${post.comments})`)
                ),
                h(
                  TouchableOpacity,
                  {
                    onPress: () =>
                      post.collab_type === 'student-college'
                        ? navigateTo('career', 'placements')
                        : post.collab_type === 'student-faculty'
                        ? navigateTo('career', 'research')
                        : navigateTo('teams', 'hackathons'),
                  },
                  h(
                    Text,
                    { style: { fontSize: 11.5, color: '#0f766e', fontWeight: 800 } },
                    post.collab_type === 'student-college' ? '🏛️ View Opening →' : '🤝 Collaborate →'
                  )
                )
              )
            )
          )
        ),

      // ==================== TAB 2: GITHUB REPOSITORIES ====================
      activeTab === 'repos' &&
        h(
          View,
          { style: { gap: 12 } },
          h(
            View,
            {
              style: {
                backgroundColor: '#0d1117',
                borderRadius: 16,
                padding: 15,
                border: '1px solid #30363d',
                gap: 10,
              },
            },
            h(
              Text,
              { style: { color: '#39d353', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em' } },
              `GITHUB CAMPUS REPOSITORIES • ${selectedCollege.code}`
            ),
            h(Text, { style: { color: '#ffffff', fontSize: 17, fontWeight: 800 } }, 'Student Proof of Work'),
            h(
              TouchableOpacity,
              {
                onPress: () => setShowAddRepo(!showAddRepo),
                style: {
                  backgroundColor: '#238636',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                },
              },
              h(
                Text,
                { style: { color: '#ffffff', fontWeight: 800, fontSize: 12 } },
                showAddRepo ? '✕ Close Form' : '+ Submit Project / Sync GitHub Repo'
              )
            )
          ),
          showAddRepo &&
            h(
              View,
              {
                style: {
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  padding: 14,
                  border: '1px solid #e2e8f0',
                  gap: 10,
                },
              },
              h(Text, { style: { fontSize: 14, fontWeight: 800 } }, 'Add Project to GitHub Portfolio'),
              h(TextInput, {
                placeholder: 'Project Title (e.g. Smart Attendance System)',
                value: repoTitle,
                onChangeText: setRepoTitle,
                style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: 10 },
              }),
              h(TextInput, {
                multiline: true,
                placeholder: 'Short technical description...',
                value: repoDesc,
                onChangeText: setRepoDesc,
                style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: 10 },
              }),
              h(TextInput, {
                placeholder: 'GitHub Repository URL (https://github.com/...)',
                value: repoUrl,
                onChangeText: setRepoUrl,
                style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, padding: 10 },
              }),
              h(
                TouchableOpacity,
                {
                  onPress: () => {
                    if (!repoTitle.trim() || !repoUrl.trim()) return;
                    setRepos([
                      {
                        id: 'repo-' + Date.now(),
                        title: repoTitle.trim(),
                        repo_name: repoTitle.trim().toLowerCase().replace(/\s+/g, '-'),
                        description: repoDesc.trim(),
                        github_url: repoUrl.trim(),
                        language: repoLang,
                        language_color: '#3178c6',
                        stars: 1,
                        forks: 0,
                        commits: 15,
                        owner_roll: user.roll,
                      },
                      ...repos,
                    ]);
                    setRepoTitle('');
                    setRepoDesc('');
                    setRepoUrl('');
                    setShowAddRepo(false);
                    showToast('Project Added to GitHub Portfolio!', 'success');
                  },
                  style: { backgroundColor: '#4f46e5', padding: 11, borderRadius: 10, alignItems: 'center' },
                },
                h(Text, { style: { color: '#fff', fontWeight: 800, fontSize: 13 } }, 'Add to Portfolio')
              )
            ),
          ...filteredRepos.map((repo) =>
            h(
              View,
              {
                key: repo.id,
                style: {
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  padding: 14,
                  border: '1px solid #e2e8f0',
                  borderLeft: '4px solid #2563eb',
                  gap: 9,
                },
              },
              h(
                View,
                { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' } },
                h(
                  View,
                  { style: { flex: 1 } },
                  h(
                    Text,
                    { className: 'mono', style: { fontSize: 11, color: '#2563eb', fontWeight: 700 } },
                    `${repo.owner_roll || user.roll} / ${repo.repo_name}`
                  ),
                  h(Text, { style: { fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 2 } }, repo.title)
                ),
                h(
                  TouchableOpacity,
                  {
                    onPress: () => {
                      setRepos(repos.map((r) => (r.id === repo.id ? { ...r, stars: (r.stars || 0) + 1 } : r)));
                      showToast('Starred repository ★', 'info');
                    },
                    style: {
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      padding: '4px 9px',
                      borderRadius: 8,
                    },
                  },
                  h(Text, { style: { fontSize: 11, fontWeight: 800, color: '#334155' } }, `★ Star (${repo.stars})`)
                )
              ),
              h(Text, { style: { fontSize: 12, color: '#475569', lineHeight: 1.45 } }, repo.description),
              h(
                View,
                {
                  style: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 8,
                    borderTop: '1px solid #f1f5f9',
                  },
                },
                h(
                  Text,
                  { style: { fontSize: 11, color: '#475569', fontWeight: 600 } },
                  `${repo.language} • ⑂ ${repo.forks} • ⊙ ${repo.commits} commits`
                ),
                h(
                  TouchableOpacity,
                  {
                    onPress: () => window.open(repo.github_url, '_blank'),
                    style: { backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: 8 },
                  },
                  h(Text, { style: { fontSize: 11, fontWeight: 800, color: '#2563eb' } }, 'View Code →')
                )
              )
            )
          )
        ),

      // ==================== TAB 3: STUDENT–STUDENT TEAMMATES HUB ====================
      activeTab === 'teams' &&
        h(
          View,
          { style: { gap: 12 } },
          h(
            View,
            {
              style: {
                flexDirection: 'row',
                backgroundColor: '#e2e8f0',
                padding: 4,
                borderRadius: 12,
              },
            },
            [
              { id: 'hackathons', label: '🤝 Ask Teammates' },
              { id: 'peers', label: '🔍 Find Peers' },
              { id: 'groups', label: '💬 Skill Groups' },
            ].map((t) =>
              h(
                TouchableOpacity,
                {
                  key: t.id,
                  onPress: () => setTeamsSubTab(t.id),
                  style: {
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 9,
                    backgroundColor: teamsSubTab === t.id ? '#ffffff' : 'transparent',
                    alignItems: 'center',
                  },
                },
                h(
                  Text,
                  {
                    style: {
                      fontSize: 11,
                      fontWeight: 800,
                      color: teamsSubTab === t.id ? '#0f766e' : '#64748b',
                    },
                  },
                  t.label
                )
              )
            )
          ),

          teamsSubTab === 'hackathons' &&
            h(
              View,
              { style: { gap: 12 } },
              h(
                View,
                {
                  style: {
                    backgroundColor: '#312e81',
                    borderRadius: 16,
                    padding: 14,
                    gap: 8,
                  },
                },
                h(
                  Text,
                  { style: { color: '#a5b4fc', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em' } },
                  `STUDENT–STUDENT COLLABORATION • ${selectedCollege.short_name.toUpperCase()}`
                ),
                h(
                  Text,
                  { style: { color: '#ffffff', fontSize: 16, fontWeight: 800 } },
                  'Ask for Teammates & Join Squads'
                ),
                h(
                  Text,
                  { style: { color: '#e0e7ff', fontSize: 11.5 } },
                  'Post what skills your team already has and what roles you are missing so verified college peers can join.'
                ),
                h(
                  TouchableOpacity,
                  {
                    onPress: () => setShowCreateAsk(!showCreateAsk),
                    style: {
                      backgroundColor: '#ffffff',
                      padding: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                    },
                  },
                  h(
                    Text,
                    { style: { color: '#312e81', fontWeight: 800, fontSize: 12 } },
                    showCreateAsk ? '✕ Close Form' : '+ Post "Looking for Teammates" Request'
                  )
                )
              ),
              showCreateAsk &&
                h(
                  View,
                  {
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #c7d2fe',
                      gap: 8,
                    },
                  },
                  h(Text, { style: { fontSize: 14, fontWeight: 800 } }, 'Create Teammate Request'),
                  h(TextInput, {
                    placeholder: 'Hackathon / Goal (e.g. Smart India Hackathon 2026)',
                    value: newAskEvent,
                    onChangeText: setNewAskEvent,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'Team / Project Name',
                    value: newAskTeam,
                    onChangeText: setNewAskTeam,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'What are you building?',
                    value: newAskProblem,
                    onChangeText: setNewAskProblem,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'Skills We Have (comma-separated, e.g. React Native, Node.js)',
                    value: newAskHave,
                    onChangeText: setNewAskHave,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'Missing Skills Needed (comma-separated, e.g. Python ML, Figma)',
                    value: newAskNeed,
                    onChangeText: setNewAskNeed,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => {
                        if (!newAskTeam.trim() || !newAskNeed.trim()) return;
                        setHackathonTeams([
                          {
                            id: 'hack-' + Date.now(),
                            hackathon_name: newAskEvent.trim() || 'Campus Project Build',
                            team_name: newAskTeam.trim(),
                            leader_name: user.name,
                            leader_roll: user.roll,
                            leader_branch: user.branch || 'CSE',
                            problem_statement: newAskProblem.trim() || 'Building an innovative campus product.',
                            current_members: 2,
                            max_members: 5,
                            existing_skills: newAskHave
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                            missing_skills: newAskNeed
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                            deadline: 'Open This Week',
                            applied: false,
                          },
                          ...hackathonTeams,
                        ]);
                        setNewAskEvent('');
                        setNewAskTeam('');
                        setNewAskProblem('');
                        setNewAskHave('');
                        setNewAskNeed('');
                        setShowCreateAsk(false);
                        showToast('Teammate Request Published!', 'success');
                      },
                      style: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 10, alignItems: 'center' },
                    },
                    h(Text, { style: { color: '#fff', fontWeight: 800, fontSize: 12 } }, 'Publish Teammate Request')
                  )
                ),
              ...hackathonTeams.map((team) =>
                h(
                  View,
                  {
                    key: team.id,
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #e2e8f0',
                      gap: 8,
                    },
                  },
                  h(
                    View,
                    { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                    h(
                      View,
                      null,
                      h(Text, { style: { fontSize: 10, fontWeight: 800, color: '#4f46e5' } }, team.hackathon_name),
                      h(Text, { style: { fontSize: 15, fontWeight: 800, color: '#0f172a' } }, team.team_name),
                      h(
                        Text,
                        { style: { fontSize: 11, color: '#64748b' } },
                        `Lead: ${team.leader_name} (${team.leader_roll} • ${team.leader_branch})`
                      )
                    ),
                    h(
                      View,
                      {
                        style: {
                          backgroundColor: '#e0e7ff',
                          padding: '3px 8px',
                          borderRadius: 8,
                          alignSelf: 'flex-start',
                        },
                      },
                      h(
                        Text,
                        { style: { fontSize: 10, fontWeight: 800, color: '#3730a3' } },
                        `${team.current_members}/${team.max_members} Members`
                      )
                    )
                  ),
                  h(Text, { style: { fontSize: 12, color: '#334155' } }, team.problem_statement),
                  h(
                    View,
                    { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 } },
                    team.existing_skills.map((s) =>
                      h(
                        View,
                        { key: s, style: { backgroundColor: '#dcfce7', padding: '2px 7px', borderRadius: 6 } },
                        h(Text, { style: { fontSize: 10, fontWeight: 700, color: '#166534' } }, `✓ ${s}`)
                      )
                    ),
                    team.missing_skills.map((s) =>
                      h(
                        View,
                        { key: s, style: { backgroundColor: '#fee2e2', padding: '2px 7px', borderRadius: 6 } },
                        h(Text, { style: { fontSize: 10, fontWeight: 800, color: '#991b1b' } }, `Needs: ${s}`)
                      )
                    )
                  ),
                  h(
                    View,
                    {
                      style: {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 6,
                        borderTop: '1px solid #f1f5f9',
                      },
                    },
                    h(Text, { style: { fontSize: 11, color: '#64748b' } }, `⏰ ${team.deadline}`),
                    h(
                      TouchableOpacity,
                      {
                        onPress: () => {
                          setHackathonTeams(
                            hackathonTeams.map((t) => (t.id === team.id ? { ...t, applied: true } : t))
                          );
                          showToast('Sent GitHub + Skill Profile to Squad Leader!', 'success');
                        },
                        style: {
                          backgroundColor: team.applied ? '#16a34a' : '#4f46e5',
                          padding: '7px 12px',
                          borderRadius: 8,
                        },
                      },
                      h(
                        Text,
                        { style: { color: '#fff', fontSize: 11, fontWeight: 800 } },
                        team.applied ? '✓ Request Sent' : 'Pitch to Join Squad →'
                      )
                    )
                  )
                )
              )
            ),

          teamsSubTab === 'peers' &&
            h(
              View,
              { style: { gap: 10 } },
              h(TextInput, {
                placeholder: 'Search college students by skill (e.g. PyTorch, Figma, ROS2, ECE)...',
                value: peerSearch,
                onChangeText: setPeerSearch,
                style: {
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontSize: 12,
                },
              }),
              ...filteredPeers.map((peer) => {
                const invited = invitedPeerIds.includes(peer.id);
                return h(
                  View,
                  {
                    key: peer.id,
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #e2e8f0',
                      gap: 8,
                    },
                  },
                  h(
                    View,
                    { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
                    h(
                      View,
                      null,
                      h(Text, { style: { fontSize: 14, fontWeight: 800, color: '#0f172a' } }, peer.name),
                      h(
                        Text,
                        { style: { fontSize: 11, color: '#64748b' } },
                        `${peer.roll} • ${peer.branch} • ${peer.year}`
                      )
                    ),
                    h(
                      View,
                      { style: { backgroundColor: '#dcfce7', padding: '3px 8px', borderRadius: 999 } },
                      h(Text, { style: { fontSize: 9, fontWeight: 800, color: '#166534' } }, peer.availability_badge)
                    )
                  ),
                  h(Text, { style: { fontSize: 12, color: '#334155' } }, peer.headline),
                  h(
                    View,
                    { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 } },
                    peer.skills.map((s) =>
                      h(
                        View,
                        { key: s, style: { backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: 6 } },
                        h(Text, { style: { fontSize: 10, fontWeight: 700, color: '#1d4ed8' } }, s)
                      )
                    )
                  ),
                  h(
                    View,
                    {
                      style: {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 6,
                        borderTop: '1px solid #f1f5f9',
                      },
                    },
                    h(
                      Text,
                      { className: 'mono', style: { fontSize: 10.5, color: '#475569' } },
                      `🐙 @${peer.github_handle} • ${peer.commits_count} commits • CGPA ${peer.cgpa}`
                    ),
                    h(
                      TouchableOpacity,
                      {
                        onPress: () => {
                          if (!invited) {
                            setInvitedPeerIds([...invitedPeerIds, peer.id]);
                            showToast(`Invited ${peer.name} to collaborate!`, 'success');
                          }
                        },
                        style: {
                          backgroundColor: invited ? '#dcfce7' : '#0f766e',
                          padding: '6px 11px',
                          borderRadius: 8,
                        },
                      },
                      h(
                        Text,
                        {
                          style: {
                            fontSize: 10.5,
                            fontWeight: 800,
                            color: invited ? '#166534' : '#ffffff',
                          },
                        },
                        invited ? '✓ Invited' : '🤝 Invite to Team'
                      )
                    )
                  )
                );
              })
            ),

          teamsSubTab === 'groups' &&
            (groupMode === 'chat'
              ? h(
                  View,
                  {
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                    },
                  },
                  h(
                    View,
                    {
                      style: {
                        backgroundColor: '#0f766e',
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      },
                    },
                    h(
                      TouchableOpacity,
                      {
                        onPress: () => setGroupMode('my'),
                        style: {
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      },
                      h(Text, { style: { color: '#fff', fontWeight: 800 } }, '←')
                    ),
                    h(
                      View,
                      null,
                      h(Text, { style: { color: '#fff', fontSize: 14, fontWeight: 800 } }, activeGroup.skill),
                      h(
                        Text,
                        { style: { color: '#ccfbf1', fontSize: 10 } },
                        `${activeGroup.branch} • ${activeGroup.year} Year • Supabase Realtime Chat`
                      )
                    )
                  ),
                  h(
                    View,
                    { style: { padding: 12, backgroundColor: '#f0f4f3', minHeight: 240, gap: 8 } },
                    ...activeMessages.map((m) => {
                      const isSent = m.sender_id === user.id;
                      return h(
                        View,
                        {
                          key: m.id,
                          style: {
                            alignSelf: isSent ? 'flex-end' : 'flex-start',
                            maxWidth: '82%',
                            backgroundColor: isSent ? '#0f766e' : '#ffffff',
                            padding: '9px 12px',
                            borderRadius: 14,
                          },
                        },
                        h(
                          Text,
                          {
                            style: {
                              fontSize: 9,
                              fontWeight: 800,
                              color: isSent ? '#99f6e4' : '#0f766e',
                            },
                          },
                          isSent ? 'YOU' : m.sender_name
                        ),
                        h(
                          Text,
                          { style: { fontSize: 12, color: isSent ? '#ffffff' : '#1e293b', marginTop: 2 } },
                          m.text
                        )
                      );
                    })
                  ),
                  h(
                    View,
                    {
                      style: {
                        flexDirection: 'row',
                        padding: 10,
                        gap: 8,
                        borderTop: '1px solid #e2e8f0',
                      },
                    },
                    h(TextInput, {
                      placeholder: 'Type a message to your group...',
                      value: chatInput,
                      onChangeText: setChatInput,
                      style: {
                        flex: 1,
                        backgroundColor: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: 999,
                        padding: '8px 14px',
                        fontSize: 12,
                      },
                    }),
                    h(
                      TouchableOpacity,
                      {
                        onPress: () => {
                          if (!chatInput.trim()) return;
                          const msg = {
                            id: 'm-' + Date.now(),
                            sender_id: user.id,
                            sender_name: user.name,
                            text: chatInput.trim(),
                            created_at: 'Just now',
                          };
                          setMessagesByGroup({
                            ...messagesByGroup,
                            [activeGroup.id]: [...activeMessages, msg],
                          });
                          setChatInput('');
                        },
                        style: {
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: '#0f766e',
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      },
                      h(Text, { style: { color: '#fff', fontSize: 13 } }, '➤')
                    )
                  )
                )
              : h(
                  View,
                  { style: { gap: 10 } },
                  ...groups.map((g, idx) =>
                    h(
                      TouchableOpacity,
                      {
                        key: g.id,
                        onPress: () => {
                          setActiveGroupId(g.id);
                          setGroupMode('chat');
                        },
                        style: {
                          backgroundColor: '#ffffff',
                          borderRadius: 14,
                          padding: 13,
                          border: '1px solid #e2e8f0',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                        },
                      },
                      h(
                        View,
                        {
                          style: {
                            width: 42,
                            height: 42,
                            borderRadius: 21,
                            backgroundColor: ['#f97316', '#3b82f6', '#8b5cf6', '#14b8a6'][idx % 4],
                            justifyContent: 'center',
                            alignItems: 'center',
                          },
                        },
                        h(Text, { style: { color: '#fff', fontWeight: 800, fontSize: 16 } }, g.skill[0])
                      ),
                      h(
                        View,
                        { style: { flex: 1 } },
                        h(Text, { style: { fontSize: 14, fontWeight: 800, color: '#0f172a' } }, g.skill),
                        h(Text, { style: { fontSize: 11, color: '#64748b' } }, `${g.branch} • ${g.year} Year`),
                        h(
                          Text,
                          { style: { fontSize: 11, color: '#94a3b8', marginTop: 2 } },
                          g.last_message || 'Tap to open live group chat →'
                        )
                      ),
                      h(
                        View,
                        { style: { backgroundColor: '#dcfce7', padding: '4px 9px', borderRadius: 999 } },
                        h(Text, { style: { fontSize: 10, fontWeight: 800, color: '#166534' } }, 'CHAT →')
                      )
                    )
                  )
                ))
        ),

      // ==================== TAB 4: COLLEGE OPENINGS, FACULTY LABS & TOWNHALL ====================
      activeTab === 'career' &&
        h(
          View,
          { style: { gap: 12 } },
          h(
            View,
            { className: 'rn-hscroll', style: { flexDirection: 'row', gap: 6 } },
            [
              { id: 'placements', label: '🏛️ College Openings' },
              { id: 'research', label: '🔬 Faculty Research Labs' },
              { id: 'townhall', label: '📣 College Townhall' },
              { id: 'mentors', label: '🎓 Mentors' },
            ].map((t) =>
              h(
                TouchableOpacity,
                {
                  key: t.id,
                  onPress: () => setCareerSubTab(t.id),
                  style: {
                    padding: '7px 12px',
                    borderRadius: 999,
                    backgroundColor: careerSubTab === t.id ? '#0f766e' : '#ffffff',
                    border: '1px solid #e2e8f0',
                  },
                },
                h(
                  Text,
                  {
                    style: {
                      fontSize: 11,
                      fontWeight: 800,
                      color: careerSubTab === t.id ? '#ffffff' : '#475569',
                      whiteSpace: 'nowrap',
                    },
                  },
                  t.label
                )
              )
            )
          ),

          careerSubTab === 'placements' &&
            h(
              View,
              { style: { gap: 10 } },
              h(
                View,
                {
                  style: {
                    backgroundColor: '#083344',
                    borderRadius: 16,
                    padding: 14,
                    gap: 8,
                  },
                },
                h(
                  Text,
                  { style: { color: '#67e8f9', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em' } },
                  `STUDENT–COLLEGE OFFICIAL HUB • ${selectedCollege.short_name.toUpperCase()}`
                ),
                h(
                  Text,
                  { style: { color: '#ffffff', fontSize: 16, fontWeight: 800 } },
                  'College Placement Drives, Campus Internships & Startup Grants'
                ),
                h(
                  View,
                  { style: { flexDirection: 'row', gap: 8 } },
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => setShowCgpaForm(!showCgpaForm),
                      style: {
                        flex: 1,
                        backgroundColor: 'rgba(255,255,255,0.14)',
                        padding: 9,
                        borderRadius: 10,
                        alignItems: 'center',
                      },
                    },
                    h(
                      Text,
                      { style: { color: '#fff', fontSize: 11, fontWeight: 800 } },
                      `📊 Verified CGPA: ${user.cgpa || '8.92'}`
                    )
                  ),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => setShowPostJob(!showPostJob),
                      style: {
                        flex: 1,
                        backgroundColor: '#facc15',
                        padding: 9,
                        borderRadius: 10,
                        alignItems: 'center',
                      },
                    },
                    h(
                      Text,
                      { style: { color: '#422006', fontSize: 11, fontWeight: 800 } },
                      showPostJob ? '✕ Close Form' : '+ Post College Opening'
                    )
                  )
                )
              ),
              showCgpaForm &&
                h(
                  View,
                  {
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #e2e8f0',
                      gap: 10,
                    },
                  },
                  h(Text, { style: { fontSize: 14, fontWeight: 800 } }, 'Semester 1–8 CGPA Registration'),
                  h(
                    View,
                    { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 } },
                    cgpas.map((val, idx) =>
                      h(TextInput, {
                        key: idx,
                        placeholder: `Sem ${idx + 1}`,
                        value: val,
                        onChangeText: (txt) => {
                          const next = [...cgpas];
                          next[idx] = txt;
                          setCgpas(next);
                        },
                        style: {
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          padding: 8,
                          textAlign: 'center',
                          fontSize: 12,
                          fontWeight: 700,
                        },
                      })
                    )
                  ),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => {
                        const nums = cgpas.map((c) => parseFloat(c)).filter((n) => !isNaN(n));
                        const avg = nums.length
                          ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)
                          : '8.92';
                        setUser({ ...user, cgpa: avg });
                        setShowCgpaForm(false);
                        showToast(`Verified CGPA updated to ${avg}!`, 'success');
                      },
                      style: { backgroundColor: '#0891b2', padding: 11, borderRadius: 10, alignItems: 'center' },
                    },
                    h(Text, { style: { color: '#fff', fontWeight: 800, fontSize: 12 } }, 'Save CGPA Profile')
                  )
                ),
              showPostJob &&
                h(
                  View,
                  {
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #fde047',
                      gap: 8,
                    },
                  },
                  h(
                    Text,
                    { style: { fontSize: 14, fontWeight: 800 } },
                    `🏛️ Post Official Opening for ${selectedCollege.short_name}`
                  ),
                  h(TextInput, {
                    placeholder: 'Company / Department / Grant Name',
                    value: jobCompany,
                    onChangeText: setJobCompany,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'Role / Grant Title (e.g. SDE Intern / Seed Grant)',
                    value: jobRole,
                    onChangeText: setJobRole,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'CTC / Stipend / Grant Amount (e.g. 18 LPA or ₹50,000)',
                    value: jobSalary,
                    onChangeText: setJobSalary,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'Eligibility Criteria & Required Skills',
                    value: jobElig,
                    onChangeText: setJobElig,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => {
                        if (!jobCompany.trim() || !jobRole.trim()) return;
                        setJobs([
                          {
                            id: 'job-' + Date.now(),
                            company: jobCompany.trim(),
                            role: jobRole.trim(),
                            salary: jobSalary.trim() || '12 LPA',
                            tier: 'Super Dream',
                            opening_type: 'Placement Drive',
                            posted_by_badge: `Official ${selectedCollege.code} T&P`,
                            min_cgpa: 7.0,
                            eligibility: jobElig.trim() || 'Verified College Students',
                          },
                          ...jobs,
                        ]);
                        setJobCompany('');
                        setJobRole('');
                        setJobSalary('');
                        setJobElig('');
                        setShowPostJob(false);
                        showToast('Official College Opening Published!', 'success');
                      },
                      style: { backgroundColor: '#0891b2', padding: 10, borderRadius: 10, alignItems: 'center' },
                    },
                    h(Text, { style: { color: '#fff', fontWeight: 800, fontSize: 12 } }, 'Publish Official Opening')
                  )
                ),
              ...filteredJobs.map((job) => {
                const eligible = !job.min_cgpa || currentCgpaNum >= job.min_cgpa;
                return h(
                  View,
                  {
                    key: job.id,
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #e2e8f0',
                      borderLeft: '4px solid #0891b2',
                      gap: 8,
                    },
                  },
                  h(
                    View,
                    { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                    h(
                      View,
                      { style: { flex: 1 } },
                      h(
                        Text,
                        { style: { fontSize: 9, fontWeight: 800, color: '#0e7490' } },
                        `🏛️ ${job.posted_by_badge || 'Official T&P'} • ${job.opening_type || 'Placement Drive'}`
                      ),
                      h(Text, { style: { fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 2 } }, job.company),
                      h(Text, { style: { fontSize: 12, fontWeight: 700, color: '#0891b2' } }, job.role)
                    ),
                    h(
                      View,
                      {
                        style: {
                          backgroundColor: '#dcfce7',
                          padding: '3px 9px',
                          borderRadius: 999,
                          alignSelf: 'flex-start',
                        },
                      },
                      h(Text, { style: { fontSize: 11, fontWeight: 800, color: '#15803d' } }, job.salary)
                    )
                  ),
                  h(
                    Text,
                    {
                      style: {
                        fontSize: 11,
                        color: '#475569',
                        backgroundColor: '#f8fafc',
                        padding: 8,
                        borderRadius: 8,
                      },
                    },
                    `${job.eligibility} (${eligible ? '✓ Your CGPA Qualifies' : '⚠ Check Min CGPA'})`
                  ),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => {
                        setJobs(jobs.map((j) => (j.id === job.id ? { ...j, applied: true } : j)));
                        showToast(`Applied to ${job.company} with Verified Profile!`, 'success');
                      },
                      style: {
                        backgroundColor: job.applied ? '#16a34a' : '#0a66c2',
                        padding: 10,
                        borderRadius: 10,
                        alignItems: 'center',
                      },
                    },
                    h(
                      Text,
                      { style: { color: '#fff', fontSize: 12, fontWeight: 800 } },
                      job.applied ? '✓ Applied with Verified Portfolio' : '1-Tap Apply with Verified CGPA + GitHub →'
                    )
                  )
                );
              })
            ),

          careerSubTab === 'research' &&
            h(
              View,
              { style: { gap: 10 } },
              h(
                View,
                {
                  style: {
                    backgroundColor: '#312e81',
                    borderRadius: 16,
                    padding: 14,
                    gap: 8,
                  },
                },
                h(
                  Text,
                  { style: { color: '#c7d2fe', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em' } },
                  'STUDENT–FACULTY RESEARCH & LAB COLLABORATION'
                ),
                h(
                  Text,
                  { style: { color: '#ffffff', fontSize: 16, fontWeight: 800 } },
                  'Faculty Research Labs, IEEE Papers & TA Slots'
                ),
                h(
                  TouchableOpacity,
                  {
                    onPress: () => setShowPostLab(!showPostLab),
                    style: {
                      backgroundColor: '#ffffff',
                      padding: 9,
                      borderRadius: 10,
                      alignItems: 'center',
                    },
                  },
                  h(
                    Text,
                    { style: { color: '#312e81', fontSize: 11, fontWeight: 800 } },
                    showPostLab ? '✕ Close Form' : '+ Post Faculty Research Lab Slot'
                  )
                )
              ),
              showPostLab &&
                h(
                  View,
                  {
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #c7d2fe',
                      gap: 8,
                    },
                  },
                  h(Text, { style: { fontSize: 14, fontWeight: 800 } }, 'Post Faculty Research / Lab Slot'),
                  h(TextInput, {
                    placeholder: 'Research / Paper Title',
                    value: labTitle,
                    onChangeText: setLabTitle,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'Stipend / Academic Credit (e.g. ₹6,000/mo + Minor Project)',
                    value: labStipend,
                    onChangeText: setLabStipend,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    placeholder: 'Required Skills (comma-separated, e.g. PyTorch, ROS2)',
                    value: labSkills,
                    onChangeText: setLabSkills,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(TextInput, {
                    multiline: true,
                    placeholder: 'Research problem & student deliverables...',
                    value: labDesc,
                    onChangeText: setLabDesc,
                    style: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 9 },
                  }),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => {
                        if (!labTitle.trim()) return;
                        setFacultyProjects([
                          {
                            id: 'fac-' + Date.now(),
                            title: labTitle.trim(),
                            faculty_name: user.name,
                            faculty_dept: user.branch || 'Department of CSE',
                            lab_name: 'Campus Innovation & Research Lab',
                            type: 'IEEE Research',
                            stipend_or_credit: labStipend.trim() || 'Academic Credit + Co-Authorship',
                            spots_total: 3,
                            spots_filled: 0,
                            skills_needed: labSkills
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                            description: labDesc.trim() || 'Faculty-mentored undergraduate research.',
                            applied: false,
                          },
                          ...facultyProjects,
                        ]);
                        setLabTitle('');
                        setLabStipend('');
                        setLabSkills('');
                        setLabDesc('');
                        setShowPostLab(false);
                        showToast('Faculty Lab Slot Published!', 'success');
                      },
                      style: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 10, alignItems: 'center' },
                    },
                    h(Text, { style: { color: '#fff', fontWeight: 800, fontSize: 12 } }, 'Publish Faculty Lab Slot')
                  )
                ),
              ...facultyProjects.map((fp) =>
                h(
                  View,
                  {
                    key: fp.id,
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #e2e8f0',
                      borderLeft: '4px solid #4f46e5',
                      gap: 8,
                    },
                  },
                  h(
                    View,
                    { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                    h(
                      Text,
                      { style: { fontSize: 10, fontWeight: 800, color: '#4338ca' } },
                      `🔬 ${fp.type} • ${fp.spots_total - fp.spots_filled} Slots Open`
                    ),
                    h(
                      Text,
                      { style: { fontSize: 10, fontWeight: 800, color: '#15803d' } },
                      fp.stipend_or_credit
                    )
                  ),
                  h(Text, { style: { fontSize: 14, fontWeight: 800, color: '#0f172a' } }, fp.title),
                  h(
                    Text,
                    { style: { fontSize: 11, color: '#475569', fontWeight: 600 } },
                    `${fp.faculty_name} • ${fp.lab_name}`
                  ),
                  h(Text, { style: { fontSize: 12, color: '#334155' } }, fp.description),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => {
                        setFacultyProjects(
                          facultyProjects.map((item) =>
                            item.id === fp.id ? { ...item, applied: true } : item
                          )
                        );
                        showToast(`Sent GitHub & CGPA to ${fp.faculty_name}!`, 'success');
                      },
                      style: {
                        backgroundColor: fp.applied ? '#16a34a' : '#4f46e5',
                        padding: 9,
                        borderRadius: 9,
                        alignItems: 'center',
                      },
                    },
                    h(
                      Text,
                      { style: { color: '#fff', fontSize: 11.5, fontWeight: 800 } },
                      fp.applied ? '✓ Applied to Faculty Lab' : 'Apply to Faculty Research Lab →'
                    )
                  )
                )
              )
            ),

          careerSubTab === 'townhall' &&
            h(
              View,
              { style: { gap: 10 } },
              h(
                View,
                {
                  style: {
                    backgroundColor: '#ffffff',
                    borderRadius: 16,
                    padding: 14,
                    border: '1px solid #e2e8f0',
                    gap: 8,
                  },
                },
                h(
                  Text,
                  { style: { fontSize: 14, fontWeight: 800 } },
                  `📣 Student–College Townhall (${selectedCollege.short_name})`
                ),
                h(TextInput, {
                  multiline: true,
                  placeholder: 'Submit a campus proposal (e.g. 24x7 lab access, cloud credits)...',
                  value: townhallInput,
                  onChangeText: setTownhallInput,
                  style: {
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: 10,
                    minHeight: 58,
                    fontSize: 12,
                  },
                }),
                h(
                  TouchableOpacity,
                  {
                    onPress: () => {
                      if (!townhallInput.trim()) return;
                      setTownhall([
                        {
                          id: 'th-' + Date.now(),
                          title: townhallInput.trim(),
                          category: 'Campus Proposal',
                          upvotes: 1,
                          upvoted: true,
                          status: 'Open for Voting',
                        },
                        ...townhall,
                      ]);
                      setTownhallInput('');
                      showToast('Proposal posted to College Townhall!', 'success');
                    },
                    style: { backgroundColor: '#7c3aed', padding: 10, borderRadius: 10, alignItems: 'center' },
                  },
                  h(Text, { style: { color: '#fff', fontWeight: 800, fontSize: 12 } }, 'Submit Proposal to Dean & T&P')
                )
              ),
              ...townhall.map((item) =>
                h(
                  View,
                  {
                    key: item.id,
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #e2e8f0',
                      gap: 8,
                    },
                  },
                  h(
                    View,
                    { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                    h(Text, { style: { fontSize: 10, fontWeight: 800, color: '#6d28d9' } }, item.category),
                    h(Text, { style: { fontSize: 10, fontWeight: 800, color: '#15803d' } }, item.status)
                  ),
                  h(Text, { style: { fontSize: 13.5, fontWeight: 800, color: '#0f172a' } }, item.title),
                  item.college_response &&
                    h(
                      View,
                      {
                        style: {
                          backgroundColor: '#f0fdf4',
                          borderLeft: '3px solid #16a34a',
                          padding: 9,
                          borderRadius: 8,
                        },
                      },
                      h(
                        Text,
                        { style: { fontSize: 10, fontWeight: 800, color: '#166534' } },
                        '🏛️ OFFICIAL COLLEGE RESPONSE'
                      ),
                      h(Text, { style: { fontSize: 11.5, color: '#14532d', marginTop: 2 } }, item.college_response)
                    ),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () =>
                        setTownhall(
                          townhall.map((t) =>
                            t.id === item.id
                              ? { ...t, upvoted: !t.upvoted, upvotes: t.upvoted ? t.upvotes - 1 : t.upvotes + 1 }
                              : t
                          )
                        ),
                      style: {
                        alignSelf: 'flex-start',
                        backgroundColor: item.upvoted ? '#ede9fe' : '#f1f5f9',
                        padding: '5px 11px',
                        borderRadius: 8,
                      },
                    },
                    h(
                      Text,
                      { style: { fontSize: 11, fontWeight: 800, color: item.upvoted ? '#6d28d9' : '#475569' } },
                      `▲ Upvote (${item.upvotes})`
                    )
                  )
                )
              )
            ),

          careerSubTab === 'mentors' &&
            h(
              View,
              { style: { gap: 10 } },
              activeMentor &&
                h(
                  View,
                  {
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 16,
                      padding: 14,
                      border: '1px solid #cbd5e1',
                      gap: 8,
                    },
                  },
                  h(Text, { style: { fontSize: 13, fontWeight: 800 } }, `Message ${activeMentor.name}`),
                  h(TextInput, {
                    multiline: true,
                    placeholder: 'Ask for GitHub repo feedback, SIH advice, or referral...',
                    value: mentorMsgText,
                    onChangeText: setMentorMsgText,
                    style: {
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      padding: 10,
                      minHeight: 60,
                      fontSize: 12,
                    },
                  }),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => {
                        if (!mentorMsgText.trim()) return;
                        showToast(`Message sent to ${activeMentor.name}!`, 'success');
                        setMentorMsgText('');
                        setActiveMentor(null);
                      },
                      style: { backgroundColor: '#4f46e5', padding: 10, borderRadius: 10, alignItems: 'center' },
                    },
                    h(Text, { style: { color: '#fff', fontSize: 12, fontWeight: 800 } }, 'Send Message')
                  )
                ),
              ...mentors.map((m) =>
                h(
                  View,
                  {
                    key: m.id,
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 14,
                      padding: 13,
                      border: '1px solid #e2e8f0',
                      borderLeft: '4px solid #4f46e5',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    },
                  },
                  h(
                    View,
                    { style: { flex: 1 } },
                    h(Text, { style: { fontSize: 14, fontWeight: 800, color: '#0f172a' } }, `${m.name} (${m.mentor_type})`),
                    h(Text, { style: { fontSize: 11, color: '#64748b', marginTop: 2 } }, m.expertise)
                  ),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => setActiveMentor(m),
                      style: { backgroundColor: '#eef2ff', padding: '7px 10px', borderRadius: 10 },
                    },
                    h(Text, { style: { fontSize: 11, fontWeight: 800, color: '#4f46e5' } }, '💬 Message')
                  )
                )
              )
            )
        ),

      // ==================== TAB 5: UNIFIED LINKEDIN + GITHUB PROFILE ====================
      activeTab === 'profile' &&
        h(
          View,
          { style: { gap: 12 } },
          h(
            View,
            { className: 'rn-hscroll', style: { flexDirection: 'row', gap: 6 } },
            [
              { id: 'portfolio', label: '👤 Portfolio' },
              { id: 'materials', label: '📚 Materials' },
              { id: 'clubs', label: '🚀 Clubs' },
              { id: 'suggestions', label: '💡 Suggestions' },
              { id: 'feedback', label: '⭐ Feedback' },
            ].map((sec) =>
              h(
                TouchableOpacity,
                {
                  key: sec.id,
                  onPress: () => setProfileSection(sec.id),
                  style: {
                    padding: '6px 12px',
                    borderRadius: 999,
                    backgroundColor: profileSection === sec.id ? '#0f766e' : '#ffffff',
                    border: '1px solid #e2e8f0',
                  },
                },
                h(
                  Text,
                  {
                    style: {
                      fontSize: 11,
                      fontWeight: 700,
                      color: profileSection === sec.id ? '#ffffff' : '#475569',
                      whiteSpace: 'nowrap',
                    },
                  },
                  sec.label
                )
              )
            )
          ),
          profileSection === 'portfolio' &&
            h(
              View,
              { style: { gap: 12 } },
              h(
                View,
                {
                  style: {
                    backgroundColor: '#ffffff',
                    borderRadius: 16,
                    padding: 14,
                    border: '1px solid #e2e8f0',
                    gap: 6,
                  },
                },
                h(
                  Text,
                  { style: { fontSize: 10, fontWeight: 800, color: '#0f766e' } },
                  `✓ ${selectedCollege.name} • Roll: ${user.roll}`
                ),
                h(Text, { style: { fontSize: 18, fontWeight: 800, color: '#0f172a' } }, user.name),
                h(Text, { style: { fontSize: 12, color: '#475569' } }, user.headline),
                user.bio && h(Text, { style: { fontSize: 11, color: '#334155' } }, user.bio)
              ),
              h(
                View,
                {
                  style: {
                    backgroundColor: '#0d1117',
                    borderRadius: 16,
                    padding: 14,
                    border: '1px solid #30363d',
                    gap: 10,
                  },
                },
                h(
                  View,
                  { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
                  h(Text, { style: { color: '#ffffff', fontSize: 13, fontWeight: 800 } }, '🟩 GitHub Contribution Graph'),
                  h(Text, { style: { color: '#39d353', fontSize: 11, fontWeight: 700 } }, `${user.commits_count || 412} commits`)
                ),
                h(
                  View,
                  { style: { flexDirection: 'row', justifyContent: 'space-between' } },
                  HEATMAP_WEEKS.map((week, wIdx) =>
                    h(
                      View,
                      { key: wIdx, style: { gap: 4 } },
                      week.map((lvl, dIdx) =>
                        h(View, {
                          key: dIdx,
                          style: { width: 14, height: 14, borderRadius: 3, backgroundColor: heatColors[lvl] },
                        })
                      )
                    )
                  )
                )
              ),
              h(
                View,
                {
                  style: {
                    backgroundColor: '#ffffff',
                    borderRadius: 16,
                    padding: 14,
                    border: '1px solid #e2e8f0',
                    gap: 10,
                  },
                },
                h(Text, { style: { fontSize: 14, fontWeight: 800 } }, '⚡ Verified Skills & Endorsements'),
                h(
                  View,
                  { style: { flexDirection: 'row', gap: 8 } },
                  h(TextInput, {
                    placeholder: 'Add skill (e.g. GraphQL, Kubernetes)...',
                    value: skillInput,
                    onChangeText: setSkillInput,
                    style: {
                      flex: 1,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      padding: '8px 12px',
                      fontSize: 12,
                    },
                  }),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => {
                        if (!skillInput.trim()) return;
                        setUser({ ...user, skills: [...(user.skills || []), skillInput.trim()] });
                        setSkillInput('');
                        showToast('Skill added to profile!', 'success');
                      },
                      style: { backgroundColor: '#0f172a', padding: '8px 14px', borderRadius: 10, justifyContent: 'center' },
                    },
                    h(Text, { style: { color: '#fff', fontSize: 12, fontWeight: 800 } }, '+ Add')
                  )
                ),
                h(
                  View,
                  { style: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 } },
                  (user.skills || []).map((sk, idx) =>
                    h(
                      View,
                      {
                        key: sk + idx,
                        style: {
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          padding: '4px 10px',
                          borderRadius: 999,
                        },
                      },
                      h(Text, { style: { fontSize: 11, fontWeight: 700, color: '#1e40af' } }, sk)
                    )
                  )
                )
              ),
              h(
                TouchableOpacity,
                {
                  onPress: () => {
                    setUser(null);
                    setAuthMode('welcome');
                  },
                  style: {
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    padding: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                  },
                },
                h(Text, { style: { color: '#dc2626', fontWeight: 800, fontSize: 13 } }, 'Sign Out of Galaxy Fusion')
              )
            ),
          profileSection === 'materials' &&
            h(
              View,
              { style: { gap: 10 } },
              ...materials.map((m) =>
                h(
                  View,
                  {
                    key: m.id,
                    style: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, border: '1px solid #e2e8f0' },
                  },
                  h(Text, { style: { fontSize: 14, fontWeight: 800 } }, m.title),
                  h(Text, { style: { fontSize: 12, color: '#64748b', marginTop: 4 } }, m.description)
                )
              )
            ),
          profileSection === 'clubs' &&
            h(
              View,
              { style: { gap: 10 } },
              ...(CLUB_CATEGORIES[clubCategory] || []).map((club) =>
                h(
                  View,
                  {
                    key: club.name,
                    style: {
                      backgroundColor: '#ffffff',
                      borderRadius: 14,
                      padding: 13,
                      border: '1px solid #e2e8f0',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  },
                  h(
                    View,
                    null,
                    h(Text, { style: { fontSize: 14, fontWeight: 800 } }, club.name),
                    h(Text, { style: { fontSize: 11, color: '#64748b' } }, `Lead: ${club.lead} • ${club.members} Members`)
                  ),
                  h(
                    TouchableOpacity,
                    {
                      onPress: () => showToast(`Joined ${club.name}!`, 'success'),
                      style: { backgroundColor: '#ccfbf1', padding: '6px 12px', borderRadius: 999 },
                    },
                    h(Text, { style: { fontSize: 11, fontWeight: 800, color: '#0f766e' } }, 'Join')
                  )
                )
              )
            ),
          profileSection === 'suggestions' &&
            h(
              View,
              { style: { gap: 10 } },
              ...suggestions.map((s, idx) =>
                h(
                  View,
                  {
                    key: idx,
                    style: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12, border: '1px solid #e2e8f0' },
                  },
                  h(Text, { style: { fontSize: 12, color: '#334155' } }, s)
                )
              )
            ),
          profileSection === 'feedback' &&
            h(
              View,
              {
                style: {
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  padding: 16,
                  border: '1px solid #e2e8f0',
                  gap: 10,
                  alignItems: 'center',
                },
              },
              h(Text, { style: { fontSize: 15, fontWeight: 800 } }, '⭐ Rate Galaxy Fusion (React Native)'),
              h(
                TouchableOpacity,
                {
                  onPress: () => showToast('Thank you for your 5★ rating!', 'success'),
                  style: { width: '100%', backgroundColor: '#7c3aed', padding: 11, borderRadius: 10, alignItems: 'center' },
                },
                h(Text, { style: { color: '#fff', fontWeight: 800, fontSize: 12 } }, 'Send 5★ Feedback')
              )
            )
        )
    ),

    // Bottom Tab Navigation Bar
    h(
      View,
      {
        style: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: '8px 4px',
          zIndex: 30,
        },
      },
      [
        { id: 'feed', icon: '🏛️', label: 'Campus Hub' },
        { id: 'teams', icon: '🤝', label: 'Teammates' },
        { id: 'repos', icon: '🐙', label: 'GitHub' },
        { id: 'career', icon: '💼', label: 'College & Labs' },
        { id: 'profile', icon: '👤', label: 'Profile' },
      ].map((t) => {
        const active = activeTab === t.id;
        return h(
          TouchableOpacity,
          {
            key: t.id,
            onPress: () => setActiveTab(t.id),
            style: { alignItems: 'center', flex: 1 },
          },
          h(Text, { style: { fontSize: 17 } }, t.icon),
          h(
            Text,
            {
              style: {
                fontSize: 9.5,
                fontWeight: active ? 800 : 600,
                color: active ? '#0f766e' : '#64748b',
                marginTop: 2,
              },
            },
            t.label
          )
        );
      })
    ),

    // Individual College Workspace Switcher Modal
    showCollegeModal &&
      h(
        View,
        {
          onClick: () => setShowCollegeModal(false),
          style: {
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            zIndex: 90,
            justifyContent: 'center',
            padding: 18,
          },
        },
        h(
          View,
          {
            onClick: (e) => e.stopPropagation(),
            style: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, gap: 10 },
          },
          h(Text, { style: { fontSize: 15, fontWeight: 800 } }, '🏛️ Switch Individual College Workspace'),
          ...CAMPUS_COLLEGES.map((col) =>
            h(
              TouchableOpacity,
              {
                key: col.id,
                onPress: () => {
                  setSelectedCollege(col);
                  setShowCollegeModal(false);
                  showToast(`Switched to ${col.short_name}!`, 'success');
                },
                style: {
                  backgroundColor: selectedCollege.id === col.id ? '#f0fdfa' : '#f8fafc',
                  border: `1px solid ${selectedCollege.id === col.id ? '#14b8a6' : '#e2e8f0'}`,
                  padding: 10,
                  borderRadius: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              },
              h(
                View,
                null,
                h(Text, { style: { fontSize: 13, fontWeight: 800 } }, `${col.logo_emoji} ${col.name}`),
                h(
                  Text,
                  { style: { fontSize: 10, color: '#64748b' } },
                  `${col.city} • ${col.verified_students} Students • ${col.active_openings} Openings`
                )
              )
            )
          )
        )
      ),

    // Notifications Modal
    showNotifModal &&
      h(
        View,
        {
          onClick: () => setShowNotifModal(false),
          style: {
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 80,
            justifyContent: 'center',
            padding: 18,
          },
        },
        h(
          View,
          {
            onClick: (e) => e.stopPropagation(),
            style: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, gap: 10 },
          },
          h(
            View,
            { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
            h(Text, { style: { fontSize: 16, fontWeight: 800 } }, 'Notifications'),
            h(
              TouchableOpacity,
              { onPress: () => setShowNotifModal(false) },
              h(Text, { style: { fontSize: 16, fontWeight: 800, color: '#64748b' } }, '✕')
            )
          ),
          ...notifications.map((n) =>
            h(
              View,
              {
                key: n.id,
                style: {
                  backgroundColor: '#f8fafc',
                  padding: 10,
                  borderRadius: 10,
                  borderLeft: '4px solid #4f46e5',
                },
              },
              h(Text, { style: { fontSize: 12, fontWeight: 800 } }, n.from_user_name),
              h(Text, { style: { fontSize: 11, color: '#475569', marginTop: 2 } }, n.message),
              h(Text, { style: { fontSize: 9, color: '#94a3b8', marginTop: 4 } }, n.created_at)
            )
          )
        )
      ),

    // Slide-Out Drawer Menu
    showDrawer &&
      h(
        View,
        {
          onClick: () => setShowDrawer(false),
          style: {
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 85,
          },
        },
        h(
          View,
          {
            onClick: (e) => e.stopPropagation(),
            style: {
              width: 260,
              height: '100%',
              backgroundColor: '#ffffff',
              justifyContent: 'space-between',
            },
          },
          h(
            View,
            null,
            h(
              View,
              { style: { backgroundColor: '#0f766e', padding: 18 } },
              h(Text, { style: { color: '#fff', fontSize: 19, fontWeight: 800 } }, 'Galaxy Fusion'),
              h(
                Text,
                { style: { color: '#99f6e4', fontSize: 11, marginTop: 2 } },
                `${selectedCollege.logo_emoji} ${selectedCollege.short_name}`
              )
            ),
            h(
              View,
              { style: { padding: 10, gap: 3 } },
              [
                { label: '🏛️ Campus Collaboration Hub', tab: 'feed' },
                { label: '🤝 Ask for Teammates (Student–Student)', tab: 'teams', sub: 'hackathons' },
                { label: '🔍 Find College Peers Directory', tab: 'teams', sub: 'peers' },
                { label: '💬 Skill Groups & Live Chat', tab: 'teams', sub: 'groups' },
                { label: '🐙 Projects & Repos (GitHub)', tab: 'repos' },
                { label: '💼 Official College Openings (T&P)', tab: 'career', sub: 'placements' },
                { label: '🔬 Faculty Research Labs (Student–Faculty)', tab: 'career', sub: 'research' },
                { label: '📣 College Townhall & Dean Replies', tab: 'career', sub: 'townhall' },
                { label: '🎓 Find a Mentor', tab: 'career', sub: 'mentors' },
                { label: '👤 My Verified Profile', tab: 'profile', sub: 'portfolio' },
              ].map((item) =>
                h(
                  TouchableOpacity,
                  {
                    key: item.label,
                    onPress: () => navigateTo(item.tab, item.sub),
                    style: { padding: '9px 11px', borderRadius: 10 },
                  },
                  h(Text, { style: { fontSize: 12.5, fontWeight: 700, color: '#1e293b' } }, item.label)
                )
              )
            )
          ),
          h(
            View,
            { style: { padding: 14, borderTop: '1px solid #f1f5f9' } },
            h(
              TouchableOpacity,
              {
                onPress: () => {
                  setUser(null);
                  setShowDrawer(false);
                },
                style: { padding: 8 },
              },
              h(Text, { style: { fontSize: 13, fontWeight: 800, color: '#dc2626' } }, '🚪 Logout')
            )
          )
        )
      )
  );
}

const root = ReactDOM.createRoot(document.getElementById('rn-root'));
root.render(h(GalaxyFusionRNApp));
