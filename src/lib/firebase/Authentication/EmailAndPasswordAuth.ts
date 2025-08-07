import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    User
} from "firebase/auth";
import {authentication, db} from "../index.ts";
import {doc, setDoc} from "firebase/firestore";

export const loginWithEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
    try {
        const userCredential = await signInWithEmailAndPassword(authentication, email, password);
        const userResults = userCredential.user;

        if (!userResults.emailVerified) {
            alert("Email verification failed.");
            return false;
        }
        console.log(userResults);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const createUser = async (email: string, password: string): Promise<boolean> => {
    try {
        const userCredentialResults = await createUserWithEmailAndPassword(authentication, email, password);
        const user = userCredentialResults.user;
        // Assign "Basic" role to the new user
        await addUserToDatabase(user, "Basic");
        await sendEmailVerification(user);
        console.log("sent email verification successfully");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Creates a user document in the 'users' collection in Firestore.
 * @param user The user object from Firebase Authentication.
 * @param role The role to assign to the user ('Admin' or 'Basic').
 */
export const addUserToDatabase = async (user: User, role: "Admin" | "Basic") => {
    await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        role: role
    });
}