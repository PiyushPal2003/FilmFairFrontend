import { useEffect, useState } from "react";
import './streamrow.css';
import { Link } from 'react-router-dom';
import Topratedrow from "./Topratedrow";
import Actionrow from "./Actionrow";
import Trendrow from "./Trendrow";
import ProdHouses from './ProdHouses';
import Footer from "./Footer";
import { useDispatch, useSelector } from 'react-redux';

export default function StreamRow(){
    const [data, setData] = useState([]);
    const { apidt, loading, error } = useSelector((state) => state.api);
    const [loadingStatus, setLoadingStatus] = useState({});

    function fetchdata(){
        const dt = apidt.filter(item => item.cat === "Short");
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
        <div className="stream-row" style={{ paddingTop: "65rem" }}>
            <h1 className="stream-trendrow-title">Short Films <h1 className="now-stream">Now Streaming</h1></h1>
            <div className="top-rated-row">
                {data.map((ele, key)=>(
                <Link to={`/detail/${ele?._id}`} key={key}><img className={`${loadingStatus[ele?._id] ? 'skeleton' : ''} stream-top-rated-row-poster`} loading="lazy" key={key} src={`${ele?.poster}` } onLoad={() => handleImageLoaded(ele._id)} onError={() => handleImageLoading(ele._id)} onLoadStart={() => handleImageLoading(ele._id)}/></Link>
                ))}

            </div>
            <Trendrow apidt={apidt}/>
            <Topratedrow apidt={apidt}/>
            <Actionrow apidt={apidt}/>
            <ProdHouses/>
            <Footer/>
        </div>
     );
}