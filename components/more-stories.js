import { PostBox } from './blog/post-box';

export default function MoreStories({ posts }) {
  const renderBlogList = (posts) =>
    posts.map((post, i) => {
      return (
        <div className={`col-lg-5 col-md-5 m-3`} key={i}>
          <PostBox
            key={i}
            id={post.id}
            slug={post.slug}
            imageUrl={post.image.imageURL}
            title={post.title}
            author={post.author.name}
            description={post.description}
          />
        </div>
      );
    });

  return (
    <div className='row mt-3 justify-content-center'>
      {posts.length > 0 && renderBlogList(posts)}
      {posts.length == 0 && <div>Loading...</div>}
    </div>
  );
}
