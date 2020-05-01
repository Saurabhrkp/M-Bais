import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const ImageContainer = styled.div`
  background-image: ${(props) => `url(${props.imageUrl})`};
`;

export const PostBox = (props) => {
  return (
    <article className='card'>
      <ImageContainer imageUrl={props.imageUrl} className='card__img' />
      <Link href='/post/[slug]' as={`/post/${props.slug}`} passHref>
        <a className='card_link'>
          <ImageContainer
            imageUrl={props.imageUrl}
            className='card__img--hover'
          />
        </a>
      </Link>
      <div className='card__info'>
        {props.tags && props.tags.length > 0 && (
          <span className='card__category'>{props.tags[0]}</span>
        )}

        <Link href='/post/[slug]' as={`/post/${props.slug}`} passHref>
          <a style={{ color: '#000', textDecoration: 'none' }}>
            <h3 className='card__title'>{props.title}</h3>
          </a>
        </Link>
        <span className='card__by'>
          by{' '}
          <a href='#' className='card__author' title='author'>
            {props.author}
          </a>
        </span>
      </div>

      <div className='card__info-hover'>
        <div className='card__description'>{props.description}</div>
      </div>
    </article>
  );
};
