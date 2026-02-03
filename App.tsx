
import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, Clock, Bookmark, Activity, Stars, Plus, 
  CheckCircle2, FileText, Download, Users, TrendingUp, Info, Phone, Mail, User, X, ClipboardCheck, Tag,
  ArrowLeft, Calendar, Home, Settings, Copy, ExternalLink, Globe, ShieldCheck,
  GraduationCap, Building2, PencilLine, Sparkles, FileDown, Save, Trash2, PlusCircle,
  SlidersHorizontal, ArrowUpDown, LayoutGrid, ChevronDown
} from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import JobCard from './components/JobCard';
import { MOCK_OPPORTUNITIES, MOCK_APPLICATIONS, MOCK_USER } from './constants';
import { Opportunity, UserType, Application, ApplicationStatus, Department, Office, PositionType, Duration, UserProfile, Education, ProfessionalExperience, Skill, Language } from './types';
import { getJobMatchScore, parseResumeAI } from './services/geminiService';

interface ModalOverlayProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200">
    <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-sm font-black text-black uppercase tracking-widest">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
      </div>
      <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  actionIcon?: any;
  onAction?: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, actionIcon: ActionIcon, onAction }) => (
  <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-4 shadow-sm">
    <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center">
      <h3 className="text-sm font-black text-black uppercase tracking-widest">{title}</h3>
      {ActionIcon && (
        <button onClick={onAction} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-black transition-colors">
          <ActionIcon className="w-4 h-4" />
        </button>
      )}
    </div>
    <div className="p-8">
      {children}
    </div>
  </div>
);

