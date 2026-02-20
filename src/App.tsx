import {
	createBrowserRouter,
	createRoutesFromChildren,
	Route,
	RouterProvider,
} from 'react-router';
import Root from './pages/Root';
import Home from './pages/Home';
import SignUp from './pages/SignUp.tsx'
import Login from './pages/Login';
import Search from './pages/Search';
import Contact from './pages/Contact';
import CarpetDetail from './pages/CarpetDetail';
import UserContextProvider from "./lib/UserContext.tsx";

const routes = createBrowserRouter(
	createRoutesFromChildren(
		<Route path="/" element={<Root />}>
			<Route index element={<Home />} />
			<Route path="signUp" element={<SignUp />} />
			<Route path="login" element={<Login />} />
			<Route path="search" element={<Search />} />
			<Route path="carpet/:carpetNum" element={<CarpetDetail />} />
			<Route path="contact" element={<Contact />} />
		</Route>
	)
);

function App() {
	return (
		<>
			<UserContextProvider>
				<RouterProvider router={routes} />
			</UserContextProvider>

		</>
	);
}

export default App;
