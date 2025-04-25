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
import UserContextProvider, {UserContextValue} from "./lib/UserContext.tsx";
import {useState} from "react";

const routes = createBrowserRouter(
	createRoutesFromChildren(
		<Route path="/" element={<Root />}>
			<Route index element={<Home />} />
			<Route path="signUp" element={<SignUp />} />
			<Route path="login" element={<Login />} />
			<Route path="search" element={<Search />} />
			<Route path="contact" element={<Contact />} />
		</Route>
	)
);

function App() {
	const [user] = useState<UserContextValue>({
		logUserOut: () => {},
		loggedIn: false,
	})
	return (
		<>
			<UserContextProvider value={user}>
				<RouterProvider router={routes} />
			</UserContextProvider>

		</>
	);
}

export default App;
