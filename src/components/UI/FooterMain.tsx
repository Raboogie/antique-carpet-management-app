import "../../Css/UI/FooterMain.css"
import {Link} from "react-router";

export const FooterMain = () => {
    return (
        <footer className="footer-container">
            <div className="footer-items">
                <Link to={'/login'}>Admin login</Link>
                <p className="max-w-[1200px] mx-auto text-right mt-2 mb-12 text-sm text-gray-500">
                    © 2024 Chaman Antique Carpets | All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};
