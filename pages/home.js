import React, { useEffect, useState } from 'react';
import Router from 'next/router';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useForm } from 'react-hook-form';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Posts } from '../components/posts';

import { getPosts, searchPost } from '../lib/index';

const Index = (props) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    getPosts()
      .then((posts) => {
        setPosts(posts);
      })
      .catch((err) => console.log(err.message));
  }, []);

  const onSubmit = (form) => {
    var search = form.search;
    setIsLoading(true);
    searchPost(search)
      .then((post) => {
        setIsLoading(false);
        Router.push(`/post/${post.slug}`);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(true);
      });
  };
  return (
    <>
      <Header user={props.user} />
      <Container fluid>
        <Row
          style={{
            backgroundImage: `url('/assets/banner.png')`,
            width: 'auto',
            height: 460,
          }}
          className='align-items-center justify-content-center row-cols-2'
        >
          <Col xs={10} lg={6} md={8} sm={9} className='text-center p-0'>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Form.Control
                  name='search'
                  type='text'
                  size='lg'
                  placeholder='Enter Code here'
                  ref={register({ required: true })}
                />
                <Button
                  size='lg'
                  type='submit'
                  className='btn-block'
                  disabled={isLoading}
                >
                  Search
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
      {!error ? (
        <Container fluid>
          <Row>
            <Col className='text-center pt-4'>
              <br />
              <h1>Read Recent Post</h1>
              <Posts posts={posts} />
              <br />
            </Col>
          </Row>
        </Container>
      ) : (
        <Container fluid>
          <Row>
            <Col className='text-center pt-4'>
              <br />
              <h1>404 Not Found</h1>
              <br />
            </Col>
          </Row>
        </Container>
      )}
      <Footer />
    </>
  );
};

export default Index;
