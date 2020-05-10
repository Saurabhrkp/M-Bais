import Router from 'next/router';
import axios from 'axios';

export const signupUser = async (user) => {
  const { data } = await axios.post('/api/auth/signup', user);
  return data;
};

export const signinUser = async (user) => {
  const { data } = await axios.post('/api/auth/signin', user);
  return data;
};

export const signoutUser = async () => {
  await axios.get('/api/auth/signout');
  Router.push('/');
};

export const getAuthUser = async (username) => {
  const { data } = await axios.get(`/api/${username}`);
  return data;
};

export const updateUser = async (username, userData) => {
  const { data } = await axios.put(`/api/${username}`, userData);
  return data;
};

export const deleteUser = async (username) => {
  const { data } = await axios.delete(`/api/${username}`);
  return data;
};

export const getUserProfile = async (username) => {
  const { data } = await axios.get(`/api/profile/${username}`);
  return data;
};

// ! Should be convert to get saved posts
export const getUserFeed = async (username) => {
  const { data } = await axios.get(`/api/${username}/feed`);
  return data;
};
