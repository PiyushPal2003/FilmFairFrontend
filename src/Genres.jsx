import React, { useState, useEffect } from 'react';
import { Link, resolvePath } from 'react-router-dom';
import './genres.css';
import Navbar from './Navbar';
import { FaMasksTheater } from "react-icons/fa6";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchdt } from './features/apiSlice';
import { updateAuth, updateFingerprint, fetchprofile } from './features/profileSlice';
import { CgInfo } from "react-icons/cg";

export default function Genres() {

    const dispatch = useDispatch();
    const { apidt, loading, error } = useSelector((state) => state.api);
    const { profile, auth, CurrentUserFingerprint } = useSelector((state) => state.profile);
    const [data, setData]= useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [activeGenre, setActiveGenre] = useState('');
    const [loadingStatus, setLoadingStatus] = useState({});

    function authstatus(){
        return new Promise((resolve)=>{

        let accessToken = sessionStorage.getItem('FilmFairAccess');
        const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('FilmFairRefresh='));
        const cookieValue = authCookie ? authCookie.split('=')[1] : undefined;

        const splittoken = cookieValue? cookieValue.split("."): undefined;
        const prevhalftoken = splittoken? splittoken[0]+'.'+splittoken[1]: undefined;
        const checktoken = prevhalftoken? prevhalftoken + '.' + accessToken: undefined;

        if(!authCookie){
            console.log("Unauthorized")
            document.getElementsByClassName("genres-status")[0].style.display="flex";
            document.getElementsByClassName("genres-model")[0].style.display="flex";
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
                    document.getElementsByClassName("genres-status")[0].style.display="flex";
                    document.getElementsByClassName("genres-model")[0].style.display="flex";
                    resolve(false);
                } else{
                    if(apidt.length <= 0){
                        try{
                            const disdata = Promise.all([
                                dispatch(fetchdt()),
                                fetch("https://filmfairserverr.vercel.app/getuser", {
                                  method: 'POST',
                                  headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${cookieValue}`
                                  },
                              }).then(res=>res.json())
                            ]);
                            disdata.then((data)=>{
                                setData(data[0].payload);
                                setFilteredData(data[0].payload);
                                setActiveGenre("");

                                const setFp = async () => {
                                    const fp = await FingerprintJS.load();
                                    const { visitorId } = await fp.get();
                                    const id = data[1].data._id;
                  
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
                                        document.getElementsByClassName("genres-status")[0].style.display="flex";
                                        document.getElementsByClassName("genres-model")[0].style.display="flex";
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
                                    sessionStorage.setItem('FilmFairAccess', splittoken[2]);
                                    dispatch(updateFingerprint(visitorId))
                                    console.log(visitorId);
                                  } else if(res.status==400){
                                    document.getElementsByClassName("genres-status")[0].style.display="flex";
                                    document.getElementsByClassName("genres-model")[0].style.display="flex";
                                    resolve(false);
                                    return
                                  }
                                })
                              }
                            setFp();

                            resolve(true);
                        })
                        setData(apidt);
                        setFilteredData(apidt);
                        setActiveGenre("");
                    }
                }
            })
        // sessionStorage.setItem('FilmFairAccess', cookieValue);
        // return true;
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
                document.getElementsByClassName("genres-status")[0].style.display="flex";
                document.getElementsByClassName("genres-model")[0].style.display="flex";
                resolve(false);
            } else{
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
                    setData(data[0].payload);
                    setFilteredData(data[0].payload);
                    setActiveGenre("");

                        const setFp = async () => {
                            const fp = await FingerprintJS.load();
                            const { visitorId } = await fp.get();
                            const id = data[1].data._id;
          
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
                                document.getElementsByClassName("genres-status")[0].style.display="flex";
                                document.getElementsByClassName("genres-model")[0].style.display="flex";
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
                            dispatch(updateFingerprint(visitorId))
                            console.log(visitorId);
                          } else if(res.status==400){
                            document.getElementsByClassName("genres-status")[0].style.display="flex";
                            document.getElementsByClassName("genres-model")[0].style.display="flex";
                            resolve(false);
                            return
                          }
                        })
                      }
                    setFp();

                    resolve(true);
                })
                setData(apidt);
                setFilteredData(apidt);
                setActiveGenre("");
            }
          }})
        }
    })
    }

    async function useeffectt(){
        if(!auth){
            if(await authstatus()){
            }else{
            }
        } else if(auth){
            if (apidt.length <= 0) {
                    dispatch(fetchdt())
                    .then((data)=>{
                        setData(data.payload);
                        setFilteredData(data.payload);
                        setActiveGenre("");
                    })
            } else{
                setData(apidt);
                setFilteredData(apidt);
                setActiveGenre("");
            }
        } else{
        }
    }


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
        useeffectt();
    }, [])


    function filterMoviesByGenre(genre) {
        const filteredMovies = data.filter(movie => movie.genre.includes(genre));
        setFilteredData(filteredMovies);
    }

    return (
        <div>
            <div className='genres-status'>
                <div className='genres-model'>
                <CgInfo size={50} style={{margin: "0 0 1.5rem 0"}}/>
                <h1 style={{color: "white"}}>It Seems You Dont Have An Active Plan</h1>
                <h2 style={{margin: "1.5rem 0 1.5rem 0"}}>Please Purchase a Plan to Continue</h2>
                <div className='model-tit-head'>
                    <h1 className='model-tit'>FlimFair</h1>
                </div>
                </div>
            </div>

            <Navbar/>
            <div className='genre-main'>
                <div className='genre-head' style={{backgroundImage: `url("https://assets.nflxext.com/ffe/siteui/vlv3/b85863b0-0609-4dba-8fe8-d0370b25b9ee/fdf508c8-97d0-42fd-a6f9-9bef6bf96934/IN-en-20230731-popsignuptwoweeks-perspective_alpha_website_large.jpg")`}}>
                    <h1 className='genre-title'>Search Movies By Genres<FaMasksTheater size={28}/></h1>
                    <div className='genre-list'>
                        <h1 className={`genre ${activeGenre === 'Action' ? 'activegenre' : ''}`} onClick={() => {filterMoviesByGenre('Action')
                        setActiveGenre("Action")}}>Action</h1>

                        <h1 className={`genre ${activeGenre === 'Drama' ? 'activegenre' : ''}`} onClick={() => {filterMoviesByGenre('Drama')
                        setActiveGenre("Drama")}}>Drama</h1>

                        <h1 className={`genre ${activeGenre === 'Comedy' ? 'activegenre' : ''}`} onClick={() => {filterMoviesByGenre('Comedy')
                        setActiveGenre("Comedy")}}>Comedy</h1>

                        <h1 className={`genre ${activeGenre === 'Thriller' ? 'activegenre' : ''}`} onClick={() => {filterMoviesByGenre('Thriller')
                        setActiveGenre("Thriller")}}>Thriller</h1>

                        <h1 className={`genre ${activeGenre === 'Crime' ? 'activegenre' : ''}`} onClick={() => {filterMoviesByGenre('Crime')
                        setActiveGenre("Crime")}}>Crime</h1>
                        
                        <h1 className={`genre ${activeGenre === 'Adventure' ? 'activegenre' : ''}`} onClick={() => {filterMoviesByGenre('Adventure')
                        setActiveGenre("Adventure")}}>Adventure</h1>

                        <h1 className={`genre ${activeGenre === 'Biography' ? 'activegenre' : ''}`} onClick={() => {filterMoviesByGenre('Biography')
                        setActiveGenre("Biography")}}>Biography</h1>

                        <h1 className={`genre ${activeGenre === 'Family' ? 'activegenre' : ''}`} onClick={() => {filterMoviesByGenre('Family')
                        setActiveGenre("Family")}}>Family</h1>
                    </div>
                </div>

                <h1>Showing Results for {activeGenre} Genre</h1>
                <div className='wishes'>
                    <div className="wish-row-main">
                        {filteredData?.map((ele, key)=>(
                            <Link to={`/details/${ele?._id}`} key={key}><img className={`${loadingStatus[ele?._id] ? 'skeleton' : ''} wish-row-poster`} loading="lazy" key={key} src={`${ele?.ver_poster}`} onLoad={() => handleImageLoaded(ele._id)} onError={() => handleImageLoading(ele._id)} onLoadStart={() => handleImageLoading(ele._id)} /></Link>
                        ))}
                    </div>
                </div>

            </div>
            <Footer/>
        </div>
    )
}
