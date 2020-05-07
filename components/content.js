import React from 'react';

import Video from './video';
import ReactMarkdown from 'react-markdown';

export const Content = (props) => {
  const { post } = props;
  const mainTag = post.tags.length > 0 ? post.tags[0] : '';
  return (
    <article className='post-full post'>
      {!props.post.video ? (
        <>
          <br />
          <figure className='post-full-image text-center'>
            <img
              className='img-fluid'
              src={post.image.imageURL}
              alt={post.title}
            />
          </figure>
          <section
            style={{ overflowY: 'inherit', marginBottom: '2em' }}
            className='post-full-content'
          >
            <ReactMarkdown source={post.body} className='px-5' />
          </section>
        </>
      ) : (
        <>
          <br />
          <figure className='post-full-image text-center'>
            <Video URL={post.video.videoURL} />
          </figure>
          <section
            style={{ overflowY: 'inherit', marginBottom: '2em' }}
            className='post-full-content'
          >
            <ReactMarkdown source={post.body} className='px-5' />
          </section>
        </>
      )}
    </article>
  );
};
