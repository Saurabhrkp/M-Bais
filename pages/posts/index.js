import React from 'react';
import { getPostFeed } from '../../lib/api';

export default class PostPage extends React.Component {
  static async getInitialProps() {
    // will require help
    const entries = await getPostFeed();
    return { entries };
  }

  renderBlogList = (entries) =>
    entries.map((entry, i) => {
      return (
        <BlogBox
          key={i}
          id={entry.id}
          slug={entry.slug}
          imageUrl={entry.heroImage.imageUrl}
          title={entry.title}
          author={entry.author.name}
          description={entry.description}
          tags={entry.tags}
        />
      );
    });

  render() {
    const { entries } = this.props;
    return (
      <React.Fragment>
        <h1>Blog</h1>
        <div className='row mt-3'>
          {entries.length > 0 && this.renderBlogList(entries)}
          {entries.length == 0 && <div>Loading...</div>}
        </div>
      </React.Fragment>
    );
  }
}
