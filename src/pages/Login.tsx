import '../Css/pages/Login.css';
import { loginWithEmailAndPassword } from "../lib/firebase/Authentication/EmailAndPasswordAuth.ts";
import { useState } from "react";
import { Link, useNavigate } from "react-router";


const Login = () => {
	const [formData, setFormData] = useState<{ email: string; password: string }>({
		email: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		loginWithEmailAndPassword(formData.email, formData.password).then((r) => {
			if (r) {
				navigate("/search");
			} else {
				setError("Invalid email or password. Please try again.");
			}
		});
	};

	return (
		<div className="auth-page">
			<div className="auth-card">
				<h1>Welcome Back</h1>
				<p className="auth-subtitle">Sign in to your account to continue</p>

				{error && <p className="auth-error">{error}</p>}

				<form className="auth-form" onSubmit={handleSubmit}>
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
							placeholder="Enter your password"
						/>
					</div>

					<button className="auth-submit-btn" type="submit">
						Sign In
					</button>
				</form>

				<p className="auth-footer">
					Don't have an account?
					<Link to="/signup">Sign Up</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
