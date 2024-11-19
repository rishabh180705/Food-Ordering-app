import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [List, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch the list.");
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error("Failed to fetch the food list. Please try again.");
    }
  };

  const toggleStock = async (FoodId) => {
    try {
      const response = await axios.patch(`${url}/api/food/stock`, { id: FoodId });
      if (response.data.success) {
        toast.success(response.data.message || "Stock updated!");
        fetchList(); // Refresh list after successful update
      } else {
        toast.error(response.data.message || "Failed to update stock.");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock. Please try again.");
    }
  };

  const removeFood = async (FoodId) => {
    try {
      const response = await axios.delete(`${url}/api/food/remove`, {
        data: { id: FoodId },
      });
      if (response.data.success) {
        toast.success(response.data.message || "Food item removed.");
        fetchList(); // Refresh list after deletion
      } else {
        toast.error(response.data.message || "Failed to remove food item.");
      }
    } catch (error) {
      console.error("Error removing food item:", error);
      toast.error("Failed to remove food item. Please try again.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Availability</b>
          <b>Action</b>
        </div>
        {List.map((item) => (
          <div key={item._id} className="list-table-format">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}</p>
            <p>
              <button
                onClick={() => toggleStock(item._id)}
                className={item.Availability ? "in-stock" : "out-of-stock"}>
                {item.Availability ? "In Stock" : "Out of Stock"}
              </button>
            </p>
            <p
              onClick={() => removeFood(item._id)}
              style={{ cursor: "pointer", color: "red" }}>
              🗑️
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
