import { NavBarData } from '../../lib/constants/NavBarData';
import '../../Css/UI/NavBar.css';
import { Link } from 'react-router';
// TODO: Add NavLink instead of Link

export const NavBar = () => {
	return (
		<>
			<nav className="nav-bar">
				<div className="nav-logo">
					<h1>CHAMAN</h1>
					<h6>ANTIQUE RUG GALLERY</h6>
				</div>

				<div className="nav-bar-menu">
					<ul>
						{NavBarData.map(({ id, title, url }) => {
							return (
								<li key={id}>
									<Link to={url}>
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
		</>
	);
};
