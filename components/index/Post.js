import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import Comments from './Comments';

const Post = (props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const {
    user,
    post,
    handleToggleLike,
    handleAddComment,
    handleDeleteComment,
  } = props;

  // useEffect(() => {
  //   setIsLiked(checkLiked(post.likes));
  //   if (post.likes.length !== 0) {
  //     setNumLikes(post.likes.length);
  //   }
  //   setComments(post.comments);
  // }, []);

  // const checkLiked = (likes) => likes.includes(user);

  // const isPostCreator = post.author._id === user;

  return (
    <>
      <article>
        <>
          <br />
          <figure className='post-full-image text-center'>
            {/* <Video URL={post.video.videoURL} /> */}
          </figure>
          <section
            style={{ overflowY: 'inherit', marginBottom: '2em' }}
            className='post-full-content'
          >
            <ReactMarkdown source={post.body} className='px-5' />
          </section>
        </>
      </article>
      {/* Comments Area */}
      {/* <Comments
        user={user}
        slug={post.slug}
        comments={comments}
        handleAddComment={handleAddComment}
        handleDeleteComment={handleDeleteComment}
      /> */}
    </>
  );
};

export default Post;
