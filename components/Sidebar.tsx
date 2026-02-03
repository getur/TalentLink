
import React from 'react';
import { Check, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { Department, PositionType, Duration, Office } from '../types';

interface SidebarProps {
  filters: {
    departments: Department[];
    positionTypes: PositionType[];
    durations: Duration[];
    office: string;
  };
  onFilterToggle: (category: string, value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewChange: (value: 'grid' | 'list') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  filters, 
  onFilterToggle, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewChange 
}) => {
  const departments: Department[] = ['OGV', 'oGTa', 'oGTe', 'iGV', 'iGTa', 'iGTe', 'MKT', 'F&L', 'MXP', 'BD'];
  const positionTypes: PositionType[] = ['OC', 'EST/NST', 'LCVP', 'LCP', 'MCVP', 'MCP'];
  const durations: Duration[] = ['Short', 'Medium', 'Long'];
  const offices: Office[] = ['MC', 'LC ISCTEM', 'LC Beira', 'LC GAZA', 'LC UEM'];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Due Date', value: 'due_date' }
  ];

  return (
    <div className="space-y-10">
      {/* View Options Section */}
      <div id="view-section">
        <h4 className="text-[10px] font-extrabold text-black uppercase tracking-widest mb-6">Display Settings</h4>
        <div className="flex gap-2">
          <button 
            onClick={() => onViewChange('grid')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'grid' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Grid
          </button>
          <button 
            onClick={() => onViewChange('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
        </div>
      </div>

      {/* Sort Section */}
      <div id="sort-section">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Sort Opportunities</p>
        <div className="space-y-3">
          {sortOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <div 
                onClick={() => onSortChange(opt.value)}
                className={`w-3.5 h-3.5 rounded-full border transition-colors ${sortBy === opt.value ? 'bg-black border-black flex items-center justify-center' : 'bg-white border-gray-200 group-hover:border-gray-300'}`}
              >
                {sortBy === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className={`text-[10px] uppercase ${sortBy === opt.value ? 'font-bold text-black' : 'font-bold text-gray-400 tracking-wider'}`}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-10">
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

          {/* Position Type Filter */}
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

          {/* Office Filter */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Office</p>
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
  );
};

export default Sidebar;
