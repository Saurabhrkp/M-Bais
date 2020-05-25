// ! This file is just for refrence for routes available

import axios from 'axios';

export const getAllPosts = async () => {
  const { data } = await axios.get(`/admin`);
  return data;
};

export const addPost = async (username, post) => {
  const { data } = await axios.post(`/admin/article/${username}`, post);
  return data;
};

export const deletePost = async (slug) => {
  const { data } = await axios.delete(`/admin/${slug}`);
  return data;
};

export const updatePost = async (slug, post) => {
  const { data } = await axios.put(`/admin/${slug}`, post);
  return data;
};

export const getUsers = async () => {
  const { data } = await axios.get(`/admin/all/users`);
  return data;
};

export const deletePhotos = async (slug, fileId) => {
  const { data } = await axios.delete(`/admin/${slug}/photos/${fileId}`);
  return data;
};

export const deleteVideo = async (slug, fileId) => {
  const { data } = await axios.delete(`/admin/${slug}/video/${fileId}`);
  return data;
};
