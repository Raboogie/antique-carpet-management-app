import { useEffect, useState } from 'react';
import CarpetForm from '../components/UI/CarpetForm';
import '../Css/pages/Search.css';
import CarpetSearch from '../components/UI/CarpetSearch.tsx';
import { useUserContext } from '../lib/UserContext.tsx';

const Search = () => {
	const [displayDefaultComponent, setDisplayDefaultComponent] = useState(true);
	const [role, setRole] = useState<string>();
	const userCtx = useUserContext();


	useEffect(() => {
		if (userCtx) {
			setRole(userCtx.userRole);
		}
	}, [role, userCtx]);

	return (
		<>
			<div className="search-container">
				<div className="display-carpet-form-btn">
				</div>
				<div>
					{displayDefaultComponent
						? <CarpetSearch toggleDefaultComponent={setDisplayDefaultComponent} displayDefaultComponent={displayDefaultComponent}/>
						: <CarpetForm toggleDefaultComponent={setDisplayDefaultComponent} displayDefaultComponent={displayDefaultComponent}/>
					}
				</div>
			</div>
		</>
	);
};
export default Search;
