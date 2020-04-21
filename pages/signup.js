import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import { Layout } from '../components/layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from 'next/link';

import { signupUser } from '../lib/auth';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setOpenError(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = { name, email, username, password, passwordConfirmation };
    setError('');
    setIsLoading(true);
    signupUser(user)
      .then((data) => {
        setCreatedUser(data);
        setError('');
        setOpenSuccess(true);
        setIsLoading(false);
      })
      .catch(showError);
  };

  const showError = (err) => {
    const error = (err.response && err.response.data) || err.message;
    setError(error);
    setOpenError(true);
    setIsLoading(false);
  };

  return (
    <Layout>
      <Row className='justify-content-center align-items-stretch'>
        <Col xs={11} lg={5} md={8} className='shadow p-3 m-5 bg-white rounded'>
          <h1>Sign up</h1>
          <hr />
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                name='name'
                type='text'
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                name='username'
                type='text'
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name='email'
                type='email'
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name='password'
                type='password'
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                name='passwordConfirmation'
                type='password'
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
              />
            </Form.Group>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
          </Form>
        </Col>
        {/* Error Snackbar */}
        {error && (
          <Toast
            onClose={handleClose}
            show={openError}
            delay={3000}
            autohide
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
            <Toast.Header>
              <strong className='mr-auto'>Error</strong>
            </Toast.Header>
            <Toast.Body>{error}</Toast.Body>
          </Toast>
        )}

        {/* Success Dialog */}
        <Modal
          show={openSuccess}
          size='lg'
          aria-labelledby='contained-modal-title-vcenter'
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              New Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>User {createdUser} successfully created!</Modal.Body>
          <Modal.Footer>
            <Button color='primary' variant='contained'>
              <Link href='/signin'>
                <a>Sign in</a>
              </Link>
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Layout>
  );
};

export default Signup;
