import React from 'react';
import {
  ArrowLeft,
  Share2,
  Verified,
  MapPin,
  Award,
  Pencil,
  Star,
  Heart,
  Mail
} from 'lucide-react';
import Header from './Header';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { loading, is_logged_in, user, error, email, navigation } = useSelector((state) => state.auth);

  const skills = [
    "React.js", "Node.js", "TypeScript", "AWS Architecture",
    "Tailwind CSS", "PostgreSQL", "GraphQL", "UI/UX Design"
  ];

  const workHistory = [
    {
      title: "Enterprise SaaS Dashboard Redesign",
      price: "$4,500",
      review: "Alex is a top-tier developer. He understood our requirements immediately and delivered high-quality code. Communication was excellent throughout the project.",
      date: "Dec 15, 2023 - Jan 22, 2024"
    },
    {
      title: "E-commerce API Integration",
      price: "$1,200",
      review: "Very efficient and professional. Fixed our critical bugs in record time. Highly recommended for any Node.js work.",
      date: "Oct 2, 2023 - Oct 10, 2023"
    }
  ];

  return (
    <div className="bg-[#f6f7f8] font-sans text-[#0d141b] min-h-screen">
      <Header />
      {loading || !user && (
        <div className="py-4 text-center text-sm text-slate-500">
          Loading...
        </div>
      )}
      {user && (
        <div className="relative flex h-auto min-h-screen w-full flex-col mx-auto bg-white shadow-xl overflow-x-hidden">
          <div className="flex p-6">
            <div className="flex w-full flex-col gap-4 items-center text-center">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-white shadow-lg"
                  style={{ backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Rivera")' }}
                />
                <div className="absolute bottom-1 right-1 bg-[#137fec] text-white p-1 rounded-full border-2 border-white flex items-center justify-center">
                  <Verified size={16} fill="currentColor" className="text-white" />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <p className="text-[#0d141b] text-2xl font-bold leading-tight tracking-tight">{user.username}</p>
                <p className="text-[#137fec] text-base font-semibold">{user.type}</p>
                <div className="flex items-center gap-1 mt-1 text-slate-500">
                  <Mail size={16} />
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[#0d141b] text-lg font-bold">Bio</h3>
              <button className="text-[#137fec] p-1 hover:bg-blue-50 rounded-md transition-colors">
                <Pencil size={18} />
              </button>
            </div>
            <p className="text-slate-600 text-base leading-relaxed">
              {user.additionalDetails?.bio ? user.additionalDetails?.bio : 'No Bio Found'}
            </p>
          </div>
          {user.type == "Freelancer" && (
            <div className="px-6 py-4">
              <h3 className="text-[#0d141b] text-lg font-bold mb-4">Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.additionalDetails?.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-50 text-[#137fec] rounded-lg text-sm font-semibold border border-blue-100/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {user.type == "Freelancer" && (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#0d141b] text-lg font-bold">Work History</h3>
              </div>

              {user.portfolio.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl border border-slate-100 bg-white mb-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[#0d141b] font-bold leading-tight flex-1 mr-2">{item.title}</h4>
                    <span className="text-[#137fec] font-bold text-sm">{item.projectRef.contractAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;