import React, { useEffect, useState } from 'react';

import { Layout } from '../components/layout';
import MoreStories from '../components/more-stories';

import { Header } from '../components/Navbar';
import Intro from '../components/intro';

import { authInitialProps } from '../lib/auth';
import { getPosts } from '../lib/api';

const Index = ({ auth }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts()
      .then((posts) => {
        setPosts(posts);
      })
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <>
      <Header auth={auth} />
      <Layout>
        <Intro />
        <main className='container my-5'>
          <MoreStories posts={posts} />
        </main>
      </Layout>
    </>
  );
};

Index.getInitialProps = authInitialProps();

export default Index;
