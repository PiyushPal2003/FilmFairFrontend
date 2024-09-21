import React from "react";
import { FaStripe } from "react-icons/fa6";

import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer">
                <div className="infoText">
                Discover Movies, Watch Trailers, and Share Reviews. Subscribe for Exclusive Streaming and Premium access
                </div>
                <div className="infoText1"> 
                    Powered By <FaStripe className="FaStripe"/>
                </div>

            <div className='footer-logo'>
                <h1 className='footer-logo-title'>FlimFair</h1>
            </div>
        </footer>
    );
};

export default Footer;