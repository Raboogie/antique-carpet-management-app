import { Outlet } from 'react-router';
import { NavBar } from '../components/UI/NavBar';
import { FooterMain } from "../components/UI/FooterMain.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Root() {
	return (
		<>
			<div className="main-container">
				<nav className="main-nav">
					<NavBar />
				</nav>
				<div className="main-content">
					<Outlet />
				</div>
                <div>
                    <FooterMain/>
                </div>
			</div>
			<ToastContainer position="top-center" autoClose={6000} hideProgressBar={false} closeOnClick pauseOnHover />
		</>
	);
}
