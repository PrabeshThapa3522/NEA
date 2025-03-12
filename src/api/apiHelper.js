import axios from 'axios';
const api = axios.create({baseURL:'http://localhost:5001/api/auth'});
export const loginUser = (data)=> api.post('/login', data);
export const signupUser = (data)=> api.post('/register', data);
export const  createMeeting= (data)=> api.post('/meetings', data);
export const updateMeeting = (data)=> api.put('/meetings', data);
export const deleteMeeting = (data)=> api.delete('/meetings', data);
