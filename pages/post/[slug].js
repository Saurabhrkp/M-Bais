import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Header } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import Post from '../../components/index/Post';
import {
  getPostBySlug,
  addComment,
  deleteComment,
  likePost,
  unlikePost,
} from '../../lib/index';

const Index = ({ user, post }) => {
  const [currentPost, setCurrentPost] = useState({});

  useEffect(() => {
    setCurrentPost(post);
  }, []);

  const handleToggleLike = (post) => {
    const isPostLiked = post.likes.includes(user);
    const sendRequest = isPostLiked ? unlikePost : likePost;
    sendRequest(post.slug)
      .then((postData) => {
        setCurrentPost(postData);
      })
      .catch((err) => console.error(err));
  };

  const handleAddComment = (slug, text) => {
    const comment = { text };
    addComment(slug, comment)
      .then((postData) => {
        setCurrentPost(postData);
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteComment = (slug, comment) => {
    deleteComment(slug, comment)
      .then((postData) => {
        setCurrentPost(postData);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Header user={user} />
      <Container fluid>
        <Row>
          <Col>
            <Post
              key={currentPost.id}
              post={currentPost}
              handleToggleLike={handleToggleLike}
              handleAddComment={handleAddComment}
              handleDeleteComment={handleDeleteComment}
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

Index.getInitialProps = async ({ query }) => {
  let post;
  var { slug } = query;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error(error);
    post = {};
  }
  return { post };
};

export default Index;
