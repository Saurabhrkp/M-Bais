import axios from 'axios';

export const getUser = async (userId) => {
  const { data } = await axios.get(`/api/users/profile/${userId}`);
  return data;
};

export const deleteUser = async (authUserId) => {
  const { data } = await axios.delete(`/api/users/${authUserId}`);
  return data;
};

export const getAuthUser = async (authUserId) => {
  const { data } = await axios.get(`/api/users/${authUserId}`);
  return data;
};

export const updateUser = async (authUserId, userData) => {
  const { data } = await axios.put(`/api/users/${authUserId}`, userData);
  return data;
};

export const getUserFeed = async (authUserId) => {
  const { data } = await axios.get(`/api/users/feed/${authUserId}`);
  return data;
};

export const addPost = async (username, post) => {
  const { data } = await axios.post(`/posts/${username}/new`, post);
  return data;
};

export const getPostFeed = async (username) => {
  const { data } = await axios.get(`/posts/${username}/feed`);
  return data;
};

export const deletePost = async (postId) => {
  const { data } = await axios.delete(`/api/posts/${postId}`);
  return data;
};

export const likePost = async (postId) => {
  const { data } = await axios.put(`/posts/like`, { postId });
  return data;
};

export const unlikePost = async (postId) => {
  const { data } = await axios.put(`/posts/unlike`, { postId });
  return data;
};

export const addComment = async (postId, comment) => {
  const { data } = await axios.put('/posts/comment', { postId, comment });
  return data;
};

export const deleteComment = async (postId, comment) => {
  const { data } = await axios.put('/posts/uncomment', { postId, comment });
  return data;
};

export const getPostsByUser = async (username) => {
  const { data } = await axios.get(`/posts/by/${username}`);
  return data;
};

export const playVideo = async (filename) => {
  const { data } = await axios.get(`/posts/${filename}`);
  return data;
};
