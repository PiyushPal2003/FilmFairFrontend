import React, {lazy, useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home';
import Moviedetail from './Moviedetail';
import SignUp from './SignUp';
import SignIn from './SignIn';
import About from './About';
import Wishlist from './Wishlist';
import Profile from './Profile';
import StreamDetail from './StreamDetail';
import Loading from './Loading';
import Load from './Load';
import DetailSkeleton from './DetailSkeleton';

const Disney = lazy(()=>import('./Disney'))
const Genres = lazy(()=>import('./Genres'))
const Marvel = lazy(()=>import('./Marvel'))
const Pixar = lazy(()=>import('./Pixar'))
const Search = lazy(()=>import('./Search'))
const Starwars = lazy(()=>import('./Starwars'))

function Nav() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/signup' element={<SignUp/>} />
          <Route exact path='/signin' element={<SignIn/>} />

          <Route exact path='/search' element={<Search/>} />
          <Route exact path='/genres' element={<Genres/>} />
          <Route exact path='/wishlist' element={<Wishlist/>} />
          <Route exact path='/details/:id' element={<Moviedetail />} />
          <Route exact path='/detail/:id' element={<StreamDetail />} />
          <Route exact path='/profile' element={<Profile/>} />
          <Route exact path='/Disney' element={<Disney/>} />
          <Route exact path='/Pixar' element={<Pixar/>} />
          <Route exact path='/Marvel' element={<Marvel/>} />
          <Route exact path='/StarWars' element={<Starwars/>} />
          <Route exact path='/Loading' element={<Loading/>} />
          <Route exact path='/Load' element={<Load/>} />
          <Route exact path='/about' element={<About/>} />
          <Route exact path='/detailskeleton' element={<DetailSkeleton/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default Nav;