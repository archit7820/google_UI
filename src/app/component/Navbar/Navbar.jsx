import React from 'react'
import "./navbar.scss"

//  <div className="search_lab_img"><img className='' src = "./sdfsdf.svg"  alt = "" /></div>
// 
const Navbar = () => {
  return (
    <div className='navbar_container'>
    
        <div className="left_options">

        <div className="text_options">
       <div  className="email_page"
    onClick={() => window.location.href = 'https://mail.google.com/mail/mu/mp/512/'}
    style={{ cursor: 'pointer' }} >Gmail</div>
              <div
    className="image_page"
    onClick={() => window.location.href = 'https://www.google.com/imghp?hl=en&tab=ri&ogbl'}
    style={{ cursor: 'pointer' }} 
  >Images</div>
            </div>

          <div className="img_section_navbar">
          <div className="google_app_img"><img className='app_img' src = "./apps_24dp_808080_FILL0_wght400_GRAD0_opsz24.svg" /></div>  
          <div className="account_img"><img className='accont_name' src = "/profile.jpg"  alt = "" /></div>
          </div>


       

        </div>
    </div>
  )
}

export default Navbar

