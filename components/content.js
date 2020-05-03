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
          <header className='post-full-header'>
            <h1 className='post-full-title'>{post.title}</h1>
            <div className='text-center meta'>{`${post.publishedDate}/ ${post.code} / ${mainTag}`}</div>
          </header>
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
          <header className='post-full-header'>
            <h1 className='post-full-title'>{post.title}</h1>
            <div className='text-center meta'>{`${post.publishedDate} / ${mainTag}`}</div>
          </header>
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
