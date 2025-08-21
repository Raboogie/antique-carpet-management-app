import "../Css/pages/Contact.css"
import {ContactForm} from "../components/UI/ContactForm.tsx";
const Contact = () => {
	return (
		<>
			<div className="contact-container">
				<h1 className="contact-header">Contact Me</h1>
                <ContactForm/>
			</div>
		</>
	);
};
export default Contact;
