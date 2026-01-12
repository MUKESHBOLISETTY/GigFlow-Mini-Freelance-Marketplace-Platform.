import { Briefcase, Search, UserCircle } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1a2632]/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-6 pt-2 z-50">
            <div className="flex justify-around items-center max-w-xl mx-auto px-4">
                <NavItem icon={<Search size={24} />} label="Find Work" active />
                <NavItem icon={<Briefcase size={24} />} label="My Jobs" />
                <NavItem icon={<UserCircle size={24} />} label="Profile" />

            </div>
        </nav>
    )
}

const NavItem = ({ icon, label, active = false }) => (
    <a className={`flex flex-col items-center gap-1 ${active ? 'text-[#137fec]' : 'text-slate-400'}`} href="#">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </a>
);

export default Footer