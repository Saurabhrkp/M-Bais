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

import { authInitialProps } from '../lib/auth';
import { getPosts, searchPost } from '../lib/api';

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
      <Header auth={props.auth} />
      <>
        <Container
          fluid
          style={{ backgroundImage: `url('/assets/banner.png')` }}
        >
          <Row className='justify-content-center min-vh-100 align-items-center'>
            <Col xs={10} lg={6} md={10} sm={10}>
              <img
                src='/assets/edu_ilastration.png'
                className='img-fluid'
                alt=''
              />
            </Col>
            <Col xs={10} lg={6} md={10} sm={10}>
              <h1 className='text-white mt-4 header'>
                M-Bias is a Digital Content Platform, Specifically tailoered for
                HSC Students directly alligned with thier text books and easily
                accessible at their finger tips with just a QR Code scan.
              </h1>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row className='justify-content-center min-vh-100 align-items-center'>
            <Col className='text-center'>
              <div className='row form-group'>
                <div className='col-md-8'>
                  <h2>
                    <b>M-Bias</b>
                  </h2>
                  <br />
                  <h3>
                    We want to lead in generating practical quality content{' '}
                    <br />
                    <br />
                    that helps students in understanding the world around us{' '}
                    <br />
                    <br />
                    and logically improve our community.
                    <br />
                  </h3>
                  <br />
                  <br />
                  <a href='#' className='boxed_btn'>
                    Learn More
                  </a>
                </div>

                <div className='col-md-4'>
                  <img
                    src='/assets/mission.png'
                    width='80%'
                    height='80%'
                    className='img-fluid'
                    alt=''
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Container
          fluid
          style={{ backgroundImage: `url('/assets/banner.png')` }}
        >
          <Row className='justify-content-center min-vh-100 align-items-center'>
            <Col className='text-center text-white'>
              <div className='row form-group'>
                <div className='col-md-4'>
                  <img
                    src='/assets/vision.png'
                    width='80%'
                    height='80%'
                    className='img-fluid'
                    alt=''
                  />
                </div>

                <div className='col-md-8'>
                  <h1>Our Vision</h1>
                  <br />
                  <br />
                  <h3>
                    Our Vision is to give our next generation <br />
                    <br />
                    what we missed in our education system in past few decades,{' '}
                    <br />
                    <br />
                    A new perspective of how education relates to our daily
                    life.
                    <br />
                    <br />
                  </h3>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row className='justify-content-center align-items-center pt-4'>
            <Col className='text-center'>
              <br />
              <br />
              <h3>Smart & Simple</h3>
              <br />
              <br />
              <h4>
                Direct access to what you need, each subtopic of each chapter in
                Physics, chemistry, Mathematics & Biology will have a printed QR
                code placed on the page of your book, just scan and watch videos
                explanation of difficult topics to understand easily anytime
              </h4>
            </Col>
          </Row>
          <Row className='justify-content-center align-items-center'>
            <Col xs={11} lg={7} md={9} sm={10}>
              <img src='/assets/demo.png' className='img-fluid p-5' alt='' />
            </Col>
          </Row>
        </Container>
      </>
      <Footer />
    </>
  );
};

// Just let authInitialProps() be there it would do any thing
Index.getInitialProps = authInitialProps();

export default Index;
