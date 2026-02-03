
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, MapPin, Clock } from 'lucide-react';
import { Opportunity } from '../types';

interface JobCardProps {
  job: Opportunity;
  viewMode?: 'grid' | 'list';
}

const JobCard: React.FC<JobCardProps> = ({ job, viewMode = 'grid' }) => {
  const navigate = useNavigate();

  const calculateDaysLeft = (dueDate: string) => {
    const diffTime = new Date(dueDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Last day';
    return `${diffDays} days left`;
  };

  const daysLeft = calculateDaysLeft(job.due_date);

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => navigate(`/job/${job.id}`)}
        className="group py-3 px-5 bg-white border border-gray-100 rounded-xl hover:border-black transition-all cursor-pointer flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-2 shrink-0">
            <img src={job.logo} alt="" className="max-w-full max-h-full object-contain grayscale opacity-80" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-black truncate">{job.title}</h3>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${job.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {job.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">{job.department}</span>
              <span className="text-[9px] text-gray-300">•</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> {job.office}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-black uppercase tracking-widest">{job.pos_type}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{daysLeft}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); }} className="p-2 text-gray-300 hover:text-black transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl border border-gray-100 bg-white flex flex-col justify-between h-[320px] transition-colors hover:border-gray-200 group`}>
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
          {job.post_date}
        </div>
        <button onClick={(e) => { e.stopPropagation(); }} className="p-2 text-gray-400 hover:text-black transition-colors">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">{job.department}</p>
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3 truncate group-hover:text-black">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100">
              {job.duration}
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100">
              {job.pos_type}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-2 shrink-0">
          <img src={job.logo} alt={job.office} className="max-w-full max-h-full object-contain grayscale opacity-80" />
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center pt-6 border-t border-gray-100">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">{job.pos_type} Position</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
            <MapPin className="w-3 h-3" />
            {job.office}
          </div>
        </div>
        <Link 
          to={`/job/${job.id}`}
          className="bg-black text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
