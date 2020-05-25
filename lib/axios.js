import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.BASE_URL || `http://localhost:3000`,
});

export default instance;

// headers: ctx.req ? { cookie: ctx.req.headers.cookie } : undefined,
