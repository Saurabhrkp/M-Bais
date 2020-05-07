import Router from 'next/router';
import axios from 'axios';

export const getSessionFromClient = () => {
  if (typeof window !== 'undefined') {
    var user = window.localStorage.getItem('token');
    user = JSON.parse(user);
    return { user };
  }
  return { user: {} };
};

const redirectUser = (res, path) => {
  if (res) {
    res.redirect(302, path);
    res.finished = true;
    return {};
  }
  Router.replace(path);
  return {};
};

export const authInitialProps = (isProtectedRoute) => ({ req, res }) => {
  const auth = getSessionFromClient();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if (isProtectedRoute && isAnonymous && currentPath !== '/signin') {
    return redirectUser(res, '/signin');
  }
  return { auth };
};

export const signupUser = async (user) => {
  const { data } = await axios.post('/api/auth/signup', user);
  return data;
};

export const signinUser = async (user) => {
  const { data } = await axios.post('/api/auth/signin', user);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('token', JSON.stringify(data));
  }
  return data;
};

export const signoutUser = async () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('token');
  }
  await axios.get('/api/auth/signout');
  Router.push('/');
};
