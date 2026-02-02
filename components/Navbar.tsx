
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { UserType } from '../types';

interface NavbarProps {
  role: UserType;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const location = useLocation();

  const ComingSoonBadge = () => (
    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100 text-[8px] font-extrabold uppercase tracking-tighter text-gray-400">Soon</span>
  );

  const NavContent = () => (
    <>
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight mr-4">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black">T</div>
          <span className="text-black">TalentLink</span>
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
          <Link to="/" className={`${location.pathname === '/' ? 'text-black' : 'text-gray-400 hover:text-black transition-colors'}`}>
            Discover
          </Link>
          <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'text-black' : 'text-gray-400 hover:text-black transition-colors'}`}>
            {role === 'Manager' ? 'Manager Hub' : 'My Career'}
          </Link>
          <div className="flex items-center text-gray-300 cursor-not-allowed select-none transition-opacity">
            Academy <ComingSoonBadge />
          </div>
          <div className="flex items-center text-gray-300 cursor-not-allowed select-none transition-opacity">
            Spaces <ComingSoonBadge />
          </div>
          <div className="flex items-center text-gray-300 cursor-not-allowed select-none transition-opacity">
            Contact <ComingSoonBadge />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-black transition-colors" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </div>
          <Link to="/profile">
            <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden cursor-pointer ring-1 ring-gray-100 hover:ring-black transition-all">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} alt="Profile" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <NavContent />
    </nav>
  );
};

export default Navbar;
