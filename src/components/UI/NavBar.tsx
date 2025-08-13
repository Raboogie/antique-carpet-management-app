import { NavBarData } from '../../lib/constants/NavBarData';
import '../../Css/UI/NavBar.css';
import { Link } from 'react-router';
import { useState } from 'react';

export const NavBar = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="nav-bar">
			<div className="nav-logo">
				<h1>CHAMAN</h1>
				<h6>ANTIQUE RUG GALLERY</h6>
			</div>

			<button
				className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
				onClick={toggleMobileMenu}
				aria-label="Toggle mobile menu"
			>
				<span></span>
				<span></span>
				<span></span>
			</button>

			<div className={`nav-bar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
				<ul>
					{NavBarData.map(({ id, title, url }) => {
						return (
							<li key={id}>
								<Link to={url} onClick={closeMobileMenu}>
									<button className="nav-bar-btn">
										{title}
									</button>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
};
