import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './search.css';
import { FaSearch } from "react-icons/fa";
import { BiInfoCircle } from "react-icons/bi";
import { CgInfo } from "react-icons/cg";
// import { useDispatch, useSelector } from 'react-redux';
// import { updateAuth, updateFingerprint, fetchprofile } from './features/profileSlice';
import Navbar from './Navbar';
import Footer from './Footer';

function Search() {
    const [query, setQuery] = useState("xyz");
    const [data, setData] = useState([]);
    const [oops, setOops] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    // const dispatch = useDispatch();
    // const { profile, auth } = useSelector((state) => state.profile);
    const [loadingStatus, setLoadingStatus] = useState({});

    //let cookieValue;

    function fetchdata(){
            fetch(`https://filmfairserver.vercel.app/api?search=${query}`)
            .then((res)=>res.json())
            .then((dt)=> {
                setData(dt);
                if(query=="xyz"){
                    setOops(false);
                }else setOops(true);
            })
    }

    // function authstatus(){
    //     let accessToken = sessionStorage.getItem('FilmFairAccess');
    //     const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('FilmFairRefresh='));
    //     cookieValue = authCookie ? authCookie.split('=')[1] : undefined;

    //     const splittoken = cookieValue? cookieValue.split("."): undefined;
    //     const prevhalftoken = splittoken? splittoken[0]+'.'+splittoken[1]: undefined;
    //     const checktoken = prevhalftoken? prevhalftoken + '.' + accessToken: undefined;

    //     if(!authCookie){
    //         console.log("Unauthorized")
    //         document.getElementsByClassName("search-status")[0].style.display="flex";
    //         document.getElementsByClassName("search-model")[0].style.display="flex";
    //     }
    //     else if(!accessToken && authCookie){
    //         fetch("https://filmfairserver.vercel.app/verifyjwt", {
    //             method: 'POST',
    //             headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${cookieValue}`
    //             },
    //             body: JSON.stringify()
    //         }).then((res)=>{
    //             if(!res.ok){
    //                 console.log("Unauthorized")
    //                 document.getElementsByClassName("search-status")[0].style.display="flex";
    //                 document.getElementsByClassName("search-model")[0].style.display="flex";
    //             } else{
    //                 if(Object.keys(profile).length === 0){
    //                     dispatch(fetchprofile(cookieValue))
    //                     .then((res)=>{
    //                         if (res.meta.requestStatus === 'fulfilled') {
    //                             const setFp = async () => {
    //                                 const fp = await FingerprintJS.load();
    //                                 const { visitorId } = await fp.get();
    //                                 const id=res.payload.data._id;
            
    //                                 fetch('https://filmfairserver.vercel.app/verifyfingerprint', {
    //                                   method: "POST",
    //                                   headers: {
    //                                     "Content-Type":"application/json" },
    //                                   body:JSON.stringify({visitorId, id})
    //                                 }).then((res)=>{
    //                                   if(res.status==200){
    //                                     sessionStorage.setItem('FilmFairAccess', splittoken[2]);
    //                                     dispatch(updateFingerprint(visitorId))
    //                                     console.log(visitorId);
    //                                   } else if(res.status==400){
    //                                     document.getElementsByClassName("search-status")[0].style.display="flex";
    //                                     document.getElementsByClassName("search-model")[0].style.display="flex";
    //                                     dispatch(updateAuth())
    //                                     return
    //                                   }
    //                                 })
    //                             };
    //                             setFp();
    //                         }
    //                     })}
    //             }
    //         })

    //     }
    //     else if(accessToken && authCookie){
    //         fetch("https://filmfairserver.vercel.app/verifyjwt", {
    //             method: 'POST',
    //             headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${checktoken}`
    //             },
    //           }).then((res)=>{
    //             if(!res.ok){
    //                 document.getElementsByClassName("search-status")[0].style.display="flex";
    //                 document.getElementsByClassName("search-model")[0].style.display="flex";
    //               resolve(false);
    //             } else{
    //                 if(Object.keys(profile).length <= 0){
    //                     dispatch(fetchprofile(checktoken))
    //                     .then((res)=>{
    //                       if (res.meta.requestStatus === 'fulfilled') {
    //                         const setFp = async () => {
    //                             const fp = await FingerprintJS.load();
    //                             const { visitorId } = await fp.get();
    //                             const id=res.payload.data._id;
              
    //                             fetch('https://filmfairserver.vercel.app/verifyfingerprint', {
    //                               method: "POST",
    //                               headers: {
    //                                 "Content-Type":"application/json" },
    //                               body:JSON.stringify({visitorId, id})
    //                             }).then((res)=>{
    //                               if(res.status==200){
    //                                 dispatch(updateFingerprint(visitorId))
    //                                 console.log(visitorId);
    //                               } else if(res.status==400){
    //                                 document.getElementsByClassName("search-status")[0].style.display="flex";
    //                                 document.getElementsByClassName("search-model")[0].style.display="flex";
    //                                 dispatch(updateAuth())
    //                                 resolve(false);
    //                                 return
    //                               }
    //                             })
    //                         }
    //                         setFp();
    //                       }})}
    //             }})
    //     }
    // }

    const handleImageLoaded = (id) => {
        setLoadingStatus((prevState) => ({
            ...prevState,
            [id]: false, // Set image loading state to false once the image is loaded
        }));
      };
      
      const handleImageLoading = (id) => {
          setLoadingStatus((prevState) => ({
              ...prevState,
              [id]: true, // Set image loading state to true when image is loading
          }));
      };


    useEffect(()=>{
        // if(!auth){
        //     authstatus(); }
    }, [])

    useEffect(() => {
        if (timeoutId) {
            clearTimeout(timeoutId); // Clear the previous timeout
        }
    
        const id = setTimeout(() => {
            fetchdata();
        }, 3000);
    
        setTimeoutId(id); // Store the new timeout ID
    }, [query]);
    


  return (
    <div style={{display:"flex", flexDirection:"column", height:"100vh"}}>
        <div className='search-status'>
            <div className='search-model'>
                <CgInfo size={50} style={{margin: "0 0 1.5rem 0"}}/>
                <h1 style={{color: "white"}}>It Seems You Dont Have An Active Plan</h1>
                <h2 style={{margin: "1.5rem 0 1.5rem 0"}}>Please Purchase a Plan to Continue</h2>
                <div className='model-tit-head'>
                    <h1 className='model-tit'>FlimFair</h1>
                </div>
            </div>
        </div>

      <Navbar/>
        <div className='search-head' style={{flex:"1"}}>

        <div className='search-main'>
            <div>
                <h1 className='search-input-outer'><FaSearch size={15}/><input className='search-input' type='text' placeholder='Search for your Favourite Movies' name="search" onChange={(e)=>{
                    if(e.target.value == ""){
                        setQuery("xyz")
                        setOops(false)
                        document.getElementById('skeleton').setAttribute("style","display:none;");
                    } else{
                        setQuery(e.target.value);
                        document.getElementById('skeleton').setAttribute("style","display:inline-block;");
                        }
                    }}/></h1>
            </div>
        </div>
        {oops? (<h1 className='showing-results'>Showing Search Results for {query}</h1>):null}
        <div className='wishes'>
            <div className="wish-row-main">
                <div className="wish-row-poster skeleton" id='skeleton' style={{borderRadius: "1.5rem", border: "1px solid white", display:"none"}}/>
                {data.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`} key={key}><img className={`${loadingStatus[ele?._id] ? 'skeleton' : ''}  wish-row-poster`} loading="lazy" key={key} src={`${ele?.ver_poster}`} 
                    onLoad={() => {
                        handleImageLoaded(ele._id)
                        document.getElementById('skeleton').setAttribute("style","display:none;");
                    }} 
                    onError={() => handleImageLoading(ele._id)} 
                    onLoadStart={() => handleImageLoading(ele._id)} /></Link>
                ))}
            </div>
        </div>

        {oops ? (
            <div className='oops'>
                <BiInfoCircle size={40}/>
                <h1>Couldn't Find your Movie :(</h1>
                <h1>Want to Recommend this Movie Contact FilmFair Now</h1>
            </div>
        )
        : null}

    </div>

        <Footer/>
    </div>
  )
}

export default Search
