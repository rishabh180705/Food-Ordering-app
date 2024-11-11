import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import MobileApp from '../../components/mobileApp/MobileApp'

const Home = () => {
    const [category,setCategory] =useState("All");
    
    
return (
    <div>
     <Header/> 
     <ExploreMenu category={category} setCategory={setCategory} />
     <FoodDisplay category={category}/>
     <MobileApp/>
    </div>
  )
}

export default Home
