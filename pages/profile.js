import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import { Header } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { authInitialProps } from '../lib/auth';
import { getAuthUser } from '../lib/api';

const Profile = ({ auth }) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAuthUser(auth.token)
      .then((data) => {
        const { username, email, id } = data;
        setUser({ username, email, id });
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Header {...auth} />
      <Container className='vh-100'>
        <Row className='h-100 justify-content-center'>
          <Col xs={10} lg={10} className='shadow p-4 my-5'>
            <h1>Profile</h1>
            <hr />
            {isLoading ? (
              <div>
                <Spinner animation='border' role='status'>
                  <span className='sr-only'>Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <div>{user.username}</div>
                <div>{user.email}</div>
                <div>{user.id}</div>
              </>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

Profile.getInitialProps = authInitialProps(true);

export default Profile;
