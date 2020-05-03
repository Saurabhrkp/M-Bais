import React, { useState } from 'react';
import Router from 'next/router';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';

import { useForm } from 'react-hook-form';

import { signupUser } from '../lib/auth';

// ? FIXME: Remove Row, Col with div to align form in center

const Signup = () => {
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const handleClose = () => setOpenError(false);

  const onSubmit = (form) => {
    setError('');
    setIsLoading(true);
    signupUser(form)
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
    <Container fluid>
      <Row className='justify-content-center align-items-center vh-100'>
        <Col
          xs={10}
          lg={5}
          md={6}
          sm={8}
          className='shadow p-5 m-2 rounded-lg'
          style={{ backgroundImage: `url('/assets/banner.png')` }}
        >
          <h1 className='text-white'>SIGN UP</h1>
          <hr />
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                name='email'
                type='email'
                ref={register({ required: true, pattern: /^\S+@\S+$/i })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                name='name'
                type='text'
                ref={register({ required: true, maxLength: 80 })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                name='username'
                type='text'
                ref={register({ required: true, maxLength: 80 })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name='password'
                type='password'
                ref={register({ required: true })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                name='passwordConfirmation'
                type='password'
                ref={register({ required: true })}
              />
            </Form.Group>
            <Button type='submit' className='mr-3' disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up'}
            </Button>
            <Button
              onClick={() => {
                Router.push('/signin');
              }}
            >
              Sign in
            </Button>
          </Form>
        </Col>
        {/* Error Snackbar */}
        {error && (
          <Toast
            onClose={handleClose}
            show={openError}
            delay={6000}
            autohide
            style={{
              margin: '15px',
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
          onHide={() => setOpenSuccess(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title-vcenter'>
              New Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            User {createdUser.username} successfully created!
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                Router.push('/signin');
              }}
            >
              Sign in
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Container>
  );
};

export default Signup;
