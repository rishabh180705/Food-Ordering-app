import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {
  const [List, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch the list");
    }
  };

  const removeFood = async (FoodId) => {
    try {
      const response = await axios.delete(`${url}/api/food/remove`, { data: { id: FoodId } });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Fetch the updated list after deletion
      } else {
        toast.error("Error removing food item");
      }
    } catch (error) {
      toast.error("Failed to remove food item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {List.map((item, index) => (
          <div key={item._id} className="list-table-format">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>
            <p onClick={() => removeFood(item._id)} style={{ cursor: 'pointer', color: 'red' }}>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
