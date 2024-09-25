import './moviedetail.css';
import React, { useEffect, useState, useRef } from 'react';
import ReactStars from 'react-stars';
import Swal from 'sweetalert2';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Navbar from './Navbar';
import DetailSkeleton from './DetailSkeleton';
import { useParams } from 'react-router-dom';
import { CgInfo } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';
import Footer from './Footer';
import { updateProfile, updateFingerprint, } from './features/profileSlice';

export default function Moviedetail() {

  let {id} = useParams();
  const dispatch = useDispatch();
  const wishButtonRef = useRef(null);
  const { profile, auth, CurrentUserFingerprint} = useSelector((state) => state.profile);
  let usrs;

  const [data, setData]= useState({});
  const [user, setUser] = useState("");
  const [usrreview, setUsrReview] = useState("");
  const [usrrating, setUsrRating] = useState("");
  const [ratedt, setRateDt] = useState([])
  const [load, setLoad] = useState(true);

  function authstatus(){

    return new Promise((resolve)=>{
      
    let accessToken = sessionStorage.getItem('FilmFairAccess');
    const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('FilmFairRefresh='));
    const cookieValue = authCookie ? authCookie.split('=')[1] : undefined;

    const splittoken = cookieValue? cookieValue.split("."): "";
    let prevhalftoken = splittoken[0]+'.'+splittoken[1];
    const checktoken = prevhalftoken + '.' + accessToken;

    if(!authCookie){
        console.log("Unauthorized")
        document.getElementsByClassName("Login-status")[0].style.display="flex";
        document.getElementsByClassName("login-model")[0].style.display="flex";
        
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
                document.getElementsByClassName("Login-status")[0].style.display="flex";
                document.getElementsByClassName("login-model")[0].style.display="flex";
                resolve(false);
            } else{
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
                            dispatch(updateProfile({status:200, data}))
                            sessionStorage.setItem('FilmFairAccess', splittoken[2]);
                            dispatch(updateFingerprint(visitorId))
                            console.log(visitorId);
                          } else if(res.status==400){
                            document.getElementsByClassName("Login-status")[0].style.display = "flex";
                            document.getElementsByClassName("login-model")[0].style.display = "flex";
                            resolve(false);
                            return
                          }
                        })
                      };
                      setFp();
                    resolve(true);
                  } else{
                    document.getElementsByClassName("Login-status")[0].style.display = "flex";
                    document.getElementsByClassName("login-model")[0].style.display = "flex";
                    resolve(false);
                  }
                })
            }
        })
    }
    else if(accessToken && authCookie){
      fetch("https://filmfairserverr.vercel.app/verifyjwt", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${checktoken}`
        },
      }).then((res)=>{
        if(!res.ok){
          document.getElementsByClassName("Login-status")[0].style.display = "flex";
          document.getElementsByClassName("login-model")[0].style.display = "flex";
          resolve(false);
        } else{
          
        if(Object.keys(profile).length <= 0){
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
                      dispatch(updateProfile({status:200, data}))
                      dispatch(updateFingerprint(visitorId))
                      console.log(visitorId);
                    } else if(res.status==400){
                      document.getElementsByClassName("Login-status")[0].style.display = "flex";
                      document.getElementsByClassName("login-model")[0].style.display = "flex";
                      resolve(false);
                      return
                    }
                  })
                }
                setFp();
              resolve(true);
            } else {
              document.getElementsByClassName("Login-status")[0].style.display = "flex";
              document.getElementsByClassName("login-model")[0].style.display = "flex";
              resolve(false);
            }
          })
        }
        else{
          resolve(true);
        }
      }})
    }
  })
  }

  function fetchdata(){
    let accessToken = sessionStorage.getItem('FilmFairAccess');
    const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('FilmFairRefresh='));
    const cookieValue = authCookie ? authCookie.split('=')[1] : undefined;

    const splittoken = cookieValue? cookieValue.split("."): undefined;
    const prevhalftoken = splittoken? splittoken[0]+'.'+splittoken[1]: undefined;
    const checktoken = prevhalftoken? prevhalftoken + '.' + accessToken: undefined;

        fetch("https://filmfairserverr.vercel.app/details", {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            "Authorization": `Bearer ${checktoken}`},
          body: JSON.stringify({id})
        })
        .then((res)=>{
          if(!res.ok){
            console.log("Unauthorized")
            document.getElementsByClassName("Login-status")[0].style.display="flex";
            document.getElementsByClassName("login-model")[0].style.display="flex";
            return false;
          }
          else if(res.ok){
            return res.json();
          }
        })
        .then((dt)=>{
          if(dt=='Movie Doesnt Exist'){
            console.log("Movie Doesnt Exits")
          }
          else if(dt){
            setData(dt?.movie[0]);
            setUser(dt.usr);
            usrs=dt.usr;
            setRateDt(Object.values(dt?.movie[0].ratings))
            setUsrReview(dt?.movie[0].reviews[usrs])
            setUsrRating(dt?.movie[0].ratings[usrs])
            wishliststatus();
            setLoad(false);
          }
        });
  }

  function updatereviewrating(e){
    e.preventDefault();
    
    fetch("https://filmfairserverr.vercel.app/updatereviewrating", {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({id, usrreview, usrrating, user})
    })
    .then(res=>res.json())
    .then(data=>{
      if(data=="Updated Successfully"){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thankyou For Sharing!!",
          showConfirmButton: false,
          timer: 3000
        });
      }
    })
  }

  function wishliststatus(){
    fetch(`https://filmfairserverr.vercel.app/wishlistStatus`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({id, usrs})
    })
    .then(res=>res.json())
    .then(data=>{
      if(data==true){
        wishButtonRef.current.innerHTML = "Remove from Wishlist";
        wishButtonRef.current.addEventListener('click', deleteWishlist);
      } else{
        wishButtonRef.current.innerHTML = "Add to Wishlist +";
        wishButtonRef.current.addEventListener('click', wishlist);
       }
    });
}

