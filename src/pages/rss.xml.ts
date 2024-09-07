import rss from '@astrojs/rss';
import { site } from '~/utils/config';
import { getSortedPosts } from '~/utils/sortPosts';

export async function GET() {
  const posts = await getSortedPosts();
  return rss({
    title: site.title,
    description: site.desc,
    site: site.website,
    items: posts.map(({ data: { title, description, ...data }, slug }) => ({
      link: `posts/${slug}`,
      title,
      description,
      pubDate: new Date(data.pubDate),
    })),
  });
}
