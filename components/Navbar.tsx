
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, Settings, Check, X, FileText, User, Bookmark, 
  SlidersHorizontal, LogOut, ChevronDown 
} from 'lucide-react';
import { UserType } from '../types';

interface NavbarProps {
  role: UserType;
  onLogout?: () => void;
}

interface Notification {
  id: string;
  user: {
    name: string;
    avatar: string;
    statusColor: string;
  };
  content: React.ReactNode;
  time: string;
  category: string;
  type: 'action' | 'info' | 'file';
  fileInfo?: { name: string; size: string };
  unread: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ role, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications: Notification[] = [
    {
      id: '1',
      user: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', statusColor: 'bg-green-500' },
      content: <>updated your status to <span className="font-bold">Interviewing</span> for VP OGV</>,
      time: '1h ago',
      category: 'LC ISCTEM • OGV',
      type: 'info',
      unread: true
    },
    {
      id: '2',
      user: { name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', statusColor: 'bg-blue-500' },
      content: <>posted a new national role: <span className="font-bold">Digital Expansion Lead</span></>,
      time: '3h ago',
      category: 'MC • MKT',
      type: 'info',
      unread: true
    },
    {
      id: '3',
      user: { name: 'Admin MC', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', statusColor: 'bg-red-500' },
      content: <>is requesting verification of your <span className="font-bold">Member ID Card</span></>,
      time: '5h ago',
      category: 'Entity Audit',
      type: 'action',
      unread: false
    },
    {
      id: '4',
      user: { name: 'TalentLink AI', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AI', statusColor: 'bg-orange-500' },
      content: <>generated your <span className="font-bold">Internal Talent Report</span></>,
      time: '1d ago',
      category: 'Career Insights',
      type: 'file',
      fileInfo: { name: 'talent_analysis_2024.pdf', size: '1.4mb' },
      unread: false
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profileOptions = [
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Saves', icon: Bookmark, path: '/dashboard?filter=saves' },
    { label: 'Preferences', icon: SlidersHorizontal, path: '#' },
    { label: 'Settings', icon: Settings, path: '#' },
    { label: 'Log out', icon: LogOut, path: '/login', color: 'text-red-500', isLogout: true },
  ];

  const handleOptionClick = (option: any) => {
    setIsProfileOpen(false);
    if (option.isLogout && onLogout) {
      onLogout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4 sm:gap-10">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black shrink-0">T</div>
          <span className="text-black hidden sm:inline">TalentLink</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
          <Link to="/" className={`${location.pathname === '/' ? 'text-black' : 'text-gray-400 hover:text-black transition-colors'}`}>
            Discover
          </Link>
          <Link to="/dashboard" className={`${location.pathname.startsWith('/dashboard') ? 'text-black' : 'text-gray-400 hover:text-black transition-colors'}`}>
            {role === 'Manager' ? 'Manager Hub' : 'My Career'}
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <div 
              className="relative cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors group"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
            >
              <Bell className={`w-5 h-5 transition-colors ${isNotificationsOpen ? 'text-black' : 'text-gray-400 group-hover:text-black'}`} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 border-2 border-white rounded-full"></span>
            </div>

            {isNotificationsOpen && (
              <div className="absolute top-12 right-0 w-[calc(100vw-32px)] sm:w-[380px] bg-white border border-gray-100 rounded-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50">
                  <h3 className="text-sm font-black text-black tracking-tight">Activity Feed</h3>
                  <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors underline decoration-gray-200 underline-offset-4">
                    Clear all
                  </button>
                </div>

                <div className="px-6 pt-4 flex items-center justify-between border-b border-gray-50 overflow-x-auto no-scrollbar">
                  <div className="flex gap-6">
                    {['All', 'Direct', 'Archive'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-[11px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-1.5 whitespace-nowrap ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                      >
                        {tab}
                        <span className={`px-1.5 py-0.5 rounded bg-gray-100 text-[9px] font-black ${activeTab === tab ? 'bg-black text-white' : 'text-gray-400'}`}>
                          {tab === 'All' ? '4' : tab === 'Direct' ? '2' : '0'}
                        </span>
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-6 py-5 border-b border-gray-50 last:border-none transition-colors hover:bg-gray-50/50 relative ${notif.unread ? 'bg-orange-50/10' : ''}`}
                    >
                      <div className="flex gap-4">
                        <div className="relative shrink-0">
                          <img src={notif.user.avatar} className="w-10 h-10 rounded-full border border-gray-100 bg-gray-50" alt="" />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${notif.user.statusColor}`} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[12px] text-gray-600 leading-snug">
                            <span className="font-bold text-black">{notif.user.name}</span> {notif.content}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{notif.time}</span>
                            <span className="text-[9px] text-gray-300">•</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{notif.category}</span>
                          </div>
                        </div>
                      </div>
                      {notif.unread && <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50/50 p-4 text-center">
                   <button className="text-[10px] font-black text-black uppercase tracking-widest hover:underline underline-offset-4 transition-all">
                     View Application History
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden ring-1 ring-gray-100 group-hover:ring-black transition-all">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Profile" />
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-black' : 'group-hover:text-black'}`} />
            </div>

            {isProfileOpen && (
              <div className="absolute top-12 right-0 w-56 bg-white border border-gray-100 rounded-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                  <p className="text-xs font-bold text-black truncate">alex.rivera@aiesec.net</p>
                </div>
                <div className="py-2">
                  {profileOptions.map((option, idx) => {
                    const Icon = option.icon;
                    return (
                      <Link 
                        key={idx}
                        to={option.path}
                        onClick={() => handleOptionClick(option)}
                        className={`flex items-center gap-3 px-6 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-gray-50 ${option.color || 'text-gray-500 hover:text-black'}`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {option.label}
                      </Link>
                    );
                  })}
                </div>
                <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/10">
                  <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] text-center">Version 2.4.0</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
