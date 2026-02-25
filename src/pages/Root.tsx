import { Outlet } from 'react-router';
import { NavBar } from '../components/UI/NavBar';
import { FooterMain } from "../components/UI/FooterMain.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorBoundary } from 'react-error-boundary';
import { FullPageErrorFallback } from '../components/UI/ErrorBoundaryFallback';

export default function Root() {
	return (
		<>
			<div className="main-container">
				<nav className="main-nav">
					<NavBar />
				</nav>
				<div className="main-content">
					<ErrorBoundary FallbackComponent={FullPageErrorFallback}>
					    <Outlet />
                    </ErrorBoundary>
				</div>
                <div>
                    <FooterMain/>
                </div>
			</div>
			<ToastContainer position="top-center" autoClose={6000} hideProgressBar={false} closeOnClick pauseOnHover />
		</>
	);
}
