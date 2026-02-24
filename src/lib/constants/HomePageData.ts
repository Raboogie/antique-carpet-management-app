import { v4 as uuidv4 } from 'uuid';

export const HomePageData = [
	{
		id: uuidv4(),
		title: 'Antique Rugs',
		desc: 'Antique rugs represent the highest level of traditional carpet weaving, defined by age, materials, and regional technique rather than surface appearance. Woven more than 80 years ago across Persia, Anatolia, the Caucasus, China, India, and Europe, these rugs were produced within established workshop, village, and tribal systems using natural fibers and dyes. Their designs reflect local aesthetics, practical use, and cultural symbolism specific to each region.',
		image: './images/photo-6.jpeg',
	},
	{
		id: uuidv4(),
		title: 'Persian Rugs',
		desc: 'Persian rugs (Iranian carpets) are the worlds most widely recognized hand-knotted rugs, ranging from refined workshop masterpieces to bold village and tribal weavings. Early vintage Persian rugs remain the benchmark for collectors, designers, and institutions, valued for their structure, artistic coherence, and enduring relevance.',
		image: './images/photo-7.jpeg',
	},
	{
		id: uuidv4(),
		title: 'Modern Rugs',
		desc: 'Modern rugs and new carpets address a combination of customary craftsmanship and design with contemporary style and innovation. These carpets are a testament of the development of the carpet-making industry, embracing advancement and creative articulation.',
		image: './images/photo-3.jpeg',
	},
	{
		id: uuidv4(),
		title: 'Vintage Moroccan Rugs',
		desc: 'Vintage Moroccan rugs are handwoven Moroccan carpets and flatweaves—often tied to Amazigh (Berber) weaving traditions—known for symbolic geometry, strong texture, and standout mid-20th-century design appeal. These rugs are celebrated for their bold geometry, expressive color, and tactile wool textures—ranging from plush pile weavings to graphic flatweaves.',
		image: './images/photo-11.jpeg',
	},
	{
		id: uuidv4(),
		title: 'Antique Tribal Rugs',
		desc: 'A tribal rug is a handmade weaving traditionally created by nomadic or village communities, recognized for its geometric drawing style, personal symbolism, and region-specific construction techniques.',
		image: './images/photo-13.jpeg',
	},
	{
		id: uuidv4(),
		title: 'Scandinavian Mid-Century Carpets & Rugs',
		desc: 'Scandinavian mid-century rugs are vintage Nordic weavings—especially Swedish flatweaves and rya—known for crisp geometry, calm structure, and color that feels modern even decades later. They are loved for a rare balance: they’re designed, but not fussy. You get crisp geometry, calming negative space, and color that feels modern without trying too hard—so the rug anchors a room instead of competing with it.',
		image: './images/photo-14.jpeg',
	},
];

interface Carpet {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
}

export const carpetData: Carpet[] = [
	{
		id: 'isfahan',
		title: 'Classic Isfahan',
		description: '17th-century weaving tradition with intricate floral motifs and a central medallion.',
		imageUrl: './images/PersianIsfahan.png',
	},
	{
		id: 'serapi',
		title: 'Serapi',
		description: 'Late 19th-century piece featuring bold, geometric designs and a relaxed weave.',
		imageUrl: './images/TurkishUshak.png',
	},
	{
		id: 'artdeco',
		title: 'Chinese Art Deco',
		description: '1920s minimalist design featuring striking gold dragons against a bold background.',
		imageUrl: './images/Chinese-Art-Deco.png',
	},
	{
		id: 'khotan',
		title: 'Khotan Runner',
		description: 'East Turkestan blend of Chinese and Central Asian designs with a repeating pomegranate motif.',
		imageUrl: './images/Khotan-Rug.png',
	},
	{
		id: 'kazak',
		title: 'Antique Kazak',
		description: 'A powerful statement from the Caucasus with vibrant colors and interconnected medallions.',
		imageUrl: './images/Kazak-Rug.png',
	},
	{
		id: 'kerman',
		title: 'Kerman',
		description: 'A masterpiece of floral design in soft pastel colors, bringing elegance and grandeur.',
		imageUrl: './images/Kerman-Rug.png',
	},
	{
		id: 'silk',
		title: 'Silk Persian',
		description: 'An exquisite prayer rug featuring a finely detailed tree of life motif and a luxurious sheen.',
		imageUrl: './images/Silk-Persian-Rug.png',
	}
];
