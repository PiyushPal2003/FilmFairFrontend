import React, { useEffect, useState } from 'react';
import './Wishlist.css';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchdt } from './features/apiSlice'
import { updateProfile, updateFingerprint, fetchprofile } from './features/profileSlice';
import { CgInfo } from "react-icons/cg";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Navbar from './Navbar';
import Load from './Load';

export default function Wishlist() {

    const { apidt, loading, error } = useSelector((state) => state.api);
    const { profile, auth } = useSelector((state) => state.profile);
    const dispatch = useDispatch();

    const [name, setName] = useState({});
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    
    let profiledata;
    let apidata;

    let accessToken;
    let authCookie;
    let cookieValue;
    let splittoken;
    let prevhalftoken;
    let checktoken;

    function authstatus(){
        return new Promise((resolve) => {
        
        if(!authCookie){
            console.log("Wishlist:: Unauthorized")
            document.getElementsByClassName("wish-status")[0].style.display="flex";
            document.getElementsByClassName("wish-model")[0].style.display="flex";
            
            resolve(false);
        }
        else if(!accessToken && authCookie){
            fetch("https://filmfairserverr.vercel.app/verifyjwt", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookieValue}`
                },
                body: JSON.stringify()
            }).then((res)=>{
                if(!res.ok){
                    console.log("Wishlist:: Unauthorized")
                    document.getElementsByClassName("wish-status")[0].style.display="flex";
                    document.getElementsByClassName("wish-model")[0].style.display="flex";
                    resolve(false);
                } else{
                    if(apidt.length <= 0){
                        try{
                            const disdata = Promise.all([
                                dispatch(fetchdt()), //0 api
                                fetch("https://filmfairserverr.vercel.app/getuser", {
                                  method: 'POST',
                                  headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${cookieValue}`
                                  },
                                }).then(res=>res.json()) //1 profile
                            ]);
                            disdata.then((data)=>{
                                profiledata=data[1];
                                apidata=data[0].payload;
                                setName(data[1])

                                const setFp = async () => {
                                    const fp = await FingerprintJS.load();
                                    const { visitorId } = await fp.get();
                                    const id = data[1]._id;
                  
                                    fetch('https://filmfairserverr.vercel.app/verifyfingerprint', {
                                      method: "POST",
                                      headers: {
                                        "Content-Type":"application/json" },
                                      body:JSON.stringify({visitorId, id})
                                    }).then((res)=>{
                                      if(res.status==200){
                                        dispatch(updateProfile({status:200, data: data[1]}))
                                        sessionStorage.setItem('FilmFairAccess', splittoken[2]);
                                        dispatch(updateFingerprint(visitorId))
                                        console.log(visitorId);
                                      } else if(res.status==400){
                                        document.getElementsByClassName("wish-status")[0].style.display="flex";
                                        document.getElementsByClassName("wish-model")[0].style.display="flex";
                                        resolve(false);
                                        return
                                      }
                                    })
                                  }
                                setFp();

                                resolve(true);
                            })  
                        }
                        catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    }
                    else if(apidt.length > 0){
                      fetch("https://filmfairserverr.vercel.app/getuser", {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookieValue}`
                        },
                      })
                      .then(res=>res.json())
                        .then((data)=>{
                            profiledata= data;
                            setName(data)
                            const setFp = async () => {
                                const fp = await FingerprintJS.load();
                                const { visitorId } = await fp.get();
                                const id = data._id;
              
                                fetch('https://filmfairserverr.vercel.app/verifyfingerprint', {
                                  method: "POST",
                                  headers: {
                                    "Content-Type":"application/json" },
                                  body:JSON.stringify({visitorId, id})
                                }).then((res)=>{
                                  if(res.status==200){
                                    dispatch(updateProfile({status:200, data}))
                                    sessionStorage.setItem('FilmFairAccess', splittoken[2]);
                                    dispatch(updateFingerprint(visitorId))
                                    console.log(visitorId);
                                  } else if(res.status==400){
                                    document.getElementsByClassName("wish-status")[0].style.display="flex";
                                    document.getElementsByClassName("wish-model")[0].style.display="flex";
                                    resolve(false);
                                    return
                                  }
                                })
                              }
                            setFp();

                            resolve(true);
                        })
                    }
                }
            })
        }
        else if(accessToken && authCookie){
            if(apidt.length <= 0){
                try{
                    const disdata = Promise.all([
                        dispatch(fetchdt()),
                        fetch("https://filmfairserverr.vercel.app/getuser", {
                          method: 'POST',
                          headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${checktoken}`
                          },
                        }).then(res=>res.json())
                    ]);
                    disdata.then((data)=>{
                        profiledata=data[1];
                        apidata=data[0].payload;
                        setName(data[1])

                        const setFp = async () => {
                            const fp = await FingerprintJS.load();
                            const { visitorId } = await fp.get();
                            const id = data[1]._id;
          
                            fetch('https://filmfairserverr.vercel.app/verifyfingerprint', {
                              method: "POST",
                              headers: {
                                "Content-Type":"application/json" },
                              body:JSON.stringify({visitorId, id})
                            }).then((res)=>{
                              if(res.status==200){
                                dispatch(updateProfile({status:200, data: data[1]}))
                                dispatch(updateFingerprint(visitorId))
                                console.log(visitorId);
                              } else if(res.status==400){
                                document.getElementsByClassName("wish-status")[0].style.display="flex";
                                document.getElementsByClassName("wish-model")[0].style.display="flex";
                                resolve(false);
                                return
                              }
                            })
                          }
                        setFp();
                        
                        resolve(true);
                    })  
                }
                catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            else if(apidt.length > 0){
              fetch("https://filmfairserverr.vercel.app/getuser", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${checktoken}`
                },
              })
              .then(res=>res.json())
                .then((data)=>{
                    profiledata=data;
                    setName(data)
                    const setFp = async () => {
                        const fp = await FingerprintJS.load();
                        const { visitorId } = await fp.get();
                        const id = data._id;
      
                        fetch('https://filmfairserverr.vercel.app/verifyfingerprint', {
                          method: "POST",
                          headers: {
                            "Content-Type":"application/json" },
                          body:JSON.stringify({visitorId, id})
                        }).then((res)=>{
                          if(res.status==200){
                            dispatch(updateProfile({status:200, data}))
                            dispatch(updateFingerprint(visitorId))
                            console.log(visitorId);
                          } else if(res.status==400){
                            document.getElementsByClassName("wish-status")[0].style.display="flex";
                            document.getElementsByClassName("wish-model")[0].style.display="flex";
                            resolve(false);
                            return
                          }
                        })
                      }
                    setFp();
                    
                    resolve(true);
                })
            }
        }
        })
    }

    async function fetchdata(){
      if(!auth){
            if(await authstatus()){ //if authstatus() is true that means profile data is has been set
                if(apidt.length > 0){
                    profiledata.Wishlist.forEach((movieId) => {
                        const movie = apidt.find((m) => m._id == movieId);
                        if (movie) {
                          setData(prevData => [...prevData, movie]); // Update state using the state update function
                        }
                    });
                    setLoad(false);
                } 
                else{
                        if (profiledata.Wishlist && apidata.length > 0 ) {
                            profiledata.Wishlist.forEach((movieId) => {
                                const movie = apidata.find((m) => m._id == movieId);
                                if (movie) {
                                setData((prevData) => [...prevData, movie]); // Update state using the state update function
                                }
                            });
                            setLoad(false);
                        } 
                }
            } else{
                console.log("Wishlist:: Unauthorized User") 
            }
          } 
        else if(auth){ //if auth is true that means profile data is already there.
            if(apidt.length > 0){
              dispatch(fetchprofile(cookieValue))
                .then((data)=>{
                // setUsrProfile(data.payload);
                const profiledata=data.payload;
                setName(data.payload.data)

                profiledata.data.Wishlist.forEach((movieId) => {
                    const movie = apidt.find((m) => m._id == movieId);
                    if (movie) {
                      setData(prevData => [...prevData, movie]); // Update state using the state update function
                    }
                });
                setLoad(false);
              })

            } else{
              const disdata = Promise.all([
                dispatch(fetchdt()), //0 api
                dispatch(fetchprofile(cookieValue)), //1 profile
              ]);
              disdata.then((data)=>{
                const profiledata=data[1].payload.data;
                const apidata=data[0].payload;
                setName(data[1].payload.data)
                      profiledata.data.Wishlist.forEach((movieId) => {
                            const movie = apidata.find((m) => m._id == movieId);
                            if (movie) {
                              setData(prevData => [...prevData, movie]); // Update state using the state update function
                            }
                        });
                        setLoad(false);
              })
            }
        }
    }

    useEffect(()=>{
      accessToken = sessionStorage.getItem('FilmFairAccess');
      authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('FilmFairRefresh='));
      cookieValue = authCookie ? authCookie.split('=')[1] : undefined;

      splittoken = cookieValue? cookieValue.split("."): undefined;
      prevhalftoken = splittoken? splittoken[0]+'.'+splittoken[1]: undefined;
      checktoken = prevhalftoken? prevhalftoken + '.' + accessToken: undefined;
        fetchdata();
    }, [dispatch])


    return (
    <div className='wishlist-main'>
      {load? (<>
        
        <div className='wish-status'>
                <div className='wish-model'>
                <CgInfo size={50} style={{margin: "0 0 1.5rem 0"}}/>
                <h1 style={{color: "white"}}>It Seems You Dont Have An Active Plan</h1>
                <h2 style={{margin: "1.5rem 0 1.5rem 0"}}>Please Purchase a Plan to Continue</h2>
                <div className='model-tit-head'>
                    <h1 className='model-tit'>FlimFair</h1>
                </div>
                </div>
            </div>
        <Load/>

      </>):(<>
            <div className='wish-status'>
                <div className='wish-model'>
                <CgInfo size={50} style={{margin: "0 0 1.5rem 0"}}/>
                <h1 style={{color: "white"}}>It Seems You Dont Have An Active Plan</h1>
                <h2 style={{margin: "1.5rem 0 1.5rem 0"}}>Please Purchase a Plan to Continue</h2>
                <div className='model-tit-head'>
                    <h1 className='model-tit'>FlimFair</h1>
                </div>
                </div>
            </div>
            
        <Navbar/>

                <div className='wishlist-head'>
                    <div>
                        <div>
                        <h1 className='mydetails'>Hi, {`${Object.keys(name).length > 0 ? name.UserNAME : 'User'}`}</h1>
                        <h1 className='mydetails1'>Hope you are enjoying your day with FlimFair 🤗</h1>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <h1 style={{textAlign: 'center', fontSize: "2.3rem"}}>Here's Your Wishlist ❤</h1>

                        <div className='wishes'>
                            <div className="wish-row-main">
                                {data?.map((ele, key)=>(
                                    <Link to={`/details/${ele?._id}`}><img className="wish-row-poster" loading="lazy" key={key} src={`${ele?.ver_poster}` } /></Link>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>

            <Footer />
            </>)
        }
        </div>
    )
}