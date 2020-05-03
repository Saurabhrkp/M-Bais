import axios from 'axios';
const url = `http://localhost:3000`;

export const getUser = async (username) => {
  const { data } = await axios.get(`/api/profile/${username}`);
  return data;
};

export const deleteUser = async (username) => {
  const { data } = await axios.delete(`/api/${username}`);
  return data;
};

export const getAuthUser = async (username) => {
  const { data } = await axios.get(`/api/${username}`);
  return data;
};

export const updateUser = async (username, userData) => {
  const { data } = await axios.put(`/api/${username}`, userData);
  return data;
};

export const getUserFeed = async (username) => {
  const { data } = await axios.get(`/api/${username}/feed`);
  return data;
};

export const addPost = async (username, post) => {
  const { data } = await axios.post(`/posts/${username}/new`, post);
  return data;
};

export const getPosts = async () => {
  const { data } = await axios.get(`/posts/`);
  return data;
};

export const deletePost = async (slug) => {
  const { data } = await axios.delete(`/posts/${slug}`);
  return data;
};

export const getPostBySlug = async (slug) => {
  const { data } = await axios.get(`${url}/posts/${slug}`);
  return data;
};

export const searchPost = async (query) => {
  const { data } = await axios.get(`${url}/posts/search?search=${query}`);
  return data;
};

export const updatePost = async (slug, post) => {
  const { data } = await axios.put(`/posts/${slug}`, post);
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

export const getAdminFeed = async (username) => {
  const { data } = await axios.get(`/admin/${username}`);
  return data;
};

export const savePost = async (username, post) => {
  const { data } = await axios.post(`/admin/${username}`, post);
  return data;
};

export const deleteAdminPost = async (slug) => {
  const { data } = await axios.delete(`/admin/${slug}`);
  return data;
};

export const updateAdminPost = async (slug, post) => {
  const { data } = await axios.put(`/admin/${slug}`, post);
  return data;
};

export const deleteVideo = async (slug, post) => {
  const { data } = await axios.delete(`/admin/${slug}/video`, post);
  return data;
};

export const deleteImage = async (slug, post) => {
  const { data } = await axios.delete(`/admin/${slug}/image`, post);
  return data;
};

export const getUsers = async () => {
  const { data } = await axios.get(`/admin/all/users`);
  return data;
};
