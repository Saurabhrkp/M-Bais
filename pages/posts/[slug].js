import React from 'react';
import { NextSeo } from 'next-seo';

export default class BlogDetailPage extends React.Component {
  static async getInitialProps(ctx) {
    const { slug } = ctx.query;
    // here you will need help... but its simple
    const post = await api.fetchBlogById(slug);
    return { post };
  }

  render() {
    const { post } = this.props;
    return (
      <>
        <NextSeo
          openGraph={{
            type: 'article',
            title: post.metaTitle,
            description: post.metaDescription,
            images: [
              {
                url: post.metaImage,
                width: 850,
                height: 650,
                alt: post.metaTitle,
              },
            ],
          }}
          title={post.metaTitle}
          description={post.metaDescription}
        />
        <div className='row'>
          <div className='col-12'>
            {!post && <div>Loading...</div>}
            {post && <BlogDetail post={post} />}
          </div>
        </div>
      </>
    );
  }
}
