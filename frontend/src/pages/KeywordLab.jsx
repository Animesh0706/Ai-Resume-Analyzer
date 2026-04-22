import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { getResumeById } from '../services/api';

const KeywordLab = () => {
  const { id } = useParams();
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
    } catch(err) {
      setData({
        keywordMetrics: {
          optimizationDensity: 68,
          hardSkillsFocus: 42,
          identifiedKeywords: [
            { term: 'React', relevance: 98 },
            { term: 'System Architecture', relevance: 92 },
            { term: 'Agile', relevance: 75 }
          ],
          criticalOmissions: [
            'GraphQL Integration',
            'CI/CD Pipelines'
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-serif italic text-textSecondary">Consulting the archives...</div>;
  if (!data) return <div className="text-center p-10 font-serif italic text-[#ff6b6b]">No data available.</div>;

  const metrics = data.analysis?.keywordMetrics || data.keywordMetrics || {
    optimizationDensity: 0,
    hardSkillsFocus: [],
    identifiedKeywords: [],
    criticalOmissions: []
  };

  const topSkillFocus = metrics.hardSkillsFocus?.slice(0, 2) || [];

  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-10 animate-fade-in">
      <div className="flex gap-2">
        <span className="small-caps text-textSecondary">ANALYSIS COMPONENT</span>
        <span className="small-caps font-mono text-white/50">M-04<hr className="inline-block w-10 h-px bg-textSecondary border-none align-middle ml-3"/></span>
      </div>

      <div>
        <h1 className="font-serif font-bold text-[56px] leading-[1.1] mb-4">Keyword <span className="italic text-primaryAccent">Lab.</span></h1>
        <p className="text-textSecondary text-lg leading-relaxed max-w-[600px]">Algorithms parse terms contextually, not just by count. Here is your semantic footprint.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <div className="glass-panel p-10 flex flex-col">
           <div className="small-caps text-primaryAccent">Overall Optimization Density</div>
           <div className="text-[100px] font-serif font-bold leading-none my-5">{metrics.optimizationDensity}<span className="text-5xl text-textSecondary border-0 border-transparent">%</span></div>
           
           <div className="flex justify-between items-end mt-auto">
             <div className="text-[13px] text-textSecondary max-w-[250px] leading-relaxed">
               Your resume aligns moderately with target JD vocabularies, but lacks long-tail semantic groupings.
             </div>
             <div className="font-mono text-2xl text-primaryAccent tracking-widest">||| || |</div>
           </div>
        </div>

        <div className="glass-panel p-8 flex flex-col items-center justify-center">
            <div className="small-caps text-textSecondary mb-6">Hard Skills Focus</div>
            <div className="text-5xl font-serif font-bold mb-8">
              {topSkillFocus[0]?.density || 0} <span className="text-xl text-textSecondary font-sans font-normal">pts</span>
            </div>
            
            <div className="w-full flex flex-col gap-5">
              {topSkillFocus.map((skill) => (
                <div key={skill.category} className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-textSecondary">
                    <span>{skill.category}</span>
                    <span>{skill.density}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-primaryAccent rounded-sm"
                      style={{ width: `${skill.density}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {topSkillFocus.length === 0 && (
                <p className="text-[13px] text-textSecondary italic">No hard-skill focus data available.</p>
              )}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="glass-panel p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-primaryAccent" size={24} />
              <h3 className="font-serif font-bold text-[24px]">Identified Assets</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
               {metrics.identifiedKeywords.map((kw, i) => (
                 <div key={i} className="px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 bg-black/40 shadow-sm border border-white/5">
                   {kw.keyword}
                   <span className="text-primaryAccent text-[11px] font-bold">{kw.density}%</span>
                 </div>
               ))}
               {metrics.identifiedKeywords.length === 0 && <p className="text-[13px] text-textSecondary italic">No strong assets identified.</p>}
            </div>
         </div>

         <div className="glass-panel p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-[#ff6b6b]" size={24} />
              <h3 className="font-serif font-bold text-[24px]">Critical Omissions</h3>
            </div>
            
            <div className="flex flex-col gap-3">
               {metrics.criticalOmissions.map((om, i) => (
                 <div key={i} className="p-4 rounded-lg bg-black/40 border-l-2 border-[#ff6b6b] flex justify-between items-center shadow-sm">
                   <div className="text-[15px] font-semibold text-white/90">{om.keyword}</div>
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-light text-textSecondary text-lg cursor-pointer hover:bg-white/10 hover:text-white transition-colors">+</div>
                 </div>
               ))}
               {metrics.criticalOmissions.length === 0 && <p className="text-[13px] text-textSecondary italic">No critical omissions found.</p>}
            </div>
         </div>
      </div>

    </div>
  );
};

export default KeywordLab;
