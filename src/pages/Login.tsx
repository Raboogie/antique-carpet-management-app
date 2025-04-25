import '../Css/pages/Login.css';
import { loginWithEmailAndPassword } from "../lib/firebase/Authentication/EmailAndPasswordAuth.ts";
import {useState} from "react";


const Login = () => {
	const [formData, setFormData] = useState<{email: string, password: string}>({
		email: "",
		password: "",
	});

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loginWithEmailAndPassword(formData.email, formData.password).then(r =>
			console.log(r)
		);
	}
	return (
		<div>
			<section className="login">

				<div className="loginContainer">
					<h1>Login</h1>
					<form onSubmit={handleSubmit}>
						<label>Email</label>
						<input onChange={handleOnChange} name="email" type="email" />

						<label>Password</label>
						<input onChange={handleOnChange} name="password" type="password" />

						<button className="btnContainer" type="submit">Login</button>
					</form>
				</div>
			</section>
		</div>
	);
};
export default Login;
