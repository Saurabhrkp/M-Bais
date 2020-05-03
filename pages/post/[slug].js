import React from 'react';
import { NextSeo } from 'next-seo';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Content } from '../../components/content';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';

import { getPostBySlug } from '../../lib/api';
import { authInitialProps } from '../../lib/auth';

const PostDetailPage = ({ post, auth }) => {
  return (
    <>
      <NextSeo
        openGraph={{
          type: 'article',
          title: post.metaTitle,
          description: post.metaDescription,
        }}
        title={post.metaTitle}
        description={post.metaDescription}
      />
      <Header auth={auth} />
      <Container fluid>
        <Row>
          <Col>
            {!post && <div>Loading...</div>}
            {post && <Content post={post} />}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

PostDetailPage.getInitialProps = async (ctx) => {
  const { slug } = ctx.query;
  const { auth } = authInitialProps()(ctx);
  const post = await getPostBySlug(slug);
  return { post, auth };
};

export default PostDetailPage;