const OpportunityListView = ({ userType }: { userType: UserType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string>('All Offices');
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>([]);
  const [selectedPositionTypes, setSelectedPositionTypes] = useState<PositionType[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<Duration[]>([]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredOpportunities = useMemo(() => {
    let result = MOCK_OPPORTUNITIES.filter(opp => {
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

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime());
    } else if (sortBy === 'oldest') {
      result = [...result].sort((a, b) => new Date(a.post_date).getTime() - new Date(b.post_date).getTime());
    } else if (sortBy === 'due_date') {
      result = [...result].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    }

    return result;
  }, [searchTerm, selectedOffice, selectedDepartments, selectedPositionTypes, selectedDurations, sortBy]);

  const displayedOpportunities = useMemo(() => {
    return filteredOpportunities.slice(0, visibleCount);
  }, [filteredOpportunities, visibleCount]);

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
    setVisibleCount(6);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedOffice('All Offices');
    setSelectedDepartments([]);
    setSelectedPositionTypes([]);
    setSelectedDurations([]);
    setVisibleCount(6);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 flex bg-white gap-0 min-h-screen">
      {isSidebarOpen && (
        <Sidebar 
          filters={{
            departments: selectedDepartments,
            positionTypes: selectedPositionTypes,
            durations: selectedDurations,
            office: selectedOffice
          }}
          onFilterToggle={handleFilterToggle}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />
      )}
      <main className={`flex-1 transition-all duration-300`}>
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-1">AIESEC Opportunities</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internal Talent Marketplace</p>
          </div>
          {userType !== 'Member' && (
            <button className="bg-black text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-100">
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
                className="bg-transparent border-none focus:outline-none text-sm text-black w-full placeholder:text-gray-400 font-bold" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 pl-4 pr-2 border-r border-gray-100">
              <MapPin className="w-4 h-4 text-gray-400" />
              <select 
                className="bg-transparent border-none focus:outline-none text-sm text-black w-full font-black cursor-pointer"
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

        <div className="mb-8 flex justify-between items-center border-b border-gray-50 pb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-extrabold text-black uppercase tracking-widest">Available Opportunities</h2>
            <span className="text-[10px] font-bold text-gray-300 uppercase">/</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filteredOpportunities.length} results</span>
          </div>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isSidebarOpen ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isSidebarOpen ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isSidebarOpen ? 'text-black' : 'text-gray-400 hover:text-black'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              View
            </button>
            {(searchTerm || selectedOffice !== 'All Offices' || selectedDepartments.length > 0 || selectedPositionTypes.length > 0 || selectedDurations.length > 0) && (
              <button 
                onClick={handleClearAll}
                className="text-[10px] font-bold text-orange-500 uppercase tracking-widest hover:underline border-l border-gray-100 pl-8"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {displayedOpportunities.length > 0 ? (
          <div className="space-y-12 pb-32">
            <div className={viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-3"}>
              {displayedOpportunities.map(opp => (
                <JobCard key={opp.id} job={opp} viewMode={viewMode} />
              ))}
            </div>

            {visibleCount < filteredOpportunities.length && (
              <div className="flex justify-center pt-8">
                <button 
                  onClick={handleLoadMore}
                  className="group flex flex-col items-center gap-3 active:scale-95 transition-all"
                >
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-black">Load More Positions</span>
                  <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-black group-hover:border-black bg-white shadow-sm transition-all">
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-black uppercase tracking-widest">No matching roles</p>
            <p className="text-xs text-gray-400 mt-2 font-bold">Try adjusting your filters or search keywords.</p>
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

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
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
                <tr key={app.id} className="hover:bg-gray-50/30 transition-colors cursor-pointer">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-black">{opp?.title}</span>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{opp?.department}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(app.status)}`}>
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
             <button className="p-3 border border-gray-100 rounded-xl text-gray-400 hover:text-black hover:border-gray-300 transition-all">
               <Bookmark className="w-4 h-4" />
             </button>
             <button className="bg-white text-black border border-gray-100 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-gray-300 transition-all flex items-center gap-2">
               <FileDown className="w-4 h-4" />
               Download PDF
             </button>
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

const ProfileView = () => {
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeModal, setActiveModal] = useState<'exp' | 'edu' | 'skill' | 'lang' | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await parseResumeAI(profile.bio || "Experienced student leader focused on youth development.");
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, ...result.skills.map((s: string) => ({ skill_name: s, category: 'Hard', level: 'Intermediate' as any }))],
        bio: result.bio
      }));
      alert("Profile synced with TalentLink AI.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pb-32">
      {/* Modals for Adding Items */}
      {activeModal === 'exp' && (
        <ModalOverlay title="Add Experience" onClose={() => setActiveModal(null)}>
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const newItem: ProfessionalExperience = {
              organization: fd.get('org') as string,
              title: fd.get('title') as string,
              is_external: fd.get('type') === 'External',
              location: fd.get('loc') as string,
              start_date: fd.get('start') as string,
              end_date: (fd.get('end') as string) || undefined,
              responsibilities: fd.get('desc') as string,
            };
            setProfile({ ...profile, professional: [newItem, ...profile.professional] });
            setActiveModal(null);
          }}>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Organization</label>
              <input name="org" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold" placeholder="e.g. AIESEC in Mozambique" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Role Title</label>
              <input name="title" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold" placeholder="e.g. LCVP Expansion" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Start Period</label>
                <input name="start" type="month" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Completion Period</label>
                <input name="end" type="month" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Impact Summary</label>
              <textarea name="desc" rows={4} className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-medium" placeholder="Briefly describe your impact..." />
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">Record Experience</button>
          </form>
        </ModalOverlay>
      )}

      {activeModal === 'edu' && (
        <ModalOverlay title="Add Education" onClose={() => setActiveModal(null)}>
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const newItem: Education = {
              institution_name: fd.get('inst') as string,
              degree: fd.get('deg') as string,
              field_of_study: fd.get('field') as string,
              status: fd.get('status') as any,
              start_date: fd.get('start') as string,
              end_date: (fd.get('end') as string) || undefined,
              description: fd.get('desc') as string,
            };
            setProfile({ ...profile, education: [newItem, ...profile.education] });
            setActiveModal(null);
          }}>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Institution</label>
              <input name="inst" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold" placeholder="University Name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Degree</label>
                <input name="deg" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold" placeholder="e.g. Bachelor" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Field</label>
                <input name="field" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold" placeholder="e.g. IT" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Start Date</label>
                <input name="start" type="month" required className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Status</label>
                <select name="status" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm focus:outline-none focus:border-black font-bold">
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">Save Education</button>
          </form>
        </ModalOverlay>
      )}

      <div className="max-w-6xl mx-auto pt-10 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6 shadow-sm">
              <div className="h-48 bg-black relative">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              </div>
              <div className="px-8 pb-8 relative pt-20">
                <div className="absolute -top-16 left-8">
                  <div className="w-36 h-36 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="mt-4">
                   <div className="flex justify-between items-start">
                     <div>
                       <h1 className="text-2xl font-black text-black tracking-tight mb-1">{profile.first_name} {profile.last_name}</h1>
                       <p className="text-sm text-gray-600 font-bold mb-4">{profile.current_pos_type} {profile.department} at {profile.office}</p>
                       <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                         <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /><span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{profile.email}</span></div>
                         <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /><span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{profile.office}</span></div>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button onClick={handleSync} disabled={isSyncing} className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                         <Sparkles className="w-3.5 h-3.5" /> {isSyncing ? 'Syncing...' : 'Sync AI Bio'}
                       </button>
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <SectionCard title="Experience" actionIcon={Plus} onAction={() => setActiveModal('exp')}>
              <div className="space-y-8">
                {profile.professional.map((exp, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-12 h-12 rounded bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-inner"><Building2 className="w-6 h-6 text-gray-300" /></div>
                    <div className="border-b border-gray-50 pb-6 last:border-none w-full relative">
                      <button 
                        onClick={() => setProfile({...profile, professional: profile.professional.filter((_, i) => i !== idx)})}
                        className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <h4 className="text-sm font-black text-black tracking-tight">{exp.title}</h4>
                      <p className="text-xs text-black font-bold uppercase tracking-wider">{exp.organization}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{exp.start_date} - {exp.end_date || 'Present'}</p>
                      <p className="text-xs text-gray-600 mt-3 leading-relaxed font-medium italic">"{exp.responsibilities}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Education" actionIcon={Plus} onAction={() => setActiveModal('edu')}>
              <div className="space-y-8">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="w-12 h-12 rounded bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-inner"><GraduationCap className="w-6 h-6 text-gray-300" /></div>
                    <div className="border-b border-gray-50 pb-6 last:border-none w-full relative">
                      <button 
                        onClick={() => setProfile({...profile, education: profile.education.filter((_, i) => i !== idx)})}
                        className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <h4 className="text-sm font-black text-black tracking-tight">{edu.institution_name}</h4>
                      <p className="text-xs text-black font-bold uppercase tracking-wider">{edu.degree} in {edu.field_of_study}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{edu.start_date} - {edu.end_date || 'Present'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Skills</h3>
                <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black" onClick={() => setActiveModal('skill')} />
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, idx) => (
                  <span key={idx} className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[10px] font-black text-gray-600 uppercase tracking-widest group relative">
                    {s.skill_name}
                    <button onClick={() => setProfile({...profile, skills: profile.skills.filter((_, i) => i !== idx)})} className="absolute -top-1 -right-1 bg-white border border-gray-200 rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm"><X className="w-2.5 h-2.5 text-gray-400" /></button>
                  </span>
                ))}
              </div>
              <button onClick={() => setActiveModal('skill')} className="w-full mt-8 py-2.5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-black hover:bg-gray-50 rounded-lg transition-all border border-dashed border-gray-200">Expand Inventory</button>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-black uppercase tracking-widest">Languages</h3>
                <Plus className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black" onClick={() => setActiveModal('lang')} />
              </div>
              <div className="space-y-4">
                {profile.languages.map((l, idx) => (
                  <div key={idx} className="flex flex-col border-b border-gray-50 last:border-none pb-4 last:pb-0 group relative">
                    <span className="text-xs font-black text-black uppercase tracking-widest">{l.language_name}</span>
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">{l.level} competence</span>
                    <button onClick={() => setProfile({...profile, languages: profile.languages.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-500" /></button>
                  </div>
                ))}
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
