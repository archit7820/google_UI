import React from "react";
import "./footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      {/* First Section */}
      <div className="footer-section_top">
      <div className="footer-link">India</div>
       
      </div>

      {/* Second Section */}
      <div className="footer-section">
        <div className="footer_section_left">
        <div className="footer-link">Advertising</div>
        <div className="footer-link">Business</div>
        <div className="footer-link">How Search Works</div></div>


        <div className="footer_section_right">
        <div className="footer-link">Privacy</div>
        <div className="footer-link">Terms</div>
        <div className="footer-link">Settings</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
