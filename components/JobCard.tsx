
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, MapPin, Clock } from 'lucide-react';
import { Opportunity } from '../types';

interface JobCardProps {
  job: Opportunity;
  viewMode?: 'grid' | 'list';
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, viewMode = 'grid', isSaved = false, onToggleSave }) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('a')) {
      navigate(`/job/${job.id}`);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) onToggleSave(job.id);
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group py-4 px-5 bg-white border border-gray-100 rounded-xl hover:border-black transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
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
        
        <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 w-full sm:w-auto border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-bold text-black uppercase tracking-widest">{job.pos_type}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{job.duration} Duration</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSaveClick} 
              className={`p-2 transition-colors ${isSaved ? 'text-black' : 'text-gray-300 hover:text-black'}`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
            </button>
            <Link 
              to={`/job/${job.id}`}
              className="bg-black text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="p-6 rounded-xl border border-gray-100 bg-white flex flex-col justify-between h-[320px] transition-all hover:border-black cursor-pointer group"
    >
      <div className="flex justify-between items-start">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
          {job.post_date}
        </div>
        <button 
          onClick={handleSaveClick}
          className={`p-2 transition-colors ${isSaved ? 'text-black' : 'text-gray-400 hover:text-black'}`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
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
        <div className="min-w-0 pr-2">
          <p className="text-base font-bold text-gray-900 truncate">{job.pos_type}</p>
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
