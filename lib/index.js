import axios from 'axios';

export const getPosts = async () => {
  const { data } = await axios.get(`/posts/`);
  return data;
};
export const likePost = async (slug) => {
  const { data } = await axios.put(`/posts/${slug}/like`);
  return data;
};

export const unlikePost = async (slug) => {
  const { data } = await axios.put(`/posts/${slug}/unlike`);
  return data;
};

export const addComment = async (slug, comment) => {
  const { data } = await axios.put(`/posts/${slug}/comment`, comment);
  return data;
};

export const deleteComment = async (slug, comment) => {
  const { data } = await axios.put(`/posts/${slug}/uncomment`, comment);
  return data;
};

export const getPostBySlug = async (slug) => {
  const { data } = await axios.get(`/posts/${slug}`);
  return data;
};

export const searchPost = async (codeQuery) => {
  const { data } = await axios.get(`/posts/search/${codeQuery}`);
  return data;
};
