import React, { useContext } from 'react';
import "./FoodDisplay.css";
import { StoreContext } from '../../context/storeContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
    const { food_list = [] } = useContext(StoreContext) || {};


  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {food_list?.length > 0 ? (
          food_list.map((item, index) => {
            if ((category === "All" || item.category === category) && item.Availability) {
              return (
                <FoodItem
                  key={index}
                  _id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  description={item.description}
                  veg={item.veg}
                />
              );
            }
          })
        ) : (
          <p>No items available at the moment</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
