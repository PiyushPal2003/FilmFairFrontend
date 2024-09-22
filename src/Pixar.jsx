import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useDispatch, useSelector } from 'react-redux';
import Loading from "./Loading";
import './disney.css';

export default function Pixar() {
    const[show, setShow] = useState(false);
    const [aloading, setLoading] = useState(true);
    const { apidt, loading, error } = useSelector((state) => state.api);
    const [data, setData] = useState({
      pixar_originals: [],
      pixar_movies: [],
      pixar_shorts: [],
    })

    function fetchdata(){
        const PixarOriginals = apidt.filter(item => item.cat === "Pixar Originals");
        const PixarMovies = apidt.filter(item => item.cat === "Pixar Movies");
        const PixarShorts = apidt.filter(item => item.cat === "Pixar Shorts");
        setData({
            pixar_originals: PixarOriginals,
            pixar_movies: PixarMovies,
            pixar_shorts: PixarShorts,
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
              <video className={`studio-banner ${show && 'dark'}`} loop autoplay="true"><source src="https://img10.hotstar.com/video/upload/sources/r1/cms/animations/a6lr0r_1587393331483" type="video/mp4"/></video>
              <div className='fade'>
              </div>
          </div>
          <div>
              <div style={{color: "white", position: "absolute", top: "40rem", maxWidth: "100%"}}>
                <div className="disney-top">
                  <h1 className="trendrow-title">Pixar Originals</h1>
                  <div className="top-rated-row">
                    {data.pixar_originals.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" key={key} loading="lazy" src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
                <div className="disney-top">
                  <h1 className="trendrow-title">Pixar Movies</h1>
                  <div className="top-rated-row">
                    {data.pixar_movies.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" key={key} src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
                <div className="disney-top">
                  <h1 className="trendrow-title">Pixar Shorts</h1>
                  <div className="top-rated-row">
                    {data.pixar_shorts.map((ele, key)=>(
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