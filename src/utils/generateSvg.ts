import fs from 'fs';
import path from 'path';
import satori from 'satori';
import sharp from 'sharp';

function getFontPath(weight: number) {
	return path.join(
		process.cwd(),
		'node_modules',
		'@fontsource',
		'monaspace-neon',
		'files',
		`monaspace-neon-latin-${weight}-normal.woff`,
	);
}

const normalWeightPath = getFontPath(400);
const semiboldWeightPath = getFontPath(600);

function generateBackgroundSvg(width: number, height: number, count: number) {
	// build <rect> elements
	const rects = Array.from({ length: count })
		.map(() => {
			const x = Math.floor(Math.random() * width);
			const y = Math.floor(Math.random() * height);
			const isHighlight = Math.random() < 0.015;
			const shade = 10 + Math.floor(Math.random() * 20);
			const color = isHighlight ? '#DC5151' : `hsl(220, 5%, ${shade}%)`;

			return `<rect x="${x}" y="${y}" width="8" height="8" fill="${color}" rx="2"/>`;
		})
		.join('');

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${rects}</svg>`;

	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export async function generateSvg(title: string, description: string) {
	const semiboldData = fs.readFileSync(semiboldWeightPath);
	const normalData = fs.readFileSync(normalWeightPath);
	const bg = generateBackgroundSvg(1200, 630, 750);

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '1200px',
					height: '630px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					justifyContent: 'center',
					backgroundColor: '#0D1323',
					backgroundImage: `url("${bg}")`,
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								marginTop: '172px',
								marginLeft: '110px',
								color: 'white',
								fontSize: '72px',
								fontFamily: 'Monaspace Neon',
								fontWeight: 600,
								maxWidth: '1000px',
							},
							children: title,
						},
					},
					{
						type: 'div',
						props: {
							style: {
								marginTop: '24px',
								marginLeft: '110px',
								color: 'darkgray',
								fontSize: '32px',
								fontWeight: 400,
								fontFamily: 'Monaspace Neon',
								maxWidth: '1000px',
							},
							children: description,
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Monaspace Neon',
					data: normalData,
					weight: 400,
					style: 'normal',
				},
				{
					name: 'Monaspace Neon',
					data: semiboldData,
					weight: 600,
					style: 'normal',
				},
			],
		},
	);

	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return png;
}