function wishlist(){
  fetch("https://filmfairserverr.vercel.app/wishlist", {
    method: "PATCH",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({id, usrs})
  })
  .then(res=>res.json())
  .then((data)=>{
    if(data=='Data added to wishlist'){
      wishButtonRef.current.removeEventListener('click', wishlist);
      console.log(data);
      wishliststatus();
    }
}) }

function deleteWishlist(){
fetch("https://filmfairserverr.vercel.app/deletewish", {
  method: "PATCH",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify({id, usrs})
})
.then(res=>res.json())
.then((data)=>{
  if(data=='Data deleted from wishlist'){
    wishButtonRef.current.removeEventListener('click', deleteWishlist);
    wishliststatus();
  }

})
}

  function reviewchange(e){
    const value = e.target.value;
    setUsrReview(value);
  }

  function ratefunc() {
    const ratedtAsFloats = ratedt.map(ele => parseFloat(ele));
    const sum = ratedtAsFloats.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / ratedtAsFloats.length;
    let roundedAverage = isNaN(average) ? 0 : average.toFixed(1);
    return roundedAverage;
  }

  async function useeffectt(){
    console.log(auth);
      if(!auth){
        if(await authstatus()){
          fetchdata();
        } else{
          console.log("Unauthorised"); }
      }else if(auth){
        fetchdata();
      }
  }

  useEffect(()=>{
    useeffectt();
  }, [])

  return (
    <div>
      {load? (<>
        <div className='Login-status'>
          <div className='login-model'>
            <CgInfo size={50} style={{margin: "0 0 1.5rem 0"}}/>
            <h1 style={{color: "white"}}>It Seems You Dont Have An Active Plan</h1>
            <h2 style={{margin: "1.5rem 0 1.5rem 0"}}>Please Purchase a Plan to Continue</h2>
            <div className='model-tit-head'>
              <h1 className='model-tit'>FilmFair</h1>
            </div>
          </div>
        </div>
        <DetailSkeleton/>
        
      </>
      ):(
      <>

        <div className='Login-status'>
          <div className='login-model'>
            <CgInfo size={50} style={{margin: "0 0 1.5rem 0"}}/>
            <h1 style={{color: "white"}}>It Seems You Dont Have An Active Plan</h1>
            <h2 style={{margin: "1.5rem 0 1.5rem 0"}}>Please Purchase a Plan to Continue</h2>
            <div className='model-tit-head'>
              <h1 className='model-tit'>FilmFair</h1>
            </div>
          </div>
        </div>

      <Navbar/>
        <div>
        <div className="det-banner" style={{backgroundImage: `url(${data?.poster})`}}><div className='fade'></div></div>

      <div className='movie-details'>

        <div className='detail-body'>
        
            <div className='detail-header'>
                <img loading="lazy" src={`${data?.ver_poster}`} className='movdet-verposter'/>
                <div className='detail-header-txt'>
                  <h1 className='det-text' style={{fontSize: "5rem"}}>{`${data?.movies_title}`}</h1>
                  <h1 style={{fontSize: "2.7rem"}} className='det-text'>Year: {`${data?.year}`}</h1>
                  <h1>IMDB Rating: {`${data?.rating}`}/10 ⭐</h1>
                  {(data?.genre)?.map((element, index) => (
                    <span key={index} style={{border: "1px solid white", borderRadius: "1rem", fontSize: "2.6rem", lineHeight: "4rem", padding: "0 0.2rem", margin: "0.8rem 0.9rem 0.8rem 0"}}>{element}</span>
                    ))}
                  <h1>Description: {`${data?.desc}`}</h1>
                  <button ref={wishButtonRef} className='det-text wishlist' id='wish' >Add to WishList +</button>
                </div>
              </div>
          <h1 className='det-text flimfair-users trailer' >Watch the Trailer now🎬</h1>
          <iframe className='ytvid' src={`https://www.youtube.com/embed/${data?.ytlink}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

          <h1 className='det-text flimfair-users' >FilmFair Users Ratings</h1>

          <h1>{ratefunc()}/5 ⭐</h1>

        </div>

        <div className='review'>
          <form>
          <h1 style={{fontSize:"4rem", margin: "2.5rem 0 2rem 0"}}>Share Your Thoughts</h1>
          <h1>Rate it Now</h1><ReactStars
            size={26}
            half={true}
            onChange={(rate)=> setUsrRating(rate)}
            value={usrrating}
          />

          <h1 style={{margin: "1.5rem 0 0 0"}}>Write It Down</h1>
          <textarea type='text' name='usreview' className='usreview' placeholder='Review' value={usrreview} onChange={reviewchange}/>
          <button type='submit' className='review-submit' onClick={(e)=>updatereviewrating(e)}>Share</button> 
          </form>
        </div>

        </div>
        </div>
        <Footer/>
        </>)
      }

      
    </div>
  )
}
