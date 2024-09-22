import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Footer from './Footer';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import bcrypt from 'bcryptjs';

export default function Login() {
  const navigate = useNavigate();
  const plansOuterRef = useRef(null);

  const [fingerprint, setFingerprint] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userid, setUserid] = useState("");
  const [subs, setSubs]= useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");
  const [isSubscribing, setIsSubscribing] = useState(false);
    const [data, setData] = useState({
        user_email: "",
        user_pass: "",
    })

    const user = {
        user_email : data.user_email,
        user_pass : data.user_pass,
        usrfingerprint : fingerprint,
      }
    
    const handleinp = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
    
        setData((prev)=>{
          return {...prev, [name]:value};
        });
    }


    function scrollToPlansOuter (){
      if (plansOuterRef.current) {
        plansOuterRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    function eyebutton() {
      setShowPassword(prevState => !prevState);
    }


    function handlesubmit(e) {
      e.preventDefault();
      setIsLoading(true)
      console.log("submit button clicked");
  
      fetch("https://filmfairserver.vercel.app/user_signin", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: "include",
      })
      .then((res) => {
        setIsLoading(false);
          if (res.status === 400) {
                  Swal.fire({
                      title: "User Not Found",
                      icon: "warning"
                  });
          }
          else if(res.status === 200){
            return res.json().then(data => {
              const splittoken = data.jwt? data.jwt.split("."): undefined;
              sessionStorage.setItem('FilmFairAccess', splittoken[2]);
              Swal.fire({
                title: "SignedIn Successfully",
                icon: "success"
            });
            navigate("/");
            })
          }
          else if(res.status === 201){
            return res.json().then(data => {
              setUserid(data.userid);
              Swal.fire({
                  title: "Your Subscription Has Expired",
                  text: "Please Subscribe",
                  icon: "warning",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "OK",
              }).then((result) => {
                  if (result.isConfirmed) {
                      setSubs(true);
                      setTimeout(() => {
                        scrollToPlansOuter();
                      }, 400);
                  }
              });
            })
          }
          else if (res.status === 202) { //user only registered not subscribed
            return res.json().then(data => {
              setUserid(data.userid);
              Swal.fire({
                  title: "You Havent Yet Subscribed",
                  text: "Please Subscribe",
                  icon: "warning",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "OK",
              }).then((result) => {
                  if (result.isConfirmed) {
                      setSubs(true);
                      setTimeout(() => {
                        scrollToPlansOuter();
                      }, 400);
                  }
              });
            })
          }
          else if (res.status === 210){
            Swal.fire({
              title: "Cannot Log You in",
              text: "You Have Reached the Maximum Number of Device logins with this Account",
              icon: "info",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
          })
          }
          else {
            Swal.fire({
              title: "Unexpected Response From the Server",
              icon: "error"
          });
          }
        })
      .catch((error) => {
        setIsLoading(false);
          console.error("Error:", error);
          Swal.fire({
              title: "Error",
              text: "An unexpected error occurred. Please try again later.",
              icon: "error"
          });
      });
  }
  


function stripesession(price, usr){
  setIsSubscribing(true);

    const plan={
      plan_id: price,
      usr_id: usr
    }
        fetch("https://filmfairserver.vercel.app/checkout", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(plan),
        })
        .then(res=>res.json())
        .then((data)=>{
            setIsSubscribing(false);
            sessionStorage.setItem('sessionID', data.sesid);
            sessionStorage.setItem('UserFingerprint', fingerprint);
            window.location.href = data.url;
        })
  }

  useEffect(()=>{
    const setFp = async () => {
      const fp = await FingerprintJS.load();

      const { visitorId } = await fp.get();
      console.log(visitorId);
      setFingerprint(visitorId);
    };

    setFp();
  }, [])


    return (
        <div>
            <div style={{backgroundImage: `url("https://assets.nflxext.com/ffe/siteui/vlv3/b85863b0-0609-4dba-8fe8-d0370b25b9ee/fdf508c8-97d0-42fd-a6f9-9bef6bf96934/IN-en-20230731-popsignuptwoweeks-perspective_alpha_website_large.jpg")`, maxWidth: "100vw", backgroundSize: "cover", borderBottom: "2px solid white", borderRadius: "4rem"}}>
                
                <div className='login-content'>
                    <div className='sign-navbar'>
                        <h1 className='login-title'>FilmFair</h1>
                    </div>

                    <form >
                    <div className='signin-inp b'>
                        <div className='inp-box1'>
                            <h1 className='inp-title'>Sign In</h1>
                            <input className='inp-text' type='email' placeholder='Enter Email' name='user_email' value={data.user_email} onChange={handleinp} required/>
                            
                            <div className='pass-div'>
                              <input className='inp-text-pass' type={showPassword ? 'text' : 'password'} placeholder='Password' name='user_pass' value={data.user_pass} onChange={handleinp} required/>{showPassword ? (<FaEyeSlash className="eyebtn" size={25} onClick={eyebutton} />) : (<FaEye className="eyebtn" size={25} onClick={eyebutton} />)}
                              </div>
                            
                            <button className='inp-submit' type='submit' onClick={(e) => handlesubmit(e)} disabled={isLoading}>{isLoading ? <ClipLoader color={color} loading={isLoading}
                              size={22}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            /> : "Submit"}</button>
                        <h1 className='already-a-user'>New to FlimFare? <a href='/signup' className='h1-a'>Sign Up Now</a></h1>
                        </div>
                    </div>
                    </form>

                </div>

            </div>

            {subs &&
            <div ref={plansOuterRef} className='plans-outer'>
              <div style={{backgroundImage: `url("https://assets.nflxext.com/ffe/siteui/vlv3/b85863b0-0609-4dba-8fe8-d0370b25b9ee/fdf508c8-97d0-42fd-a6f9-9bef6bf96934/IN-en-20230731-popsignuptwoweeks-perspective_alpha_website_large.jpg")`, maxWidth: "100vw", backgroundSize: "cover", padding: "4rem", borderTop: "2px solid white", borderBottom: "2px solid white", borderRadius: "4rem"}}>

                <div className='plans-inner'>
                  <h1 className="subs-title">Please Subscribe to <div className='signup-n'><h1 className='signup-substitle'>FilmFair</h1></div></h1>
                  <h1 className='choose-plan-text'>Choose a Plan To Continue</h1>
                    <div className='plan-card'>
                      <div className='planbox'>
                          <h1 className='plan-name'>FilmFair Premium Tier</h1>
                          <h1 className='plan-desc'>Premium Tier provides users access to Latest Movies, Trailers, allows users to Rate & Review movies and also Wishlist their favourite movies. This Tier is valid for a Month. T&C apply
                          <div className='features-box'>
                              <h3 style={{textDecoration:"underline"}}>Features</h3>
                              <h4>Access to Basic Features</h4>
                              <h4>No. of Devices : 4</h4>
                              <h4>Access to FilmFair Stream</h4>
                          </div>
                          </h1>
                          <h1 className='plan-price'>₹99</h1>
                          <button className='plan-btn' onClick={()=>stripesession("price_1Ox7cVSAzab3NSzcNRtstiKb", userid)} disabled={isSubscribing}>Subscribe</button>
                      </div>

                      <div className='planbox'>
                          <h1 className='plan-name'>FilmFair Standard Tier</h1>
                          <h1 className='plan-desc'>Standard Tier provides users access to Latest Movies, Trailers, allows users to Rate & Review movies and also Wishlist their favourite movies. This Tier is valid for a Week. T&C apply
                          <div className='features-box'>
                              <h3 style={{textDecoration:"underline"}}>Features</h3>
                              <h4>Access to Basic Features</h4>
                              <h4>No. of Devices : 2</h4>
                              <h4>Access to FilmFair Stream</h4>
                          </div>
                          </h1>
                          <h1 className='plan-price'>₹49</h1>
                          <button className='plan-btn' onClick={()=>stripesession("price_1Ox7bHSAzab3NSzcgpiBXYhf", userid)} disabled={isSubscribing}>Subscribe</button>
                      </div>

                      <div className='planbox'>
                          <h1 className='plan-name'>FilmFair Basic Tier</h1>
                          <h1 className='plan-desc'>
                          Standard Tier provides users access to Latest Movies, Trailers, allows users to Rate & Review movies and also Wishlist their favourite movies. This Tier is valid for a Week. T&C apply
                            <div className='features-box'>
                              <h3 style={{textDecoration:"underline"}}>Features</h3>
                              <h4>Access to Basic Features</h4>
                              <h4>No. of Devices : 1</h4>
                            </div>
                          </h1>
                          <h1 className='plan-price'>₹9</h1>
                          <button className='plan-btn' onClick={()=>stripesession("price_1Ox7ZtSAzab3NSzcy68QXJxB", userid)} disabled={isSubscribing}>{isSubscribing ? "Loading..." : "Subscribe"}</button>
                      </div>
                    </div>
                </div>
                    <h1 style={{margin:"1.5rem 0 0 0", textAlign:"center"}}>Please Add your Registered Email during Checkout to avoid Discrepancies</h1>

              </div>
                        
            </div>
          }

            <Footer/>
        </div>
    )
}