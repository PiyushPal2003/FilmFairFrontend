import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './topratedrow.css';
import { useDispatch, useSelector } from 'react-redux';

export default function Topratedrow(){
    const[data, setData] = useState([])
    const { apidt, loading, error } = useSelector((state) => state.api);
    const [loadingStatus, setLoadingStatus] = useState({});

    function fetchdata(){
        const dt = apidt.filter(item => item.cat === "Top Rated Movies");
        setData(dt);
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
        fetchdata();
    }, [apidt])

    return(
        <div className="top-rated">
            <h1 className="trendrow-title">Top Rated Movies</h1>
            <div className="top-rated-row">
                {data.map((ele, key)=>(
                <Link to={`/details/${ele?._id}`} key={key}><img className={`${loadingStatus[ele?._id] ? 'skeleton' : ''} top-rated-row-poster`} loading="lazy" key={key} src={`${ele?.poster}`} onLoad={() => handleImageLoaded(ele._id)} onError={() => handleImageLoading(ele._id)} onLoadStart={() => handleImageLoading(ele._id)} /></Link>
                ))}

            </div>
        </div>
    )
}