
import React, { useState, useMemo } from 'react';
import { Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, Clock, Bookmark, Activity, Stars, Plus, 
  CheckCircle2, FileText, Download, Users, TrendingUp, Info, Phone, Mail, User, X, ClipboardCheck, Tag,
  PanelLeftClose, PanelLeftOpen, ArrowLeft, Calendar
} from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import JobCard from './components/JobCard';
import { MOCK_OPPORTUNITIES, MOCK_APPLICATIONS, MOCK_USER } from './constants';
import { Opportunity, UserType, Application, ApplicationStatus, Department, Office, PositionType, Duration } from './types';
import { getJobMatchScore, parseResumeAI } from './services/geminiService';

const OpportunityListView = ({ userType }: { userType: UserType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string>('All Offices');
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>([]);
  const [selectedPositionTypes, setSelectedPositionTypes] = useState<PositionType[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Duration[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredOpportunities = useMemo(() => {
    return MOCK_OPPORTUNITIES.filter(opp => {
      const matchesSearch = 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesOffice = selectedOffice === 'All Offices' || opp.office === selectedOffice;
      
      const matchesDept = selectedDepartments.length === 0 || selectedDepartments.includes(opp.department);
      
      const matchesPos = selectedPositionTypes.length === 0 || selectedPositionTypes.includes(opp.pos_type);
      
      const matchesDur = selectedDurations.length === 0 || selectedDurations.includes(opp.duration);

      return matchesSearch && matchesOffice && matchesDept && matchesPos && matchesDur;
    });
  }, [searchTerm, selectedOffice, selectedDepartments, selectedPositionTypes, selectedDurations]);

  const handleFilterToggle = (category: string, value: string) => {
    if (category === 'department') {
      setSelectedDepartments(prev => 
        prev.includes(value as Department) ? prev.filter(v => v !== value) : [...prev, value as Department]
      );
    } else if (category === 'positionType') {
      setSelectedPositionTypes(prev => 
        prev.includes(value as PositionType) ? prev.filter(v => v !== value) : [...prev, value as PositionType]
      );
    } else if (category === 'duration') {
      setSelectedDurations(prev => 
        prev.includes(value as Duration) ? prev.filter(v => v !== value) : [...prev, value as Duration]
      );
    } else if (category === 'office') {
      setSelectedOffice(prev => prev === value ? 'All Offices' : value);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 flex bg-white gap-0">
      {isSidebarOpen && (
        <Sidebar 
          filters={{
            departments: selectedDepartments,
            positionTypes: selectedPositionTypes,
            durations: selectedDurations,
            office: selectedOffice
          }}
          onFilterToggle={handleFilterToggle}
        />
      )}
      <main className={`flex-1 transition-all duration-300`}>
        <div className="mb-12 flex justify-between items-end">
          <div className="flex items-start gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mt-1 p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors border border-transparent hover:border-gray-100"
              title={isSidebarOpen ? "Hide Filters" : "Show Filters"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-black mb-1">AIESEC Opportunities</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internal Talent Marketplace</p>
            </div>
          </div>
          {userType !== 'Member' && (
            <button className="bg-black text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <Plus className="w-4 h-4" />
              Post Role
            </button>
          )}
        </div>

        <div className="space-y-4 mb-12">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-1.5 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 pl-4 pr-2 border-r border-gray-100">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search roles, functional areas, keywords..." 
                className="bg-transparent border-none focus:outline-none text-sm text-black w-full placeholder:text-gray-400 font-medium" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 pl-4 pr-2 border-r border-gray-100">
              <MapPin className="w-4 h-4 text-gray-400" />
              <select 
                className="bg-transparent border-none focus:outline-none text-sm text-black w-full font-bold cursor-pointer"
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
              >
                <option value="All Offices">All Offices</option>
                <option value="MC">MC</option>
                <option value="LC ISCTEM">LC ISCTEM</option>
                <option value="LC Beira">LC Beira</option>
                <option value="LC GAZA">LC GAZA</option>
                <option value="LC UEM">LC UEM</option>
              </select>
            </div>
            <button className="bg-black text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-extrabold text-black uppercase tracking-widest">Available Opportunities</h2>
            <span className="text-[10px] font-bold text-gray-300 uppercase">/</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredOpportunities.length} results found</span>
          </div>
          {(searchTerm || selectedOffice !== 'All Offices' || selectedDepartments.length > 0 || selectedPositionTypes.length > 0 || selectedDurations.length > 0) && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedOffice('All Offices');
                setSelectedDepartments([]);
                setSelectedPositionTypes([]);
                setSelectedDurations([]);
              }}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black"
            >
              Clear all
            </button>
          )}
        </div>

        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredOpportunities.map(opp => (
              <JobCard key={opp.id} job={opp} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-black uppercase tracking-widest">No opportunities found</p>
            <p className="text-xs text-gray-400 mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const DashboardView = ({ userType }: { userType: UserType }) => {
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending': return 'bg-gray-50 text-gray-500 border-gray-100';
      case 'Accepted': return 'bg-green-50 text-green-600 border-green-100';
      case 'Interviewing': return 'bg-black text-white border-black';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-extrabold text-black">
          {userType === 'Member' ? 'My Growth Path' : 'Opportunity Manager'}
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Role</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Functional Area</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_APPLICATIONS.map(app => {
              const opp = MOCK_OPPORTUNITIES.find(o => o.id === app.opportunity_id);
              return (
                <tr key={app.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-black">{opp?.title}</span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{opp?.department}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const [profile, setProfile] = useState(MOCK_USER);
  const [parsing, setParsing] = useState(false);

  const handleResumeSync = async () => {
    setParsing(true);
    const result = await parseResumeAI("Experienced project leader in youth organizations, proficient in marketing and community outreach.");
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, ...result.skills.map((s: string) => ({ skill_name: s, category: 'Hard', level: 'Beginner' }))],
      bio: result.bio
    }));
    setParsing(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-20 px-8">
      <div className="flex flex-col md:flex-row gap-12 mb-20">
        <div className="md:w-1/3">
          <div className="w-40 h-40 rounded-2xl bg-gray-50 border border-gray-100 mb-6 p-1">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-black mb-1">{profile.first_name} {profile.last_name}</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{profile.current_pos_type} • {profile.office}</p>
          
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-wider">
               <Mail className="w-4 h-4" /> {profile.email}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-wider">
               <Activity className="w-4 h-4" /> Joined {profile.join_date}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-12">
          <section>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-black mb-6">About Me</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">{profile.bio}</p>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-black">Education</h3>
              <Plus className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
            <div className="space-y-6">
              {profile.education.map((edu, i) => (
                <div key={i} className="p-6 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-black">{edu.institution_name}</h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-white px-2 py-1 rounded border border-gray-100">{edu.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-1">{edu.degree} in {edu.field_of_study}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{edu.start_date} — {edu.end_date || 'Present'}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border border-gray-100 rounded-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase">{s.skill_name}</span>
                ))}
              </div>
            </div>
            <div className="p-8 border border-gray-100 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">AI Sync</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-6">Sync profile with CV content</p>
              </div>
              <button 
                onClick={handleResumeSync}
                disabled={parsing}
                className="w-full py-2.5 border border-gray-100 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:border-black transition-all disabled:opacity-50"
              >
                {parsing ? 'Analyzing...' : 'Sync via Gemini'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = MOCK_OPPORTUNITIES.find(j => j.id === id) || MOCK_OPPORTUNITIES[0];
  const [applying, setApplying] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleApplySubmit = () => {
    alert("Application submitted successfully to " + job.responsible_contact.name);
    setApplying(false);
    navigate('/dashboard');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {applying && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-8 overflow-y-auto">
          <div className="max-w-2xl w-full my-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-extrabold text-black">Role Questionnaire</h2>
              <button onClick={() => setApplying(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-10">
              {job.questionnaire.map((q, i) => (
                <div key={i}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{q}</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:border-black transition-colors"
                    rows={3}
                    onChange={(e) => setAnswers({...answers, [q]: e.target.value})}
                  />
                </div>
              ))}
              <button 
                onClick={handleApplySubmit}
                className="w-full bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
              >
                <ClipboardCheck className="w-4 h-4" />
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto pt-8 px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors mb-12 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          Back to roles
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-center">
               <img src={job.logo} className="w-full h-full object-contain grayscale" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-black mb-2">{job.title}</h1>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{job.department} Department</span>
                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.office}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setApplying(true)} className="bg-black text-white px-10 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
               Apply Now
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="prose prose-slate max-w-none">
              <h3 className="text-sm font-extrabold uppercase tracking-widest mb-6">Opportunity Description</h3>
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-8 border border-gray-100 rounded-xl">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Position details</h4>
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400"><Clock className="w-4 h-4" /></div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5 leading-none">Duration</p>
                     <p className="text-xs font-bold text-black uppercase">{job.duration}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400"><Briefcase className="w-4 h-4" /></div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5 leading-none">Position</p>
                     <p className="text-xs font-bold text-black uppercase">{job.pos_type}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400"><Activity className="w-4 h-4" /></div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5 leading-none">Posted</p>
                     <p className="text-xs font-bold text-black uppercase">{job.post_date}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400"><Calendar className="w-4 h-4" /></div>
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5 leading-none">Due Date</p>
                     <p className="text-xs font-bold text-red-500 uppercase">{job.due_date}</p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="p-8 border border-gray-100 rounded-xl bg-gray-50/30">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Responsible Contact</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400"><User className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-black uppercase">{job.responsible_contact.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{job.responsible_contact.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400"><Mail className="w-4 h-4" /></div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{job.responsible_contact.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400"><Phone className="w-4 h-4" /></div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{job.responsible_contact.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userType] = useState<UserType>('Member');

  return (
    <div className="min-h-screen bg-white">
      <Navbar role={userType} />
      <Routes>
        <Route path="/" element={<OpportunityListView userType={userType} />} />
        <Route path="/job/:id" element={<JobDetailView />} />
        <Route path="/dashboard" element={<DashboardView userType={userType} />} />
        <Route path="/profile" element={<ProfileView />} />
      </Routes>
    </div>
  );
};

export default App;
