import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { authentication, db } from './firebase/index.ts';
import { doc, getDoc } from 'firebase/firestore';

export type UserContextValue = {
	userId: string;
	setUserId: (id: string) => void;
	userRole: string;
	setUserRole: (role: string) => void;
	signedIn: boolean;
	setSignedIn: (value: boolean) => void;
	userEmail: string | null;
	setUserEmail: (email: string | null) => void;
	displayName: string;
	setDisplayName: (name: string) => void;
	currentUser: User | null;
	loading: boolean;
	signUserOut: () => void;
};
// loggedIn
type userContextProviderProps = {
	children: React.ReactNode;
};

const UserContext = createContext<UserContextValue | null>(null);

export const useUserContext = () => {
	const userCtx = useContext(UserContext);
	if (!userCtx) {
		throw new Error('useUserContext should not be null.');
	}
	return userCtx;
};

const UserContextProvider = ({ children }: userContextProviderProps) => {
	const [userId, setUserId] = useState<string>('');
	const [signedIn, setSignedIn] = useState(false);
	const [userRole, setUserRole] = useState<string>('');
	const [userEmail, setUserEmail] = useState<string | null>('');
	const [displayName, setDisplayName] = useState<string>('');
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const addUserId = (value: string) => {
		setUserId(value);
	};

	const createUserRole = (value: string) => {
		setUserRole(value);
	};

	const createUserEmail = (value: string | null) => {
		setUserEmail(value);
	};

	const createDisplayName = (value: string) => {
		setDisplayName(value);
	};

	const signUserOut = () => {
		signOut(authentication)
			.then(() => {
				setUserId('');
				setUserRole('');
				setUserEmail('');
				setDisplayName('');
				setSignedIn(false);
				console.log('inside firebase async signOut function');
			})
			.catch((error) => {
				console.log('Sign out error occurred: ', error);
			});
		console.log('inside context signUserOut function');
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			authentication,
			async (user: User | null) => {
				if (user) {
					const docRef = doc(db, 'users', user.uid);
					const docSnap = await getDoc(docRef);

					if (docSnap.exists()) {
						console.log('Document data:', docSnap.data().role);
						createUserRole(docSnap.data().role);
						createDisplayName(docSnap.data().displayName);
						setCurrentUser(user);
						addUserId(user.uid);
						createUserEmail(user.email);
						setSignedIn(true);
						setLoading(false);
					} else {
						// docSnap.data() will be undefined in this case
						console.log('No such document!');
						setLoading(false);
					}
				} else {
					setCurrentUser(null);
					setLoading(false);
				}
			}
		);
		return () => unsubscribe();
	}, []);

	const contextValue: UserContextValue = {
		userId,
		setUserId,
		userRole,
		setUserRole,
		signedIn,
		setSignedIn,
		setUserEmail,
		userEmail,
		displayName,
		setDisplayName,
		currentUser,
		loading,
		signUserOut,
	};
	return (
		<UserContext.Provider value={contextValue}>
			{!loading && children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
