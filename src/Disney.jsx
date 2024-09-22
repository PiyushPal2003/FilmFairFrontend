import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useDispatch, useSelector } from 'react-redux';
import Loading from "./Loading";
import './disney.css';

export default function Disney() {
    const[show, setShow] = useState(false);
    const [aloading, setLoading] = useState(true);
    const { apidt, loading, error } = useSelector((state) => state.api);
    const [data, setData] = useState({
      disney_action: [],
      disney_animated: [],
      disney_originals: [],
    })
  
    function fetchdata(){
        const DisneyAction = apidt.filter(item => item.cat === "Disney Action");
        const DisneyAnimated = apidt.filter(item => item.cat === "Disney Animated");
        const DisneyOriginals = apidt.filter(item => item.cat === "Disney Originals");
        setData({
            disney_action: DisneyAction,
            disney_animated: DisneyAnimated,
            disney_originals: DisneyOriginals,
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
              <video className={`studio-banner ${show && 'dark'}`} loop autoplay="true"><source src="https://img10.hotstar.com/video/upload/sources/r1/cms/animations/qh3yh_1587393133132" type="video/mp4"/></video>
              <div className='fade'>
              </div>
          </div>
          <div>
              <div style={{color: "white", position: "absolute", top: "40rem", maxWidth: "100%"}}>
                <div className="disney-top">
                  <h1 className="trendrow-title">Disney Action</h1>
                  <div className="top-rated-row">
                    {data.disney_action.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" loading="lazy" key={key} src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
                <div className="disney-top">
                  <h1 className="trendrow-title">Disney Animated</h1>
                  <div className="top-rated-row">
                    {data.disney_animated.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" key={key} src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
                <div className="disney-top">
                  <h1 className="trendrow-title">Disney Originals</h1>
                  <div className="top-rated-row">
                    {data.disney_originals.map((ele, key)=>(
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