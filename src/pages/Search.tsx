import { useEffect, useState } from 'react';
import CarpetForm from '../components/UI/CarpetForm';
import '../Css/pages/Search.css';
import CarpetSearch from '../components/UI/CarpetSearch.tsx';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router';
import { useUserContext } from '../lib/UserContext.tsx';
import * as React from 'react';

// interface CarpetDetails {
// 	number: string;
// 	name: string;
// 	width: string;
// 	length: string;
// 	unit: 'ft';
// 	material: string;
// 	color: string;
// 	price: string;
// }

const Search = () => {
	// const [carpetDetails, setCarpetDetails] = useState<CarpetDetails>({
	// 	number: '',
	// 	name: '',
	// 	width: '',
	// 	length: '',
	// 	unit: 'ft',
	// 	material: '',
	// 	color: '',
	// 	price: '',
	// });
	const [displayCarpetForm, setDisplayCarpetForm] = useState(false);
	const [role, setRole] = useState<string>();
	const navigate = useNavigate();
	const userCtx = useUserContext();

	const handleDisplayForm = () => {
		setDisplayCarpetForm(!displayCarpetForm);
	};

	const handleSignOut = () => {
		userCtx.signUserOut();
		navigate('/');
	};

	useEffect(() => {
		if (userCtx) {
			setRole(userCtx.userRole);
		}
	}, [role, userCtx]);

	return (
		<>
			<div className="search-container">
				{/* Build the carpet search component. Then add a toggle for admins to display the
				Carpet form component. */}
				<div className="display-carpet-form-btn">
					{role === 'Admin' ? (
						<Button
							className=""
							onClick={handleDisplayForm}
							variant="contained"
						>
							{displayCarpetForm
								? 'View Catalog'
								: 'Add New Carpet'}
						</Button>
					) : (
						''
					)}
					{/* Use split flag to display admin login btn. */}
					{userCtx.signedIn ? (
						<Button variant="contained" onClick={handleSignOut}>
							Sign Out
						</Button>
					) : (
						<Button variant="contained">
							<Link to={'/login'}>Admin login</Link>
						</Button>
					)}
				</div>
				<div>
					{displayCarpetForm ? <CarpetForm /> : <CarpetSearch />}
				</div>
			</div>
		</>
	);
};
export default Search;
