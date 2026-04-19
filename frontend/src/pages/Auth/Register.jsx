import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { registerUser } from '../../services/api';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerUser(formData);
      alert("Registration successful! Please login.");
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-bgPrimary text-textPrimary font-sans min-h-screen animate-fade-in flex-row">
      <div className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1512403264426-1b07ec3ba041?auto=format&fit=crop&q=80')] bg-center bg-cover before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#0a0a0ae6] before:to-[#141414f2]">
        <div className="relative z-10 p-[60px] h-full flex flex-col">
           <h2 className="font-serif font-bold text-[20px] tracking-[-0.5px] mb-auto">Resume Curator</h2>
           
           <div>
             <h1 className="font-serif font-bold text-[56px] leading-tight">
               Master the art of <br/>
               <span className="italic text-primaryAccent">narrative.</span>
             </h1>
             <p className="text-[#ddd] mt-4 max-w-md leading-relaxed">
               Join an elite circle of professionals leveraging AI to refine, polish, and curate their career milestones into a legacy.
             </p>
           </div>

           <div className="mt-auto bg-black/60 p-4 border border-white/10 max-w-sm rounded-sm">
              <p className="font-serif italic text-[13px] leading-relaxed">
                "The paper choice is as important as the words chosen."
              </p>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-bgPrimary">
        <div className="w-full max-w-[400px] p-10">
           <div className="mb-10">
             <h2 className="font-serif font-bold text-[32px] mb-2">Begin Curating</h2>
             <p className="text-textSecondary text-[14px]">Create your account to start your professional transformation.</p>
           </div>

           {error && <div className="p-3 bg-[#ff6b6b]/10 border-l-[3px] border-[#ff6b6b] text-[#ff6b6b] text-sm rounded mb-6">{error}</div>}
           <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold">Full Name</label>
                <input 
                  className="bg-black/30 border border-white/10 p-3.5 rounded-lg text-textPrimary text-sm outline-none transition duration-200 focus:border-primaryAccent"
                  type="text" 
                  name="name"
                  placeholder="Arthur P. Morgan" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold">Email Address</label>
                <input 
                  className="bg-black/30 border border-white/10 p-3.5 rounded-lg text-textPrimary text-sm outline-none transition duration-200 focus:border-primaryAccent"
                  type="email" 
                  name="email"
                  placeholder="scholar@curator.io" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold">Password</label>
                <input 
                  className="bg-black/30 border border-white/10 p-3.5 rounded-lg text-textPrimary text-sm outline-none transition duration-200 focus:border-primaryAccent"
                  type="password" 
                  name="password"
                  placeholder="............" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-start gap-3 mt-2 mb-2">
                <input type="checkbox" id="terms" required className="mt-1" />
                <label htmlFor="terms" className="text-xs text-textSecondary leading-relaxed">
                  I accept the <span className="text-primaryAccent">Terms of Curation</span> and the <span className="text-primaryAccent">Privacy Policy</span>.
                </label>
              </div>

              <button type="submit" className="button-primary w-full p-4 mt-4 text-[13px] tracking-wider uppercase" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
           </form>

           <div className="text-center mt-8 text-[13px] text-textSecondary">
             Already have a manuscript? <Link to="/login" className="text-primaryAccent">Login &rarr;</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
