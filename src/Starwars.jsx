import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import Loading from "./Loading";
import { useDispatch, useSelector } from 'react-redux';
import './disney.css';

export default function Starwars() {
    const[show, setShow] = useState(false);
    const [aloading, setLoading] = useState(true);
    const { apidt, loading, error } = useSelector((state) => state.api);
    const [data, setData] = useState({
      starwar_series: [],
      starwar_movies: [],
      starwar_shorts: [],
    })

    function fetchdata(){
        console.log("Fetching Pixar Data From Redux");
        const StarWarsSeries = apidt.filter(item => item.cat === "StarWars Series");
        const StarWarsMovies = apidt.filter(item => item.cat === "StarWars Movies");
        const StarWarsShorts = apidt.filter(item => item.cat === "StarWars Shorts");
        setData({
            starwar_series: StarWarsSeries,
            starwar_movies: StarWarsMovies,
            starwar_shorts: StarWarsShorts,
          });
        setLoading(false);
    }
  
  
    const screen= ()=>{
      if(window.scrollY > 100){
        setShow(true);
      } else{
        setShow(false);
      }
    }
  
    
    useEffect(()=>{
      window.addEventListener("scroll", screen);
      return ()=>window.removeEventListener("scroll", screen);
    }, []);
  
    useEffect(()=>{
        fetchdata();
    }, [])
  
    return (
      <div>
        {aloading ? <Loading/> :
            <>
          <Navbar/>
          <div className='studio'>
              <video className={`studio-banner ${show && 'dark'}`} loop autoplay="true"><source src="https://img10.hotstar.com/video/upload/sources/r1/cms/animations/utwmfd_1587393376512" type="video/mp4"/></video>
              <div className='fade'>
              </div>
          </div>
          <div>
              <div style={{color: "white", position: "absolute", top: "40rem", maxWidth: "100%"}}>
                <div className="disney-top">
                  <h1 className="trendrow-title">StarWars Series</h1>
                  <div className="top-rated-row">
                    {data.starwar_series.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" loading="lazy" key={key} src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
                <div className="disney-top">
                  <h1 className="trendrow-title">StarWars Movies</h1>
                  <div className="top-rated-row">
                    {data.starwar_movies.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" key={key} src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
                <div className="disney-top">
                  <h1 className="trendrow-title">StarWars Shorts</h1>
                  <div className="top-rated-row">
                    {data.starwar_shorts.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" key={key} src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
              </div>
              
          </div>
          </>}
      </div>
    )
  }
