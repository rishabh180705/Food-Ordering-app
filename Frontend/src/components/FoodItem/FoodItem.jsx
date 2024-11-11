import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/storeContext';

const FoodItem = ({ _id, name, price, description, image }) => {
  const { cartItems, removeFromCart, addToCart } = useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className='food-item-image-container'>
        <img className='food-item-image' src={image} alt={`${name} image`} />
        
        {!cartItems[_id] ? (
          <img className='add' onClick={() => addToCart(_id)} src={assets.add_icon_green} alt="Add item" />
        ) : (
          <div className='food-item-counter'>
            <img onClick={() => removeFromCart(_id)} src={assets.remove_icon_red} alt="Remove item" />
            <p>{cartItems[_id]}</p>
            <img onClick={() => addToCart(_id)} src={assets.add_icon_green} alt="Add more item" />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating stars" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
