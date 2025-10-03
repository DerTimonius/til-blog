import { generateSvg } from '~/utils/generateSvg';

export async function GET() {
  const png = await generateSvg('Today I learned', 'By DerTimonius');

  return new Response(Buffer.from(png), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
