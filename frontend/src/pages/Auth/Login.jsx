import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginUser } from '../../services/api';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });
      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-bgPrimary text-textPrimary font-sans min-h-screen relative items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-serif italic font-bold text-white/[0.02] whitespace-nowrap pointer-events-none z-0">
        Curator
      </div>
      
      <div className="relative z-10 w-full max-w-[480px] flex flex-col gap-8 animate-fade-in">
        <div className="flex flex-col items-center text-center">
           <div className="text-[10px] uppercase tracking-widest font-semibold text-primaryAccent flex items-center gap-2 mb-4">
             <span className="w-6 h-[2px] bg-primaryAccent"></span>
             ACCESS PORTAL
           </div>
           <h1 className="font-serif font-bold text-[48px] leading-[1.2]">
             Welcome Back,<br/>
             <span className="italic text-primaryAccent">Curator</span>
           </h1>
           <p className="text-textSecondary text-base leading-relaxed mt-4 max-w-[300px]">
             Return to your archives and continue crafting your professional legacy.
           </p>
        </div>

        <div className="glass-panel p-10 flex flex-col gap-6">
          {error && <div className="p-3 bg-[#ff6b6b]/10 border-l-[3px] border-[#ff6b6b] text-[#ff6b6b] text-sm rounded">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-5">
              <label className="text-[10px] uppercase tracking-widest font-semibold">Professional Email</label>
              <input 
                className="bg-black/30 border border-white/10 p-3.5 rounded-lg text-textPrimary text-sm outline-none transition duration-200 focus:border-primaryAccent"
                type="email" 
                placeholder="archivist@museum.org" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex flex-col gap-2 mb-5">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-widest font-semibold">Private Key</label>
                <span className="text-[10px] text-textSecondary cursor-pointer uppercase tracking-wider hover:text-textPrimary">Forgot Access?</span>
              </div>
              <input 
                className="bg-black/30 border border-white/10 p-3.5 rounded-lg text-textPrimary text-sm outline-none transition duration-200 focus:border-primaryAccent"
                type="password" 
                placeholder="............" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="button-primary w-full p-4 text-[13px] tracking-wider uppercase" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'ENTER THE ARCHIVES'}
            </button>
          </form>

          <div className="flex items-center text-center text-textSecondary text-[10px] tracking-widest before:flex-1 before:border-b before:border-white/10 after:flex-1 after:border-b after:border-white/10">
            <span className="px-4">OR AUTHENTICATE VIA</span>
          </div>

          <div className="flex gap-4">
            <button type="button" className="flex-1 bg-white/5 border border-white/10 p-3 rounded-lg text-textPrimary text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition hover:bg-white/10">
               <span className="text-[#EA4335]">G</span> Google
            </button>
            <button type="button" className="flex-1 bg-white/5 border border-white/10 p-3 rounded-lg text-textPrimary text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition hover:bg-white/10">
               <span className="text-[#0A66C2]">in</span> LinkedIn
            </button>
          </div>

          <div className="text-center text-[13px] text-textSecondary">
            New to the collection? <Link to="/register" className="text-primaryAccent">Request Membership</Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="font-serif italic text-sm leading-relaxed">
            "The curriculum vitae is more than a list; it is the curated narrative of one's professional soul."
          </p>
          <div className="text-[10px] uppercase tracking-widest font-semibold text-textSecondary mt-2 text-right">
            — VOL. IV, THE CURATOR'S HANDBOOK
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
