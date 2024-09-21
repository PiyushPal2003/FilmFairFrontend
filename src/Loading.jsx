import React, { useEffect, useState, useRef } from 'react';
import './home.css';

export default function Loading() {
    
    return (
        <div>
            
            <div className='home-main'>
                
            <div className='loading-navbar'>
                <h1 className='loading-title'>FilmFair</h1>
            </div>

                <div className='carousel'>
                        
                        <div className="slide skeleton" style={{backgroundSize: "cover", backgroundPosition:"center", borderRadius: "0 0 4rem 4rem", backgroundColor:"#2e2e2e"}}>
                            <div className='banner-title' style={{backgroundColor:"#2b1d1d", borderRadius:"4rem", width:"45rem", height:"20rem", margin:"0 0 5rem 0"}}>
                            </div>
                            
                        </div>
                    
                </div>

            <div className="stream-row" style={{ paddingTop: "8rem" }}>
                <h1 className="trendrow-title" style={{width: "30rem", height: "7rem", backgroundColor:"#2e2e2e", borderRadius: "4rem"}}></h1>
                <div className="top-rated-row">
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                </div>

                <h1 className="trendrow-title" style={{width: "30rem", height: "7rem", backgroundColor:"#2e2e2e", borderRadius: "4rem"}}></h1>
                <div className="top-rated-row">
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                </div>

                <h1 className="trendrow-title" style={{width: "30rem", height: "7rem", backgroundColor:"#2e2e2e", borderRadius: "4rem"}}></h1>
                <div className="top-rated-row">
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                </div>

                <h1 className="trendrow-title" style={{width: "30rem", height: "7rem", backgroundColor:"#2e2e2e", borderRadius: "4rem"}}></h1>
                <div className="top-rated-row">
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                    <div className="stream-top-rated-row-poster skeleton" style={{borderRadius: "1.5rem", border: "1px solid white"}}/>
                </div>
            </div>


            </div>
        </div>
    )
}
