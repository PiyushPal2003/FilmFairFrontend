import React, { useEffect, useState, useRef } from 'react';
import './profile.css';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updateFingerprint, updateAuth } from './features/profileSlice';
import Navbar from './Navbar';
import { CgInfo } from "react-icons/cg";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function Profile() {
    const [data, setData] = useState({});
    const { profile, auth, CurrentUserFingerprint} = useSelector((state) => state.profile);
    const planameRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let cookieValue;

    function authstatus() {
      const accessToken = sessionStorage.getItem('FilmFairAccess');
      const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('FilmFairRefresh='));
      cookieValue = authCookie ? authCookie.split('=')[1] : undefined;

      const splittoken = cookieValue? cookieValue.split("."): undefined;
      const prevhalftoken = splittoken? splittoken[0]+'.'+splittoken[1]: undefined;
      const checktoken = prevhalftoken? prevhalftoken + '.' + accessToken: undefined;

      if (!authCookie) {
          console.log("Unauthorized");
          document.getElementsByClassName("profile-status")[0].style.display="flex";
          document.getElementsByClassName("profile-model")[0].style.display="flex";
          return false;
      } else if (!accessToken && authCookie) {
          fetch("https://filmfairserverr.vercel.app/verifyjwt", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookieValue}`
            },
            body: JSON.stringify()
          }).then((res)=>{
            if(!res.ok){
                console.log("Unauthorized")
                document.getElementsByClassName("profile-status")[0].style.display="flex";
                document.getElementsByClassName("profile-model")[0].style.display="flex";
                return false;
            } else{
              fetch("https://filmfairserverr.vercel.app/getuser", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookieValue}`
                },
              })
              .then(res=>res.json())
              .then((data) => {

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
                        setData(data);
                        sessionStorage.setItem('FilmFairAccess', splittoken[2]);
                        dispatch(updateProfile({status:200, data}))
                        dispatch(updateFingerprint(visitorId))
                        console.log(visitorId);
                      } else if(res.status==400){
                        document.getElementsByClassName("profile-status")[0].style.display="flex";
                        document.getElementsByClassName("profile-model")[0].style.display="flex";
                        return false;
                      }
                    })
                  }
                  setFp();

                  if(data.Subscription.amtPaid==900){
                    planameRef.current.innerText = 'Basic';
                    document.getElementById("features1").setAttribute("style","display:inline-block;")
                  } else if(data.Subscription.amtPaid==4900){
                    planameRef.current.innerText = 'Standard';
                    document.getElementById("features2").setAttribute("style","display:inline-block;")
                  } else if(data.Subscription.amtPaid==9900){
                    planameRef.current.innerText = 'Premium';
                    document.getElementById("features3").setAttribute("style","display:inline-block;")
                  }
                  return true;
                })
                .catch((error) => {
                  console.log("Error fetching profile::", error);
                });
            }
          })
      } else if (accessToken && authCookie) {
          fetch("https://filmfairserverr.vercel.app/getuser", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${checktoken}`
            },
          })
          .then(res=>res.json())
          .then((data) => {

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
                  setData(data);
                  dispatch(updateProfile({status:200, data}))
                  dispatch(updateFingerprint(visitorId))
                  console.log(visitorId);
                } else if(res.status==400){
                  document.getElementsByClassName("profile-status")[0].style.display="flex";
                  document.getElementsByClassName("profile-model")[0].style.display="flex";
                  return false;
                }
              })
            }
            setFp();

            if(data.Subscription.amtPaid==900){
              planameRef.current.innerText = 'Basic';
              document.getElementById("features1").setAttribute("style","display:inline-block;")
            } else if(data.Subscription.amtPaid==4900){
              planameRef.current.innerText = 'Standard';
              document.getElementById("features2").setAttribute("style","display:inline-block;")
            } else if(data.Subscription.amtPaid==9900){
              planameRef.current.innerText = 'Premium';
              document.getElementById("features3").setAttribute("style","display:inline-block;")
            }

            return true;
          })
      }
  }

  function signout(){
    document.cookie = 'FilmFairRefresh' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    if (sessionStorage.getItem('FilmFairAccess')) {
      sessionStorage.removeItem('FilmFairAccess'); }
    if (sessionStorage.getItem('sessionID')) {
      sessionStorage.removeItem('sessionID'); }
      
      fetch("https://filmfairserverr.vercel.app/logoutuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
          body: JSON.stringify({id: profile.data._id, fingerprint: CurrentUserFingerprint})
        })
        
      dispatch(updateFingerprint(null))
      dispatch(updateAuth())
      navigate('/signin')
  }

    function customerprotal(custID){
      if (!custID) {
        console.error("Customer ID is not defined");
        return;
        }
          fetch("https://filmfairserverr.vercel.app/customer-portal", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'},
            body: JSON.stringify({custID:custID}),
           })
          .then(res=>res.json())
          .then((data)=>{
              window.location.href = data.url; 
            })
    }



    useEffect(() => {
      if(!auth){
        if(authstatus()){
        } else{
        }
      }
      else if(auth){
        setData(profile.data);

        if(profile.data.Subscription.amtPaid==900){
          planameRef.current.innerText = 'Basic';
          document.getElementById("features1").setAttribute("style","display:inline-block;")
        } else if(profile.data.Subscription.amtPaid==4900){
          planameRef.current.innerText = 'Standard';
          document.getElementById("features2").setAttribute("style","display:inline-block;")
        } else if(profile.data.Subscription.amtPaid==9900){
          planameRef.current.innerText = 'Premium';
          document.getElementById("features3").setAttribute("style","display:inline-block;")
        }
      }
  }, [dispatch, profile]);

  return (
    <div style={{display:"flex", flexDirection:"column", height:"100vh"}}>
        <div className='profile-status'>
          <div className='profile-model'>
            <CgInfo size={50} style={{margin: "0 0 1.5rem 0"}}/>
            <h1 style={{color: "white"}}>It Seems You Dont Have An Active Plan</h1>
            <h2 style={{margin: "1.5rem 0 1.5rem 0"}}>Please Purchase a Plan to Continue</h2>
            <div className='model-tit-head'>
              <h1 className='model-tit'>FlimFair</h1>
            </div>
          </div>
        </div>

      <Navbar/>
      
        <div className='profile-content'>
          <div style={{display:"flex", justifyContent:"space-between"}}>
            <div>
              <h1 className='mydetails' >Hi, {`${Object.keys(data).length > 0 ? data.UserNAME : 'User'}`}</h1>
              <h1 className='mydetails1' >Hope you are enjoying your day with FlimFair 🤗</h1>
              <br/>
              <br/>
              <h1 className='mydetails2' >UserId: {`${data?._id}`}</h1>
            </div>
            <div>
              <button className='profile-signin-btn' onClick={()=>{signout();}}>SignOut</button> 
            </div>
          </div>

          
        

        <div className='subs-info'>
          <h1 className='subs-info-head'>Current Subscription</h1>

          <div className='subs-content'>
            {/* <h1 style={{color: "white"}}>Hello</h1> */}
              <div className='model-tit-h'>
                <h1 className='model-t'>FlimFair</h1><h2 className='tier-i' ref={planameRef}>Premium</h2>
              </div>
              <div className='features' id='features1'>
                <h1 className='subs-content-dt'>Features</h1>
                <h1>Access to Basic Features</h1>
                <h1>No. of Devices Allowed: 1</h1>
              </div>
              <div className='features' id='features2'>
                <h1 className='subs-content-dt'>Features</h1>
                <h1>Access to Basic Features</h1>
                <h1>No. of Devices Allowed: 2</h1>
                <h1>Access to FilmFair Stream</h1>
              </div>
              <div className='features' id='features3'>
                <h1 className='subs-content-dt'>Features</h1>
                <h1>Access to Basic Features</h1>
                <h1>No. of Devices Allowed: 4</h1>
                <h1>Access to FilmFair Stream</h1>
              </div>
              <h1 className='subs-content-dt'>Expires: {data.Subscription?.endDate}</h1>
          <button className='download-invoice' onClick={()=>window.location.href= data?.Subscription.invoiceUrl}>Download Invoice</button>
          <button type="submit" className='manage-billing' onClick={()=>customerprotal(data.Subscription?.custID)}>Manage Billing</button>
          </div>

          <h1 className='device-count-text'>No. of Devices Logged In with this Account: {data.Devices?.length || 1}</h1>
        </div>
        </div>
        <Footer/>
    </div>
  )
}
