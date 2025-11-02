import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { generateSvg } from '~/utils/generateSvg';

export async function getStaticPaths() {
	const posts = await getCollection('blogs');
	return posts.map((post) => ({
		params: { slug: post.slug },
		props: post,
	}));
}

export async function GET({ props }: APIContext) {
	const title = props.data.title;
	const description = props.data.description;
	const png = await generateSvg(title, description);

	return new Response(Buffer.from(png), {
		headers: {
			'Content-Type': 'image/png',
		},
	});
}
