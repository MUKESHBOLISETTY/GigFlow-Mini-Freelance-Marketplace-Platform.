import React, { useEffect, useRef, useState } from "react";
import { Bell, Mail, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";

const Header = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { handleLogout } = useAuth()
    const { loading, is_logged_in, user, error, email, navigation } = useSelector((state) => state.auth);
    const signOut = async () => {
        setOpen(false);
        await handleLogout(navigate)
    };

    useEffect(() => {
        const onDown = (e) => {
            if (!open) return;
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    const NavLinks = ({ mobile = false }) => (
        <nav className={mobile ? "flex flex-col gap-1" : "hidden md:flex items-center gap-2"}>
            {is_logged_in && user?.type == "Client" && (
                <Link
                    to="/client/projects"
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-slate-800 ${mobile ? "w-full" : ""
                        }`}
                    onClick={() => setOpen(false)}
                >
                    Projects
                </Link>
            )}
            {user?.type === "Freelancer" && (
                <Link
                    to="/freelancer/find-work"
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-slate-800 ${mobile ? "w-full" : ""
                        }`}
                    onClick={() => setOpen(false)}
                >
                    Find Projects
                </Link>
            )}

            {is_logged_in && user && (
                <Link
                    to={
                        user?.type === "Client"
                            ? "/client/profile"
                            : user?.type === "Freelancer"
                                ? "/freelancer/profile"
                                : "/profile"
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-slate-800 ${mobile ? "w-full" : ""
                        }`}
                    onClick={() => setOpen(false)}
                >
                    Profile
                </Link>
            )}

            {is_logged_in ? (
                <button
                    type="button"
                    onClick={signOut}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-slate-800 text-left ${mobile ? "w-full" : ""
                        }`}
                >
                    Logout
                </button>
            ) : (
                <>
                    <Link
                        to="/login"
                        className={`px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-slate-800 ${mobile ? "w-full" : ""
                            }`}
                        onClick={() => setOpen(false)}
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className={`px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-600 bg-blue-500 ${mobile ? "w-full text-center" : ""
                            }`}
                        onClick={() => setOpen(false)}
                    >
                        Sign Up
                    </Link>
                </>
            )}
        </nav>
    );

    return (
        <header className="sticky top-0 z-50 bg-[#1a2632] border-b border-slate-800">
            <div className="flex items-center p-4 justify-between mx-auto">
                <div className="flex items-center gap-3">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 border-2 border-[#137fec]/20"
                        style={{
                            backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")',
                        }}
                    />
                    <h2 className="text-white text-lg font-bold leading-tight tracking-tight">
                        GigFlow
                    </h2>
                </div>

                <div className="ml-auto">
                    <NavLinks />
                </div>

                <div className="flex items-center gap-1 relative" ref={menuRef}>

                    <button
                        type="button"
                        className="md:hidden flex items-center justify-center rounded-full w-10 h-10 text-white hover:bg-slate-800"
                        onClick={() => setOpen((s) => !s)}
                        aria-expanded={open}
                        aria-label="Open menu"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {open && (
                        <div className="md:hidden absolute right-0 top-12 w-56 rounded-xl border border-slate-700 bg-[#13202b] shadow-xl overflow-hidden">
                            <div className="p-2">
                                <NavLinks mobile />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
