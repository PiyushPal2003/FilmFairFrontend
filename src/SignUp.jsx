import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import './SignUp.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import bcrypt from 'bcryptjs';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function SignUp() {
  const navigate = useNavigate();
  const plansOuterRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  let [color, setColor] = useState("#ffffff");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const {register, handleSubmit, formState: { errors }} = useForm()
  
  const [fingerprint, setFingerprint] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userid, setUserid] = useState("");
  const [subs, setSubs]= useState(false);
  const [data, setData] = useState({
    user_name: "",
    user_email: "",
    user_pass: "",
  })

  const user = {
    user_name : data.user_name,
    user_email : data.user_email,
    user_pass : data.user_pass,
  }

  const handleinp= (e)=>{
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


  function handlesubmit(data){
    setIsLoading(true)
    console.log("submit button clicked")
    const hashedpassword = bcrypt.hashSync(data.user_pass, 1);

    const updatedData = {
      ...data,
      user_pass: hashedpassword,
    };
    
    fetch("https://filmfairserverr.vercel.app/user_signup", {
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(updatedData),
    } )
    .then((res)=>res.json())
    .then((data)=>{
      setIsLoading(false);
      if(data.message==="Saved Sucessfully in MongoDB"){
        Swal.fire({
          title: 'Sucessfully SignedUp',
          text: 'Please Select a Plan',
          icon: 'success',
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
        setUserid(data.userid)
      }
      else{
          if(data==="Email Already Registered"){
            Swal.fire({
              title: 'Email Already Registered',
              text: 'Please SignIn to Continue',
              icon: 'info', })  
          }
        }

    })
  }

  function eyebutton() {
    setShowPassword(prevState => !prevState);
  }

  function stripesession(price, usr){
    setIsSubscribing(true);

    const plan={
      plan_id: price,
      usr_id: usr
    }
        fetch("https://filmfairserverr.vercel.app/checkout", {
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
            window.location.href = data.url; })
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
  
              <div className='signup-content'>
                <div className='signup-navbar'>
                      <h1 className='signup-title'>FlimFair</h1>
                      <button type='button' className='signin-btn' onClick={()=> navigate("/signin")}>Sign In</button>
                  </div>
  
                  <div className='signup-banner'>
                  <h1 className='signup-banner1'>Unlimited Movies Trailers, Series, and more</h1>
                  <h1 className='signup-banner2'>Watch anywhere. Cancel anytime.</h1>
                  <h1 className='signup-banner3'>Ready to watch? Register Now!!</h1>

        <form onSubmit={handleSubmit(handlesubmit)}>

          <div className='inp'>
              <div className='inp-box'>
                  <h1 className='inp-title'>Sign up</h1>

                  {/* Name Field */}
                  {errors.user_name && <span>{errors.user_name.message}</span>}
                  <input
                      className='inp-text'
                      type='text'
                      placeholder='Enter Your Name'
                      {...register("user_name", {
                          required: "Enter Atleast 3characters and Atmost 10characters",
                          validate: {
                              validName: value => /^[a-zA-Z]{3,10}(?: [a-zA-Z]{3,10})?$/.test(value) || "Enter Atleast 3characters and Atmost 10characters"
                          }
                      })}
                  />

                  {/* Email Field */}
                  {errors.user_email && <span>{errors.user_email.message}</span>}
                  <input
                      className='inp-text'
                      type='email'
                      placeholder='Enter Email'
                      {...register("user_email", {
                          required: "Enter A Valid Email Address",
                          pattern: {
                              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                              message: "Enter A Valid Email Address"
                          }
                      })}
                  />

                  {/* Password Field */}
                  {errors.user_pass && <p>Password of max 8characters, must start with Uppercase character <br/> must consist of Alphabets, Numbers and Special characters</p>}
                  <div className='pass-div'>
                  <input
                      className='inp-text-pass'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      {...register("user_pass", {
                          required: "Password of max 8characters, must consist of Alphabets, Numbers and Special characters",
                          validate: value =>
                              /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/.test(value) ||
                              "Password of max 8characters, must start with Uppercase character \n must consist of Alphabets, Numbers and Special characters"
                      })}
                  />{showPassword ? (<FaEyeSlash className="eyebtn" size={25} onClick={eyebutton} />
                  ) : (
                    <FaEye className="eyebtn" size={25} onClick={eyebutton} />
                  )}
                  </div>

                  {/* Submit Button */}
                  <button className='inp-submit' type='submit' disabled={isLoading}>
                    {isLoading ? <ClipLoader color={color} loading={isLoading}
                              size={22}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            /> : "Submit"}
                    </button>

                  {/* Sign in link */}
                  <h1 className='already-a-user'>Already a user? <a href='/signin' className='h1-a'>SignIn</a></h1>
              </div>
          </div>
        </form>

      
                  </div>
  
              </div>
  
          </div>

          {subs &&
            <div ref={plansOuterRef} className='plans-outer'>
              <div style={{backgroundImage: `url("https://assets.nflxext.com/ffe/siteui/vlv3/b85863b0-0609-4dba-8fe8-d0370b25b9ee/fdf508c8-97d0-42fd-a6f9-9bef6bf96934/IN-en-20230731-popsignuptwoweeks-perspective_alpha_website_large.jpg")`, maxWidth: "100vw", backgroundSize: "cover", padding: "4rem", borderTop: "2px solid white", borderBottom: "2px solid white", borderRadius: "4rem"}}>
                <div style={{backgroundColor: "#00000066", borderRadius:"4rem"}}>
                <div className='plans-inner'>
                  <h1 className="subs-title">Please Subscribe to <div className='signup-n'><h1 className='signup-substitle'>FlimFair</h1></div></h1>
                  <h1>Choose a Plan To Continue</h1>

                    <div className='plan-card'>
                      <div className='planbox'>
                          <h1 className='plan-name'>FilmFair Premium Tier</h1>
                          <h1 className='plan-desc'>Premium Tier provides users access to Latest Movies, Trailers, allows users to Rate & Review movies and also Wishlist their favourite movies. This Tier is valid for a Month. T&C apply
                          <div className='features-box'>
                              <h3 style={{textDecoration:"underline"}}>Features</h3>
                              <h4>Access to All Features</h4>
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
                              <h4>Access to All Features</h4>
                              <h4>No. of Devices : 2</h4>
                              <h4>Access to FilmFair Stream</h4>
                          </div>
                          </h1>
                          <h1 className='plan-price'>₹49</h1>
                          <button className='plan-btn' onClick={()=>stripesession("price_1Ox7bHSAzab3NSzcgpiBXYhf", userid)} disabled={isSubscribing}>Subscribe</button>
                      </div>

                      <div className='planbox'>
                          <h1 className='plan-name'>FilmFair Basic Tier</h1>
                          <h1 className='plan-desc'>Basic Tier provides users access to Latest Movies, Trailers, allows users to Rate & Review movies and also Wishlist their favourite movies. This Tier is valid for a Day. T&C apply
                          <div className='features-box'>
                              <h3 style={{textDecoration:"underline"}}>Features</h3>
                              <h4>Access to Basic Features</h4>
                              <h4>No. of Devices : 1</h4>
                          </div>
                          </h1>
                          <h1 className='plan-price'>₹9</h1>
                          <button className='plan-btn' onClick={()=>stripesession("price_1Ox7ZtSAzab3NSzcy68QXJxB", userid)} disabled={isSubscribing}>Subscribe</button>
                      </div>
                    </div>
                </div>
                <h1 style={{margin:"1.5rem 0 0 0", textAlign:"center"}}>*Please add your Registered Email during Checkout to avoid Discrepancies*</h1>

              </div>
              </div>
                        
            </div>
          }
      
      <Footer/>
    </div>
  )
}