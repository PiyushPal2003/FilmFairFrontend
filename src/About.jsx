import './about.css';
import React from 'react';
import { FaSquareInstagram } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa6";
import { FaReact } from "react-icons/fa";
import { SiExpress } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import { BiLogoMongodb } from "react-icons/bi";
import { SiRedux } from "react-icons/si";
import { SiJsonwebtokens } from "react-icons/si";
import { FaStripe } from "react-icons/fa";
import { IoLogoFirebase } from "react-icons/io5";

export default function About() {
  return (
    <div>
      <div className='about-main-intro'>
        <img className='about-intro-img' src='./assets/Flimfair_logo.png' />
        
        <div className='about-intro-text'>
          <h1 style={{fontSize:"3.5rem"}}>Welcome to FilmFair</h1>
          <h1 style={{fontSize:"2rem"}}>I Hope your experience so far with FilmFair has been a Cake Walk</h1>

          <div className='questions'>
            <h1 style={{textAlign:"center"}}>Hi there FilmFair Users, this is Piyush Pal here, I have developed FilmFair which is an Web Application Developed mimicing the industry Level OTT Platforms. This project tries to implement some of the important features that an Movie/OTT Platform contains & it showcases its working. Dont Forget to use all features of this application and requesting you to please report if you encounter any bugs. ThankYou for Visiting</h1>

            <h1 style={{margin:"4rem 0", textAlign:"center"}}>TechStack</h1>
              <div class="follow" style={{textAlign:"center"}}>
                <a href="#" class="fa"><FaReact size={38}/></a>
                <a href="#" class="fa"><SiExpress size={38} /></a>
                <a href="#" class="fa"><FaNodeJs size={38}/></a>
                <a href="#" class="fa"><BiLogoMongodb size={38}/></a>
                <a href="#" class="fa"><SiRedux size={38}/></a>
                <a href="#" class="fa"><SiJsonwebtokens size={38}/></a>
                <a href="#" class="fa"><FaStripe size={38}/></a>
                <a href="#" class="fa"><IoLogoFirebase size={38}/></a>
              </div>

            <h1 style={{margin:"4rem 0", textAlign:"center"}}>Lets Connect😊</h1>
              <div class="follow" style={{textAlign:"center"}}>
                <a href="https://github.com/PiyushPal2003" class="fa fa-twitter"><IoLogoGithub size={30}/></a>
                <a href="https://www.instagram.com/__piyushpal__/" class="fa fa-instagram"><FaSquareInstagram size={30} /></a>
                <a href="https://www.linkedin.com/in/piyush-pal-52a18722a/" class="fa fa-linkedin"><FaLinkedin size={30}/></a>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
