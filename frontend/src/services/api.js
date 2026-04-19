import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const loginUser = async (credentials) => API.post('/auth/login', credentials);
export const registerUser = async (credentials) => API.post('/auth/register', credentials);

export const uploadResume = async (file, token) => {
  const formData = new FormData();
  formData.append('resume', file);
  return API.post('/resumes/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getHistory = async (token) => {
  return API.get('/resumes/history', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getResumeById = async (id, token) => {
  return API.get(`/resumes/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
