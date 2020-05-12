import React, { useState } from 'react';
import Link from 'next/link';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useForm } from 'react-hook-form';

const Comments = (props) => {
  const [text, setText] = useState('');
  const { register, handleSubmit } = useForm();
  const { slug, user, handleDeleteComment } = props;

  const onSubmit = (form) => {
    console.info(form);
    handleAddComment(slug, text);
    setText('');
  };

  const showComment = (comment) => {
    const isCommentCreator = comment.postedBy.id === user;

    return (
      <div>
        <Link href={`/profile/${comment.postedBy.username}`}>
          <a>{comment.postedBy.name}</a>
        </Link>
        <br />
        {comment.text}
        <span className={commentDate}>
          {comment.createdAt}
          {isCommentCreator && (
            <Button onClick={() => handleDeleteComment(slug, comment)} />
          )}
        </span>
      </div>
    );
  };

  return (
    <div className=''>
      {/* Comment Input */}
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label htmlFor='add-comment'>Add comments</Form.Label>
            <Form.Control
              id='add-comment'
              name='text'
              placeholder='Reply to this post'
              ref={register({ required: true })}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Card>

      {/* Comments */}
      {comments.map((comment) => (
        <Card key={comment._id}>
          <Card.Header>{showComment(comment)}</Card.Header>
        </Card>
      ))}
    </div>
  );
};

export default Comments;
