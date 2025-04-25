import {signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {authentication} from "../index.ts";

export const loginWithEmailAndPassword = async (email: string, password: string) => {
    // try {
    //     const userCredential =  signInWithEmailAndPassword(authentication, email, password);
    //     const userResults = userCredential.user;
    //
    //     if (!userResults.emailVerified) {
    //         alert("Email verification failed.");
    //     }
    //     console.log(userResults);
    // } catch (error) {
    //     console.error(error);
    // }
}

    // signInWithEmailAndPassword(authentication,email, password).then(user => {
    //     if (user) {
    //         console.log(user);
    //     } else {
    //         console.log("Sign in failed");
    //     }
    // })

export const createUser = async (email: string, password: string): Promise<boolean> => {
    try {
        const userCredentialResults = await createUserWithEmailAndPassword(authentication, email, password);
        const user = userCredentialResults.user;
        await sendEmailVerification(user);
        console.log("sending email verification successfully");
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}