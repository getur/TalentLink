
import { Opportunity, UserProfile, Application } from './types';

export const MOCK_USER: UserProfile = {
  id: 'user_1',
  first_name: 'Alex',
  last_name: 'Rivera',
  username: 'arivera',
  email: 'alex.rivera@aiesec.net',
  user_type: 'Member',
  office: 'LC ISCTEM',
  department: 'OGV',
  current_pos_type: 'OC',
  join_date: '2023-01-15',
  bio: 'Passionate about international exchange and youth leadership.',
  education: [
    {
      institution_name: 'ISCTEM',
      degree: 'BSc',
      field_of_study: 'Computer Science',
      status: 'Ongoing',
      start_date: '2021-02-01',
      description: 'Focusing on software engineering and systems architecture.'
    }
  ],
  professional: [],
  skills: [{ skill_name: 'Project Management', category: 'Soft', level: 'Intermediate' }],
  languages: [{ language_name: 'English', level: 'Fluent' }],
  saved_opportunity_ids: [],
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'VP Outgoing Global Volunteer',
    department: 'OGV',
    pos_type: 'LCVP',
    duration: 'Long',
    office: 'LC ISCTEM',
    status: 'Active',
    post_date: '2024-05-01',
    due_date: '2024-06-15',
    description: `## Role Overview
Lead the OGV functional area for the next term. You will be responsible for:
- Strategic planning for winter and summer peaks.
- Managing a team of 15+ members.
- Ensuring quality standards for all exchanges.

### Requirements
- Strong leadership background.
- Previous experience in OGV preferred.`,
    responsible_contact: {
      name: 'Sarah Chen',
      role: 'LCP LC ISCTEM',
      email: 'sarah.chen@aiesec.net',
      phone: '+258 84 123 4567'
    },
    questionnaire: [
      "What is your vision for OGV in the next term?",
      "How do you plan to improve member productivity?",
      "Describe a time you managed a conflict within a team."
    ],
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968313.png'
  },
  {
    id: 'opp_2',
    title: 'Marketing Specialist',
    department: 'MKT',
    pos_type: 'EST/NST',
    duration: 'Medium',
    office: 'MC',
    status: 'Active',
    post_date: '2024-05-10',
    due_date: '2024-05-25',
    description: `Support the national marketing team in digital campaigns and brand positioning.`,
    responsible_contact: {
      name: 'John Doe',
      role: 'MCVP MKT',
      email: 'john.doe@aiesec.net',
      phone: '+258 82 000 0000'
    },
    questionnaire: ["Link your portfolio.", "What digital tools are you proficient in?"],
    logo: 'https://cdn-icons-png.flaticon.com/512/919/919851.png'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_1',
    opportunity_id: 'opp_2',
    user_id: 'user_1',
    applied_at: '2024-05-12T10:00:00Z',
    answers: { "Link your portfolio.": "behance.net/alexr" },
    status: 'Pending'
  }
];
