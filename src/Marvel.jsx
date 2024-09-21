import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import Loading from "./Loading";
import { useDispatch, useSelector } from 'react-redux';
import './disney.css';

export default function Marvel() {
    const[show, setShow] = useState(false);
    const [aloading, setLoading] = useState(true);
    const { apidt, loading, error } = useSelector((state) => state.api);
    const [data, setData] = useState({
      cenematic_universe: [],
      universe_phase3: [],
      universe_phase4: [],
    })

    function fetchdata(){
        console.log("Fetching Pixar Data From Redux");
        const MarvelCenematicUniverse = apidt.filter(item => item.cat === "Marvel Cenematic Universe");
        const MarvelUniversePhase3 = apidt.filter(item => item.cat === "Marvel Universe Phase3");
        const MarvelUniversePhase4 = apidt.filter(item => item.cat === "Marvel Universe Phase4");
        setData({
            cenematic_universe: MarvelCenematicUniverse,
            universe_phase3: MarvelUniversePhase3,
            universe_phase4: MarvelUniversePhase4,
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
              <video className={`studio-banner ${show && 'dark'}`} loop autoplay="true"><source src="https://img10.hotstar.com/video/upload/sources/r1/cms/animations/1on5cf_1587393232549" type="video/mp4"/></video>
              <div className='fade'>
              </div>
          </div>
          <div>
              <div style={{color: "white", position: "absolute", top: "40rem", maxWidth: "100%"}}>
                <div className="disney-top">
                  <h1 className="trendrow-title">Marvel Cenematic Universe</h1>
                  <div className="top-rated-row">
                    {data.cenematic_universe.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" loading="lazy" key={key} src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
                <div className="disney-top">
                  <h1 className="trendrow-title">Marvel Universe Phase3</h1>
                  <div className="top-rated-row">
                    {data.universe_phase3.map((ele, key)=>(
                    <Link to={`/details/${ele?._id}`}><img className="disney-row-poster" key={key} src={`${ele?.poster}` } /></Link>
                    ))}
  
                  </div>
                </div>
  
                <div className="disney-top">
                  <h1 className="trendrow-title">Marvel Universe Phase4</h1>
                  <div className="top-rated-row">
                    {data.universe_phase4.map((ele, key)=>(
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