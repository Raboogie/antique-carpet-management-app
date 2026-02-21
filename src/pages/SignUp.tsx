import { ChangeEvent, FormEvent, useState } from "react";
import { createUser } from "../lib/firebase/Authentication/EmailAndPasswordAuth.ts";
import { Link, useNavigate } from "react-router";
import "../Css/pages/SignUp.css";


const SignUp = () => {
	const [formSignUpData, setFormSignUpData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormSignUpData({
			...formSignUpData,
			[name]: value,
		});
	};

	const handleSignUpSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (formSignUpData.name !== null && formSignUpData.email !== null) {
			createUser(formSignUpData.email, formSignUpData.password).then(
				(result) => {
					if (result) {
						navigate("/login");
					} else {
						setError("An account with this email already exists.");
					}
				}
			);
		} else {
			setError("Please enter a valid name and email.");
		}
	};

	return (
		<div className="auth-page">
			<div className="auth-card">
				<h1>Create Account</h1>
				<p className="auth-subtitle">
					Join us to manage your carpet collection
				</p>

				{error && <p className="auth-error">{error}</p>}

				<form className="auth-form" onSubmit={handleSignUpSubmit}>
					<div className="auth-input-group">
						<label htmlFor="name">Name</label>
						<input
							id="name"
							onChange={handleOnChange}
							name="name"
							type="text"
							placeholder="Enter your full name"
						/>
					</div>

					<div className="auth-input-group">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							onChange={handleOnChange}
							name="email"
							type="email"
							placeholder="Enter your email"
						/>
					</div>

					<div className="auth-input-group">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							onChange={handleOnChange}
							name="password"
							type="password"
							placeholder="Create a password"
						/>
					</div>

					<button className="auth-submit-btn" type="submit">
						Create Account
					</button>
				</form>

				<p className="auth-footer">
					Already have an account?
					<Link to="/login">Sign In</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
