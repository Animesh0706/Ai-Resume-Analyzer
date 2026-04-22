import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Upload, FileText, Download, MoreVertical, TrendingUp } from 'lucide-react';
import { uploadResume, getHistory } from '../services/api';

const LandingPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const res = await getHistory(token).catch(() => ({ data: [] }));
      if (res && res.data) {
         setHistory(res.data);
      }
    } catch (err) {
      console.warn("Could not fetch history");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert("We strictly support PDF files for analysis. Please upload a PDF.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const res = await uploadResume(file, token);
      const newResumeId = res.data.data._id;
      navigate(`/insights/${newResumeId}`);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const displayHistory = history.length > 0 ? history : [
    { _id: '1', fileName: 'Senior_UX_Designer_2024.pdf', analysis: { score: 92 }, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { _id: '2', fileName: 'Technical_Lead_Architect.pdf', analysis: { score: 74 }, createdAt: new Date(Date.now() - 86400000).toISOString() }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-fade-in">
      <div className="mb-4">
        <div className="badge inline-block mb-4">Alexandria Intelligence</div>
        <h1 className="font-serif text-[64px] font-bold leading-[1.1] mb-6">
          Refine your
          <span className="italic text-[#a8c7fa]"> professional </span>
           narrative.
        </h1>
        <p className="text-textSecondary text-lg max-w-2xl leading-relaxed">
          Move beyond simple text matching. Our neural engine dissects the semantic strength of your experience to align with elite roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">
        <div className="glass-panel p-8 flex flex-col gap-6">
          <h2 className="font-semibold text-lg uppercase tracking-wider m-0">Analyze New Document</h2>
          
          <div 
            className="border-2 border-dashed border-borderColor rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primaryAccent bg-black/20" 
            onClick={handleUploadClick}
          >
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               className="hidden" 
               accept="application/pdf"
             />
             <div className="w-14 h-14 rounded-full bg-primaryAccent/10 text-primaryAccent flex items-center justify-center mb-4"><Upload size={24} /></div>
             <p className="font-semibold text-base mb-1">Drop your resume here</p>
             <p className="text-textSecondary text-sm">PDF Only (Max 5MB)</p>
          </div>

          <button className="button-primary w-full" onClick={handleUploadClick} disabled={uploading}>
            {uploading ? 'Analyzing...' : 'Commence Analysis'}
          </button>
          {error && <p className="text-[#ff6b6b] mt-2 text-sm text-center">{error}</p>}
        </div>

        <div className="flex flex-col gap-6">
           <div className="glass-panel p-6 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="small-caps text-textSecondary">Success Metric</span>
                <TrendingUp size={16} color="#ffd166" />
              </div>
              <div className="text-5xl font-serif font-bold text-[#ffd166] my-4">84%</div>
              <p className="text-textSecondary text-sm leading-relaxed">
                Average improvement in keyword resonance for users using the <em>Curator's Lab</em> within the first 48 hours.
              </p>
           </div>
           
           <div className="glass-panel relative overflow-hidden p-6 bg-[url('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80')] bg-cover before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-[#1a1a1ae6] before:to-[#1a1a1af2]">
              <p className="relative z-10 font-serif italic text-sm leading-relaxed mb-6">
                "Precision in verbs creates authority. Use 'Orchestrated' instead of 'Managed' to signal high-level leadership."
              </p>
              <div className="relative z-10 small-caps text-textSecondary text-right">Curator Observation</div>
           </div>
        </div>
      </div>

      <div className="glass-panel p-8 mt-4">
         <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg uppercase tracking-wider m-0">Recent Analyses</h2>
            <span className="text-xs uppercase tracking-wider font-semibold text-primaryAccent cursor-pointer hover:underline">View Archive &rarr;</span>
         </div>
         
         <div className="flex flex-col gap-4">
            {displayHistory.map(item => (
              <div key={item._id} className="flex items-center gap-5 p-5 bg-black/30 border border-white/5 rounded-lg cursor-pointer transition hover:bg-black/50 hover:border-white/10 group" onClick={() => navigate(`/insights/${item._id}`)}>
                 <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-textSecondary group-hover:text-primaryAccent group-hover:bg-primaryAccent/10 transition"><FileText size={20} /></div>
                 <div className="flex-1 flex flex-col gap-1">
                   <div className="font-semibold text-[15px]">{item.fileName || 'Untitled_Resume'}</div>
                   <div className="text-xs text-textSecondary">
                     Analyzed {new Date(item.createdAt).toLocaleDateString()} &bull; <span className="text-primaryAccent">{item.analysis?.score || 0}/100 Score</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button className="p-2 bg-transparent text-textSecondary cursor-pointer rounded hover:bg-white/10 hover:text-textPrimary transition"><Download size={18} /></button>
                   <button className="p-2 bg-transparent text-textSecondary cursor-pointer rounded hover:bg-white/10 hover:text-textPrimary transition"><MoreVertical size={18} /></button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default LandingPage;
