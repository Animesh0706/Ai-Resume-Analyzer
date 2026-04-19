import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, Beaker, Wrench } from 'lucide-react';

const Sidebar = ({ id }) => {
  const location = useLocation();

  const links = [
    { name: 'Overview', path: id ? `/dashboard` : `/dashboard`, icon: <LayoutDashboard size={20} /> },
    { name: 'Insights', path: id ? `/insights/${id}` : '#', icon: <Target size={20} /> },
    { name: 'Keyword Lab', path: id ? `/keyword-lab/${id}` : '#', icon: <Beaker size={20} /> },
    { name: 'Improvement', path: id ? `/improvement/${id}` : '#', icon: <Wrench size={20} /> },
  ];

  return (
    <aside className="w-[260px] bg-bgPrimary border-r border-borderColor flex flex-col py-8 gap-8 h-screen sticky top-0">
      <div className="px-6">
        <h2 className="text-[20px] tracking-[-0.5px] font-serif font-bold">Resume Curator</h2>
      </div>

      <div className="flex items-center gap-4 px-6 py-4 border-y border-white/5">
        <div className="avatar">
          <img className="w-10 h-10 rounded-lg object-cover" src="https://ui-avatars.com/api/?name=TC&background=0D8ABC&color=fff" alt="User" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-sm text-primaryAccent">The Curator</span>
          <span className="text-[10px] text-textSecondary tracking-wide">PREMIUM ANALYSIS</span>
        </div>
      </div>

      <nav className="w-full">
        <ul className="flex flex-col gap-2 px-4">
          {links.map((link) => {
            const isDisabled = link.path === '#';
            const isActive = location.pathname === link.path;
            
            const activeClasses = isActive 
                ? 'bg-primaryAccent/10 text-primaryAccent relative before:content-[""] before:absolute before:left-[-16px] before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primaryAccent before:rounded-r-sm'
                : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary';
            
            const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-textSecondary' : '';

            return (
              <li key={link.name}>
                <NavLink 
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${activeClasses} ${disabledClasses}`}
                  onClick={(e) => isDisabled && e.preventDefault()}
                >
                  <span className="flex items-center justify-center">{link.icon}</span>
                  {link.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
