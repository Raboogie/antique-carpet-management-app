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
	isAuthenticated: boolean;
	setIsAuthenticated: (value: boolean) => void;
	userEmail: string | null;
	setUserEmail: (email: string | null) => void;
	displayName: string;
	setDisplayName: (name: string) => void;
	currentUser: User | null;
	isLoading: boolean;
	signUserOut: () => void;
};

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
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState<string>('');
	const [userEmail, setUserEmail] = useState<string | null>('');
	const [displayName, setDisplayName] = useState<string>('');
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

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
				setIsAuthenticated(false);
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
						setIsAuthenticated(true);
						setIsLoading(false);
					} else {
						// docSnap.data() will be undefined in this case
						console.log('No such document!');
						setIsLoading(false);
					}
				} else {
					setCurrentUser(null);
					setIsLoading(false);
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
		isAuthenticated,
		setIsAuthenticated,
		setUserEmail,
		userEmail,
		displayName,
		setDisplayName,
		currentUser,
		isLoading,
		signUserOut,
	};
	return (
		<UserContext.Provider value={contextValue}>
			{!isLoading && children}
		</UserContext.Provider>
	);
};

export default UserContextProvider;
