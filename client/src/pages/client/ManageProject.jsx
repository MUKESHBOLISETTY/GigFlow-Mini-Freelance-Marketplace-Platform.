import React, { useEffect, useState } from 'react';
import {
    Search,
    SlidersHorizontal,
    ChevronDown
} from 'lucide-react';
import Header from '../../components/reusable/Header';
import { useDispatch, useSelector } from 'react-redux';
import { setHasMore, setJobs, setPage } from '../../redux/slices/jobsSlice';
import JobCard from '../../components/reusable/JobCard';
import useGigs from '../../hooks/useGigs';
import CreateProjectModal from '../../components/client/CreateProjectModal';

const ManageProjects = () => {
    const dispatch = useDispatch()
    const { fetchGigs } = useGigs()
    const [openCreateProject, setOpenCreateProject] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { projects_loading, projects, page, hasMore } = useSelector((state) => state.projects);

    return (
        <div className="bg-slate-50 font-sans text-[#0d141b] min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 w-full mx-auto pb-24">
                <div className="px-4 py-3 bg-white">
                    <div className="flex h-12 w-full max-w-lg flex-1 items-stretch rounded-xl shadow-sm bg-[#f0f2f5]">
                        <div className="text-[#4c739a] flex items-center justify-center pl-4">
                            <Search size={20} />
                        </div>
                        <input
                            className="flex w-full min-w-0 flex-1 rounded-r-xl text-[#0d141b] focus:outline-none border-none bg-transparent h-full placeholder:text-[#4c739a] px-4 pl-2 text-base font-normal"
                            placeholder="Search for projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-2 p-4 overflow-x-auto bg-white scrollbar-hide">
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#137fec] text-white px-4 shadow-sm">
                        <span className="text-sm font-semibold">Filter</span>
                        <SlidersHorizontal size={16} />
                    </button>
                    <FilterButton label="Status" />
                </div>

                <div className="flex items-center justify-between px-4 pt-6 pb-2">
                    <h3 className="text-[#0d141b] text-lg font-bold leading-tight tracking-tight">
                        Projects
                    </h3>

                    <button
                        type="button"
                        onClick={() => setOpenCreateProject(true)}
                        className="flex items-center gap-2 rounded-xl bg-[#137fec] px-4 py-2 text-white text-sm font-bold shadow-sm hover:bg-blue-600 active:scale-95 transition-all"
                    >
                        Create Project
                    </button>
                </div>

                <div className="space-y-3 p-4">
                    {projects.map((job) => (
                        <JobCard key={job.id} job={job} bid={true} />
                    ))}

                    {projects_loading && (
                        <div className="py-4 text-center text-sm text-slate-500">
                            Loading more...
                        </div>
                    )}
                </div>
            </main>
            <CreateProjectModal isOpen={openCreateProject} onClose={() => setOpenCreateProject(false)}
            />
        </div>
    );
};

const FilterButton = ({ label }) => (
    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f5] px-4">
        <span className="text-[#0d141b] text-sm font-medium">{label}</span>
        <ChevronDown size={16} className="text-slate-400" />
    </button>
);

export default ManageProjects;