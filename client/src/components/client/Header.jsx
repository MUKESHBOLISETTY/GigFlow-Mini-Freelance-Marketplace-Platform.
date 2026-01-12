import { Bell, Mail } from 'lucide-react'
import React from 'react'

const Header = () => {
    return (
        <header className="sticky top-0 z-50 bg-[#1a2632] border-bborder-slate-800">
            <div className="flex items-center p-4 justify-between mx-auto">
                <div className="flex items-center gap-3">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 border-2 border-[#137fec]/20"
                        style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")' }}
                    />
                    <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Find Work</h2>
                </div>
                <div className="flex items-center gap-1">
                    <button className="flex items-center justify-center rounded-full w-10 h-10 text-white hover:bg-slate-800">
                        <Bell size={20} />
                    </button>
                    <button className="flex items-center justify-center rounded-full w-10 h-10 text-white hover:bg-slate-800">
                        <Mail size={20} />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header