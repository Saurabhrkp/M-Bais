import Avatar from './avatar';
import Date from './date';
import CoverImage from './cover-image';
import Link from 'next/link';

export default function HeroPost(props) {
  const { posts } = props;
  return (
    <section>
      <div className='mb-8 md:mb-16'>
        <CoverImage
          title={post.title}
          src={post.image.imageUrl}
          slug={post.slug}
        />
      </div>
      <div className='md:grid md:grid-cols-2 md:col-gap-16 lg:col-gap-8 mb-20 md:mb-28'>
        <div>
          <h3 className='mb-4 text-4xl lg:text-6xl leading-tight'>
            <Link as={`/posts/${posts.slug}`} href='/posts/[slug]'>
              <a className='hover:underline'>{posts.title}</a>
            </Link>
          </h3>
          <div className='mb-4 md:mb-0 text-lg'>
            <Date dateString={post.publishedDate} />
          </div>
        </div>
        <div>
          <Avatar name={post.author.name} picture={post.author.avatar} />
        </div>
      </div>
    </section>
  );
}
