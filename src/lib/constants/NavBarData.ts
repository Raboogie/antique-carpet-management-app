import { v4 as uuidv4 } from 'uuid';

export const NavBarData = [
	{
		id: uuidv4(),
		title: 'Home',
		url: '/',
	},
	{
		id: uuidv4(),
		title: 'Search',
		url: '/search',
	},
	{
		id: uuidv4(),
		title: 'Contact',
		url: '/contact',
	},
];
