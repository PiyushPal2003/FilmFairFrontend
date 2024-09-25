import React, { useEffect, useState, useRef } from 'react';
import './home.css';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import {BsArrowLeftCircleFill, BsArrowRightCircleFill} from 'react-icons/bs';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { RxCross1 } from "react-icons/rx";
import StreamRow from './StreamRow';
import Loading from './Loading';
import { useDispatch, useSelector } from 'react-redux';
import { fetchdt } from './features/apiSlice'
import { updateAuth, updateFingerprint, fetchprofile } from './features/profileSlice';


export default function Home() {

    const { apidt, loading, error } = useSelector((state) => state.api);
    const { profile, auth, CurrentUserFingerprint } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const [banner, setBanner] = useState([]);
    const [slide, setSlide] = useState(0);
    const planameRef = useRef(null);
    const [aloading, setLoading] = useState(true);

    function truncate(string, n){
        return string?.length>n ? string.substr(0, n-1) + '...' :string;
    }

    const nextSlide = ()=>{
        setSlide(slide === banner.length-1 ? 0: slide+1);
    }

    const prevSlide = ()=>{
        setSlide(slide === 0 ? banner.length-1 : slide-1);
    }

    const navigate = useNavigate();
    function linkto(id){
        navigate(`/details/${id}`);
    }

    function modeltoggle(){
        document.getElementsByClassName("payment-status")[0].style.display="none";
    }

    function fetchdata() {
        if (apidt.length > 0) {
            const shuffledData = apidt.slice().sort(() => Math.random() - 0.5); // Make a copy of apidt before sorting
            const randomSubset = shuffledData.slice(0, 5);
            setBanner(randomSubset);
            setLoading(false);
        } else {
            dispatch(fetchdt())
            .then((data)=>{
                const shuffledData = data.payload.slice().sort(() => Math.random() - 0.5); // Make a copy of apidt before sorting
                const randomSubset = shuffledData.slice(0, 5); 
                setBanner(randomSubset);
                setLoading(false);
            })
        }
    }

    function cookieGenerate(){
        const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('FilmFairRefresh='));
        const cookieValue = authCookie ? authCookie.split('=')[1] : undefined;
        const fingerpri = sessionStorage.getItem('UserFingerprint');
        const sessionID = sessionStorage.getItem('sessionID');
        const accessToken = sessionStorage.getItem('FilmFairAccess');

        const splittoken = cookieValue? cookieValue.split("."): undefined;
        let prevhalftoken = splittoken? splittoken[0]+'.'+splittoken[1]: undefined;
        const checktoken = prevhalftoken? prevhalftoken + '.' + accessToken: undefined;

        if(sessionID && !accessToken){ //new user, only sessionID present and no cookie
            fetch('https://filmfairserverr.vercel.app/striperetrieve', {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({sessionID, fingerpri}),
                credentials: "include",
            })
            .then(res=>res.json())
            .then((data)=>{ //data.subscription = UseRef to change the plan type  || when using thr customer portal 
                if(data.status=="paid"){
                    const ab=data;

                        fetch('https://filmfairserverr.vercel.app/generatejwt', {// display payment SUCCESS OR FAILURE
                            method: "POST",
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({sessionID}),
                            credentials: "include",
                            })
                            .then(res=>res.json())
                            .then((data)=>{
                                const token = data.jwt;
                                const split = token.split('.');
                                const expirationDuration = data.expire;
                                const expireDate = new Date(Date.now() + expirationDuration).toUTCString();
                                document.cookie = `FilmFairRefresh=${token}; expires=${expireDate}; secure; samesite=Strict; path=/`;
        
                                if(Object.keys(profile).length === 0){
                                    dispatch(fetchprofile(data.jwt))
                                    .then((data)=>{
                                        dispatch(updateFingerprint(fingerpri))
                                    })
                                }
                                planameRef.current.innerText = ab.subscription;
                                sessionStorage.setItem('FilmFairAccess', split[2]);
                                
                                document.getElementsByClassName("payment-status")[0].style.display="flex";
                                document.getElementsByClassName("pay-st-content-success")[0].style.display="flex";
                            })
                }
                else if(data.status=="unpaid"){
                    document.getElementsByClassName("payment-status")[0].style.display="flex";
                    document.getElementsByClassName("pay-st-content-fail")[0].style.display="flex";
                }
            })
        }
        else if(authCookie && !accessToken){
            fetch("https://filmfairserverr.vercel.app/verifyjwt", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookieValue}`
                },
                body: JSON.stringify()
            }).then((res)=>{
                if(res.ok){
                    if(Object.keys(profile).length === 0){
                        fetch("https://filmfairserverr.vercel.app/getuser", {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${cookieValue}`
                            },
                        }).then((res)=>{
                            if (res.ok) {
                                const setFp = async () => {
                                    const data = await res.json();
                                    const fp = await FingerprintJS.load();
                                    const { visitorId } = await fp.get();
                                    const id=data._id;
            
                                    fetch('https://filmfairserverr.vercel.app/verifyfingerprint', {
                                      method: "POST",
                                      headers: {
                                        "Content-Type":"application/json" },
                                      body:JSON.stringify({visitorId, id})
                                    }).then((res)=>{
                                      if(res.status==200){
                                        sessionStorage.setItem('FilmFairAccess', splittoken[2]);
                                        dispatch(updateFingerprint(visitorId))
                                        console.log(visitorId);
                                      } else if(res.status==400){
                                        return
                                      }
                                    })
                                };
                                setFp();
                            }
                        })
                    }
                }
            })
        }
        else if (authCookie && accessToken) {
            fetch("https://filmfairserverr.vercel.app/verifyjwt", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${checktoken}`
                },
              }).then((res)=>{
                if(res.ok){
                    if(Object.keys(profile).length === 0){
                        fetch("https://filmfairserverr.vercel.app/getuser", {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${checktoken}`
                            },
                        }).then((res)=>{
                            if (res.ok) {
                                const setFp = async () => {
                                    const data = await res.json();
                                    const fp = await FingerprintJS.load();
                                    const { visitorId } = await fp.get();
                                    const id=data._id;
                  
                                    fetch('https://filmfairserverr.vercel.app/verifyfingerprint', {
                                      method: "POST",
                                      headers: {
                                        "Content-Type":"application/json" },
                                      body:JSON.stringify({visitorId, id})
                                    }).then((res)=>{
                                      if(res.status==200){
                                        dispatch(updateFingerprint(visitorId))
                                        console.log(visitorId);
                                      } else if(res.status==400){
                                        console.log("fingerprint doesnt exist")
                                        return
                                      }
                                    })
                                }
                                setFp();
                            }
                        })
                    }
                }
            })
        }
        else{ // user with nothing
            console.log("Guest User")
        }
    }

    useEffect(()=>{
        if(!auth){
            cookieGenerate();
        }
        fetchdata();
    }, [])

    
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [slide, banner]);

    
    return (
        <div>
            {aloading ? (<>
                <Loading/> 
            </>
            ):( 
            <>
            
            <div className='payment-status'>
                    <div className='pay-st-content-fail'>
                        <RxCross1 size={22} style={{cursor: "pointer",position: "relative", padding: "0.5rem", border:"1px solid white",borderRadius: "2rem"}} onClick={modeltoggle}/>
                        <img src='./assets/fail.png' className='success-img' loading='lazy'/>
                        <h2 className='pay-st-1'>Transaction Failed !!</h2>
                        <h5 className='pay-st-2'>Please Contact FilmFair if any Amount has been Debited</h5>
                    </div>


                    <div className='pay-st-content-success'>
                        <RxCross1 size={22} style={{cursor: "pointer",position: "relative", padding: "0.5rem", border:"1px solid white",borderRadius: "2rem"}} onClick={modeltoggle}/>
                        <img src='./assets/success.png' className='success-img' loading='lazy'/>
                        <div className='pay-head'>
                            <div className='model-tit-head'>
                                <h1 className='model-tit'>FlimFair</h1><h2 className='tier-info' ref={planameRef}>Premium</h2>
                            </div>
                        </div>
                        <h2 className='pay-st-1'>Transaction Successfull !!</h2>
                        <h5 className='pay-st-2'>Please Head over to Profile-&gt;Manage Billing  for more Information</h5>
                    </div>
                </div>

            <Navbar />
            
            <div className='home-main'>
                
                <div className='carousel'>
                    <BsArrowLeftCircleFill className='arrow arrow-left' onClick={prevSlide}/>
                    {banner.map((item, idx)=>{
                        return(
                        <div className={slide === idx ? "slide" : "slide slide-hidden"} key={`${item._id}`} style={{backgroundImage: `url(${item?.poster})`, backgroundPosition:"center", backgroundSize:"cover"}}>
                            {/* <img src={item?.poster} style={{ width:"100%", height:"100%", objectFit: "cover", objectPosition:"center"}} onLoad={() => handleImageLoaded(item._id)} onError={() => handleImageLoading(item._id)} /> */}
                            <div className='banner-title'>
                                <h1 className='ban-mov-tit1'>{item?.movies_title}</h1><span className='ban-mov-tit2'>({item?.year})</span>
                                <p className='ban-mov-tit3'>{truncate(`${item?.desc}`, 150)}</p>
                                <button className='banner-play-btn' onClick={()=>linkto(item._id) }>▶ Play Trailer</button>
                            </div>
                            <div className='fade'></div>
                        </div>)
                    })}
                    <BsArrowRightCircleFill className='arrow arrow-right' onClick={nextSlide}/>
                </div>

                <StreamRow />
                
            </div>
            </>)
        }
        </div>
    )
}
