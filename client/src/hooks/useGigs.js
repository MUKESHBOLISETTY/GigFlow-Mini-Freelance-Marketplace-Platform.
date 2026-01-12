import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gigsApi } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { setJobsLoading, setJobs, appendJobs, resetJobs, setPage, setHasMore, setSelectedProject } from '../redux/slices/jobsSlice';

export const useGigs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { jobs_loading, jobs, page, hasMore } = useSelector((state) => state.jobs);
    const fetchGigs = async (data) => {
        try {
            dispatch(setJobsLoading(true));
            const response = await gigsApi.getProjects(data);
            dispatch(setHasMore(response.data.hasMore));
            if (Number(data.page) > 1) {
                dispatch(appendJobs(response.data.projects));
            } else {
                dispatch(setJobs(response.data.projects));
            }
            dispatch(setJobsLoading(false));
            return response;
        } catch (error) {
            dispatch(setJobsLoading(false));
            throw error;
        }
    };

    const fetchGigById = async (data) => {
        try {
            dispatch(setJobsLoading(true));
            const response = await gigsApi.getProjectById(data);
            if (response.data.message === "project_found") {
                dispatch(setSelectedProject(response.data.data))
            }
            dispatch(setJobsLoading(false));
            return response;
        } catch (error) {
            dispatch(setJobsLoading(false));
            throw error;
        }
    };

    const createGig = async (data) => {
        try {
            dispatch(setJobsLoading(true));
            const response = await gigsApi.createGig(data);
            if (response.data.message === "project_posted") {
                toast.success("Project Added Successfully")
            }
            dispatch(setJobsLoading(false));
            return response;
        } catch (error) {
            dispatch(setJobsLoading(false));
            throw error;
        }
    };

    return {
        fetchGigs,
        fetchGigById,
        createGig
    };
};

export default useGigs; 