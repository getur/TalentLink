
import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Department, PositionType, Duration, Office } from '../types';

interface SidebarProps {
  filters: {
    departments: Department[];
    positionTypes: PositionType[];
    durations: Duration[];
    office: string;
  };
  onFilterToggle: (category: string, value: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterToggle }) => {
  const departments: Department[] = ['OGV', 'oGTa', 'oGTe', 'iGV', 'iGTa', 'iGTe', 'MKT', 'F&L', 'MXP', 'BD'];
  const positionTypes: PositionType[] = ['OC', 'EST/NST', 'LCVP', 'LCP', 'MCVP', 'MCP'];
  const durations: Duration[] = ['Short', 'Medium', 'Long'];
  const offices: Office[] = ['MC', 'LC ISCTEM', 'LC Beira', 'LC GAZA', 'LC UEM'];

  return (
    <aside className="w-64 flex-shrink-0 pr-8 overflow-y-auto custom-scrollbar h-[calc(100vh-120px)] sticky top-24">
      <div className="mb-10">
        <div className="bg-black text-white rounded-xl p-6 relative overflow-hidden h-44 flex flex-col justify-between">
           <div className="relative z-10">
             <h3 className="text-base font-bold leading-tight uppercase tracking-tight">Lead the network</h3>
             <p className="text-[8px] font-bold text-gray-400 uppercase mt-2">Discover MC & EST roles</p>
           </div>
           <button className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg w-full relative z-10 hover:bg-gray-100 transition-colors">
             View National Roles
           </button>
        </div>
      </div>

      <div className="space-y-10 pb-10">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-extrabold text-black uppercase tracking-widest">Global Filters</h4>
          </div>
          
          <div className="space-y-8">
            {/* Department Filter */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Functional Area</p>
              <div className="space-y-3">
                {departments.map((dept) => {
                  const isChecked = filters.departments.includes(dept);
                  return (
                    <label key={dept} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => onFilterToggle('department', dept)}
                        className={`w-3.5 h-3.5 rounded border transition-colors ${isChecked ? 'bg-black border-black flex items-center justify-center' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-[10px] uppercase ${isChecked ? 'font-bold text-black' : 'font-bold text-gray-400 tracking-wider'}`}>{dept}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Position Type / Experience Level */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Position Type</p>
              <div className="space-y-3">
                {positionTypes.map((pos) => {
                  const isChecked = filters.positionTypes.includes(pos);
                  return (
                    <label key={pos} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => onFilterToggle('positionType', pos)}
                        className={`w-3.5 h-3.5 rounded border transition-colors ${isChecked ? 'bg-black border-black flex items-center justify-center' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-[10px] uppercase ${isChecked ? 'font-bold text-black' : 'font-bold text-gray-400 tracking-wider'}`}>{pos}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Duration / Job Type */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Term Duration</p>
              <div className="space-y-3">
                {durations.map((dur) => {
                  const isChecked = filters.durations.includes(dur);
                  return (
                    <label key={dur} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => onFilterToggle('duration', dur)}
                        className={`w-3.5 h-3.5 rounded border transition-colors ${isChecked ? 'bg-black border-black flex items-center justify-center' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-[10px] uppercase ${isChecked ? 'font-bold text-black' : 'font-bold text-gray-400 tracking-wider'}`}>{dur}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Office Filter */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Office Quick Select</p>
              <div className="space-y-3">
                {offices.map((off) => {
                  const isChecked = filters.office === off;
                  return (
                    <label key={off} className="flex items-center gap-3 cursor-pointer group">
                      <div 
                        onClick={() => onFilterToggle('office', off)}
                        className={`w-3.5 h-3.5 rounded border transition-colors ${isChecked ? 'bg-black border-black flex items-center justify-center' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-[10px] uppercase ${isChecked ? 'font-bold text-black' : 'font-bold text-gray-400 tracking-wider'}`}>{off}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
