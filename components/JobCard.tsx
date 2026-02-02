
import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin } from 'lucide-react';
import { Opportunity } from '../types';

interface JobCardProps {
  job: Opportunity;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className={`p-6 rounded-xl border border-gray-100 bg-white flex flex-col justify-between h-[320px] transition-colors hover:border-gray-200`}>
      <div className="flex justify-between items-start">
        {/* Fixed: Changed postedDate to post_date */}
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
          {job.post_date}
        </div>
        <button className="p-2 text-gray-400 hover:text-black transition-colors">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex justify-between items-end">
        <div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">{job.department}</p>
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Fixed: Changed type to duration */}
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100">
              {job.duration}
            </span>
            {/* Fixed: Changed level to pos_type */}
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100">
              {job.pos_type}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-2">
          {/* Fixed: Changed company to office */}
          <img src={job.logo} alt={job.office} className="max-w-full max-h-full object-contain grayscale opacity-80" />
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center pt-6 border-t border-gray-100">
        <div>
          {/* Fixed: Changed salary to pos_type as there is no salary field in Opportunity */}
          <p className="text-base font-bold text-gray-900">{job.pos_type}</p>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
            <MapPin className="w-3 h-3" />
            {/* Fixed: Changed location to office */}
            {job.office}
          </div>
        </div>
        <Link 
          to={`/job/${job.id}`}
          className="bg-black text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
