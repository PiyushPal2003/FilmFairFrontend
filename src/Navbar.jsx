import { Link } from 'react-router-dom';
import './navbar.css';

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import Typewriter from 'typewriter-effect';
import { FaUserLarge } from "react-icons/fa6";
import { RiHeartAddFill } from "react-icons/ri";
import { FaMasksTheater } from "react-icons/fa6";
import { CgInfo } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';

function Navbar() {
  const [show, setShow] = useState(false);
  const { profile, auth, CurrentUserFingerprint} = useSelector((state) => state.profile);
  const location = useLocation();

  const Navbar= ()=>{
    if(window.scrollY > 100){
      setShow(true);
    } else{
      setShow(false);
    }
  }

  function Hamburger(){
    const menu_btn = document.querySelector('.hamburger');
    const mobile_menu = document.querySelector('.mobile-nav');
    if(menu_btn && mobile_menu){
        menu_btn.addEventListener('click', function(){
            menu_btn.classList.toggle('is-active');
            mobile_menu.classList.toggle('is-active');
          })
    }
  }

  const navigate = useNavigate();
  function Search(id){
      navigate('/search');
  }

  useEffect(()=>{
    window.addEventListener("scroll", Navbar);
    return ()=>window.removeEventListener("scroll", Navbar);
  }, []);

  useEffect(()=>{
    Hamburger();
  }, [])

  return (
      <div>
          <div className={`main ${show && 'black'}`}>
            <div className='main-nav-div'>
                <div className='nav-logo'>
                <Link to={"/"} style={{textDecoration:"none"}}><h1 className='title'>FilmFair</h1></Link>
                </div>
                  
                {location.pathname !== '/search' && (
              <h1 className='search-bar' onClick={()=>Search()}><FaSearch style={{width:"3rem", height:"3rem"}}/><span className='search-span'>Search Movies</span></h1>)}
            <ul className='nav-items'>
              {auth? <li><Link to='/profile'>Profile</Link></li> : <li><Link to='/signup'>SignUp</Link></li>}
              <li><Link to='/wishlist'>Wishlist</Link></li>
              <li><Link to='/genres'>Genres</Link></li>
              <li><Link to='/about'>About</Link></li>
            </ul>
            <button className='hamburger'>
              <div className='bar'></div>
            </button>
          
            </div>
          </div>
          
          <ul className='mobile-nav'>
              {auth? <li><Link to='/profile'><FaUserLarge style={{margin: "0 1.8rem 0 0"}}/>Profile</Link></li> : <li><Link to='/signup'><FaUserLarge style={{margin: "0 1.8rem 0 0"}}/>SignUp</Link></li>}
              <li><Link to='/wishlist'><RiHeartAddFill style={{margin: "0 1.8rem 0 0"}} />Wishlist</Link></li>
              <li><Link to='/genres'><FaMasksTheater style={{margin: "0 1.8rem 0 0"}} />Genres</Link></li>
              <li><Link to='/about'><CgInfo style={{margin: "0 1.8rem 0 0"}} />About</Link></li>
          </ul>

      </div>
  );
}

export default Navbar;
