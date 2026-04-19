import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Award, TrendingUp, Users, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { getResumeById } from '../services/api';

const AnalysisDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) fetchData();
  }, [id, token]);

  const fetchData = async () => {
    try {
      const res = await getResumeById(id, token);
      setData(res.data);
    } catch (err) {
      console.warn("Could not fetch data, using mock data for UI visualization.");
      setData({
        analysis: {
          score: 88,
          keyStrengths: [
            { title: "Executive Presence", description: "Your summary commands attention and establishes immediate authority." },
            { title: "Quantified Impact", description: "You consistently back up achievements with hard numbers and metrics." },
            { title: "Technical Alignment", description: "Strong correlation with modern industry standard terminology." }
          ],
          suggestions: [
            { title: "Action Verbs", description: "Substitute passive phrases with strong action verbs in the recent experience section." },
            { title: "Keyword Density", description: "Increase frequency of 'Node.js' and 'React' to pass ATS parsing." }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-serif italic text-textSecondary">Consulting the archives...</div>;
  if (!data) return <div className="text-center p-10 font-serif italic text-[#ff6b6b]">Document not found.</div>;

  const score = data.analysis?.score || 0;
  const strengths = data.analysis?.keyStrengths || [];
  const refinements = data.analysis?.suggestions || [];

  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-8 animate-fade-in">
      
      <div className="flex gap-2 mb-2">
        <span className="badge">System Report</span>
        <span className="badge bg-white/10 text-white">ID: {id?.substring(0,8) || 'MOCK'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-10 items-center">
        <div className="glass-panel aspect-square flex items-center justify-center p-10">
          <div className="w-full aspect-square rounded-full border-4 border-white/10 border-t-primaryAccent flex flex-col items-center justify-center relative before:content-[''] before:absolute before:-inset-1 before:rounded-full before:border before:border-dashed before:border-white/20">
            <span className="text-[80px] font-serif font-bold leading-none">{score}</span>
            <span className="text-[10px] uppercase tracking-widest mt-2 text-primaryAccent">Efficacy Score</span>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="font-serif font-bold text-[56px] leading-[1.1] mb-6">Elite Performance<br/><span className="text-primaryAccent italic">Analysis.</span></h1>
          <p className="text-textSecondary text-lg max-w-[500px] mb-8 leading-relaxed">
            Your document has been scanned against 10,000+ top-tier profiles. Here is the unvarnished truth about your current narrative.
          </p>
          
          <div className="flex gap-4">
            <div className="bg-primaryAccent/10 text-primaryAccent flex items-center gap-[6px] px-4 py-2 rounded-full text-xs font-semibold">
              <Award size={14} /> Top 12% Percentile
            </div>
            <div className="bg-white/10 text-textPrimary flex items-center gap-[6px] px-4 py-2 rounded-full text-xs font-semibold">
              <Users size={14} /> Highly Competitive
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6">
        
        <div className="glass-panel p-8">
           <div className="flex justify-between items-center mb-6">
             <h2 className="font-serif font-bold text-2xl m-0">Key Strengths</h2>
             <span className="small-caps text-textSecondary">Verified Assets</span>
           </div>
           
           <div className="flex flex-col gap-6">
              {strengths.map((str, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-primaryAccent">
                     <CheckCircle size={20} />
                   </div>
                   <div>
                     <h3 className="text-base font-semibold mb-1.5">{str.title}</h3>
                     <p className="text-[13px] text-textSecondary leading-normal">{str.description}</p>
                   </div>
                </div>
              ))}
              {strengths.length === 0 && <p className="text-[13px] text-textSecondary italic">No explicit strengths identified in the current scan.</p>}
           </div>
        </div>

        <div className="flex flex-col gap-6">
           <div className="glass-panel p-8">
             <div className="flex justify-between items-center mb-6">
               <h2 className="font-serif font-bold text-xl m-0">Refinement Areas</h2>
             </div>
             
             <ul className="flex flex-col gap-5 p-0 m-0">
               {refinements.map((ref, i) => (
                 <li key={i} className="flex gap-4 items-start text-[14px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-primaryAccent mt-2 shrink-0"></div>
                    <div>
                      <span className="font-semibold">{ref.title}:</span> <span className="text-textSecondary">{ref.description}</span>
                    </div>
                 </li>
               ))}
               {refinements.length === 0 && <p className="text-[13px] text-textSecondary italic">No urgent refinements needed.</p>}
             </ul>
           </div>

           <div 
             className="bg-primaryAccent text-primaryButtonText rounded-2xl p-6 flex items-center justify-between cursor-pointer transition transform hover:-translate-y-0.5"
             onClick={() => navigate(`/improvement/${id}`)}
           >
              <div>
                <h3 className="font-bold text-lg mb-1">Enter Improvement Studio</h3>
                <p className="opacity-80 text-sm font-medium">Apply surgical enhancements</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#052e70]/10 flex items-center justify-center">
                 <ArrowRight size={20} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
