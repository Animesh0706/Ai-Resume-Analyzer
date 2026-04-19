import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Zap, Target, ArrowRight, Send } from 'lucide-react';
import { getResumeById } from '../services/api';

const ImprovementEditor = () => {
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
        resumeText: "Julian Sterling\nSenior Product Architect\n\nLead Experience Designer (2021 - Present)\nNovaStream Technologies\n\nDirected the complete visual overhaul of the flagship streaming platform, resulting in a 40% increase in user session duration.\n\nCollaborated with cross-functional engineering teams to implement a robust design system...",
        analysis: {
          suggestions: [
             { title: "ACTION VERB UPGRADE", description: "Try 'Orchestrated' or 'Spearheaded' to emphasize leadership and strategic vision instead of 'Directed'." },
             { title: "QUANTIFIABLE IMPACT", description: "Alexandria suggests linking the 15% uptick to a specific dollar amount or market share growth for stronger executive appeal." }
          ],
          scoreBreakdown: { impact: 12, professionalism: 14 }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-10 font-serif text-textSecondary italic">Loading Studio...</div>;
  if (!data) return <div className="text-center p-10 font-serif text-[#ff6b6b] italic">No data available.</div>;

  const textLines = (data.resumeText || "").split('\n');
  const suggestions = data.analysis?.suggestions || [];

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-8 animate-fade-in">
      <div className="max-w-[600px] mb-4">
        <span className="small-caps text-textSecondary">REFINING EXCELLENCE</span>
        <h1 className="font-serif font-bold text-[56px] leading-[1.1] mb-4">
          The Improvement<br/><span className="italic text-primaryAccent">Studio.</span>
        </h1>
        <p className="text-textSecondary text-lg leading-relaxed">
          Alexandria has analyzed your career narrative. Below are surgical enhancements to elevate your impact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="p-8 bg-[rgba(20,20,20,0.7)] relative min-h-[500px] rounded-2xl glass-panel-dark">
           <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/5">
              <div>
                <h2 className="font-serif font-bold text-[28px] mb-2">{textLines[0] || 'Unknown Candidate'}</h2>
                <p className="text-primaryAccent">{textLines[1] || ''}</p>
              </div>
              <BookOpen size={48} className="opacity-20 text-white" />
           </div>

           <div className="flex flex-col gap-2">
             {textLines.map((line, idx) => {
               if(line.includes("Directed the complete visual")) {
                 return (
                   <p key={idx} className="bg-primaryAccent/10 px-4 py-3 border-l-4 border-primaryAccent rounded-r-lg !text-white flex items-center justify-between mt-2 mb-2">
                     {line} <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primaryAccent/30 text-sm font-bold">+</span>
                   </p>
                 );
               }
               return <p key={idx} className={`text-[15px] leading-[1.8] text-[#ccc] ${line.trim() === "" ? "h-2.5 mb-2" : "mb-2"}`}>{line}</p>;
             })}
           </div>

           <div className="absolute bottom-8 left-8 right-8 flex items-center gap-3 py-3 px-4 bg-[rgba(30,30,30,0.9)] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-full backdrop-blur-md">
             <div className="w-7 h-7 rounded-full bg-primaryAccent text-[#052e70] flex items-center justify-center text-xs font-bold">AI</div>
             <input type="text" placeholder="Ask Alexandria to refine a section..." className="flex-1 bg-transparent border-none text-white outline-none text-sm px-2" />
             <button className="bg-primaryAccent/10 text-primaryAccent border-none w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-primaryAccent/20"><Send size={18}/></button>
           </div>
        </div>

        <div className="flex flex-col gap-4">
           {suggestions.map((sug, idx) => (
             <div key={idx} className="glass-panel p-6 border-l-2" style={{ borderLeftColor: idx % 2 === 0 ? 'var(--primary-accent)' : '#ffd166', background: idx % 2 === 0 ? 'rgba(36,36,36,0.7)' : 'linear-gradient(135deg, rgba(36,36,36,0.9), rgba(50, 40, 20, 0.4))' }}>
                <div className="small-caps flex items-center gap-2 mb-4" style={{color: idx % 2 === 0 ? 'var(--primary-accent)' : '#ffd166'}}>
                   {idx % 2 === 0 ? <Zap size={14}/> : <Target size={14} color="#ffd166"/>}
                   {sug.title}
                </div>
                <p className="text-[15px] mb-3 leading-relaxed">
                  {idx === 0 ? <i>"Directed the complete visual overhaul..."</i> : <strong>Subscription Renewal Metric</strong>}
                </p>
                <div className="text-[13px] text-textSecondary leading-relaxed bg-black/30 p-3 rounded-md mb-4">
                  {sug.description}
                </div>
                {idx === 0 && (
                  <button className="bg-transparent border-none text-primaryAccent text-[11px] font-bold tracking-[1px] cursor-pointer hover:underline uppercase inline-flex items-center gap-1 p-0">APPLY CHANGE &rarr;</button>
                )}
             </div>
           ))}

           <div className="flex gap-4">
              <div className="glass-panel flex-1 p-5 flex flex-col gap-2 rounded-2xl">
                 <div className="text-[32px] font-bold font-serif leading-none text-white">84<span className="text-sm border-0 border-transparent">%</span></div>
                 <div className="small-caps text-textSecondary">READABILITY SCORE</div>
              </div>
              <div className="glass-panel flex-1 p-5 flex flex-col gap-2 rounded-2xl">
                 <div className="text-[32px] font-bold font-serif leading-none text-primaryAccent">{data.analysis?.scoreBreakdown?.impact || 10}</div>
                 <div className="small-caps text-textSecondary">IMPACT KEYWORDS</div>
              </div>
           </div>

           <div className="glass-panel p-6 bg-black/30 border-none">
              <p className="font-serif italic text-sm leading-relaxed text-[#ccc]">
                "Notice how the hierarchy shifts focus toward your recent tenure. This is where your narrative carries the most weight for tier-one roles."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovementEditor;
