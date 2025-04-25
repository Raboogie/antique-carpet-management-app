import {ChangeEvent, FormEvent, useState} from "react";
import {createUser} from "../lib/firebase/Authentication/EmailAndPasswordAuth.ts";
import {useNavigate} from "react-router";
import "../Css/pages/SignUp.css";


const  SignUp= () => {
    const [formSignUpData, setFormSignUpData] = useState({
        name: '',
        email: '',
        password: ''
    });
    let navigate = useNavigate();

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormSignUpData({
            ...formSignUpData,
            [name]: value
        })
    }

    const handleSignUpSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formSignUpData);

        if(formSignUpData.name !== null && formSignUpData.email !== null) {
            createUser(formSignUpData.email, formSignUpData.password).then( (result) => {
                console.log(result);
                if(result) {
                    navigate("/login");
                } else {
                    //todo - use a generic error or find a way to display specific errors returned from firebase.
                    alert("Email already exists");
                }
            });
        } else {
            alert("Invalid name or password");
        }
    }
    return (
        <>
            <section className="signUpSection">
                <div className={"SignUpContainer"}>
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSignUpSubmit}>
                        <label>Name</label>
                        <input onChange={handleOnChange} name="name" type="text"/>

                        <label>Email</label>
                        <input onChange={handleOnChange} name="email" type="email"/>

                        <label>Password</label>
                        <input onChange={handleOnChange} name="password" type="password"/>

                        <button className="btnContainer" type="submit">Sign Up</button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default SignUp;
