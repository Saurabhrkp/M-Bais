import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { PostCard } from './post-card';

export const Posts = ({ posts }) => {
  const renderBlogList = (posts) =>
    posts.map((post, i) => {
      return (
        <Col xs={10} lg={5} md={5} sm={8} key={i} className='m-3'>
          <PostCard
            id={post.id}
            slug={post.slug}
            imageUrl={post.image.imageURL}
            title={post.title}
            author={post.author.name}
            description={post.description}
          />
        </Col>
      );
    });

  return (
    <Row className='mt-3 justify-content-center align-items-center'>
      {posts.length > 0 && renderBlogList(posts)}
      {posts.length == 0 && <div>Loading...</div>}
    </Row>
  );
};
