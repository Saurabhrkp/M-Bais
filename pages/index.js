import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Posts } from '../components/posts';

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
      <Header {...auth} />
      <Container fluid style={{ backgroundImage: `url('/assets/banner.png')` }}>
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
            <h2>
              Mission At <br />
              M-Bias
            </h2>
            <h3>
              We want to lead in generating practical quality content that helps
              students in understanding the world around us and logically
              improve our community.
            </h3>
            <a href='#' className='boxed_btn'>
              Learn More
            </a>
          </Col>
        </Row>
      </Container>
      <Container fluid style={{ backgroundImage: `url('/assets/banner.png')` }}>
        <Row className='justify-content-center min-vh-100 align-items-center'>
          <Col className='text-center text-white'>
            <h3>
              Our Vision is to give our next generation what we missed in our
              education system in past few decades, A new perspective of how
              education relates to our daily life.
            </h3>
            <h1>Our Vision</h1>
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row className='justify-content-center align-items-center pt-4'>
          <Col className='text-center'>
            <h3>Smart & Simple</h3>
            <h4>
              Direct access to what you need, each subtopic of each chapter in
              Physics, chemistry, Mathematics & Biology will have a printed QR
              code placed on the page of your book, just scan and watch videos
              explanation of difficult topics to understand easily anytime
            </h4>
          </Col>
        </Row>
        <Row className='justify-content-center align-items-center'>
          <Col>
            <img
              src='/assets/phonedesign.png'
              className='img-fluid p-5'
              alt=''
            />
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          <Col className='text-center pt-4 bg-dark'>
            <br />
            <h1 className='text-light'>Read Some Post here</h1>
            <Posts posts={posts} />
            <br />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

// Just let authInitialProps() be there it would do any thing
Index.getInitialProps = authInitialProps();

export default Index;
