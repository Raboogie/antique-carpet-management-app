import { useState } from 'react';
import CarpetForm from '../components/UI/CarpetForm';
import '../Css/pages/Search.css';
import CarpetSearch from "../components/UI/CarpetSearch.tsx";
import Button from '@mui/material/Button';
import { Link } from 'react-router'

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

	const handleDisplayForm = () => {
		setDisplayCarpetForm(!displayCarpetForm);
	}

	return (
		<>
			<div className="search-container">
				{/* Build the carpet search component. Then add a toggle for admins to display the
				Carpet form component. */}
				<div className="display-carpet-form-btn">
					<Button className="" onClick={handleDisplayForm} variant="contained">{displayCarpetForm ? "View Catalog" : "Add New Carpet"}</Button>
					<Button variant="contained"><Link to={'/login'}>Admin login</Link></Button>

				</div>
				<div>
					{displayCarpetForm ? <CarpetForm /> : <CarpetSearch />}
				</div>

			</div>
		</>
	);
};
export default Search;
