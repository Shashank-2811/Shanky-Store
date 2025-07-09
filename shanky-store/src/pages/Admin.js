import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:60/api/product";

const CATEGORY_OPTIONS = [
  "Grocery",
  "Munchies",
  "Vegetables",
  "Personal Care",
  "Home Decor",
  "Other"
];

const Admin = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: ""
  });

  // Define fetchProducts BEFORE useEffect
  const fetchProducts = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts(); // Now this will work
  }, [token, navigate]);

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price)
        })
      });

      if (response.ok) {
        alert("Product added successfully!");
        setNewProduct({
          name: "",
          description: "",
          price: "",
          imageUrl: "",
          category: ""
        });
        fetchProducts(); // Refresh the list
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_URL}/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          alert("Product deleted successfully!");
          fetchProducts(); // Refresh the list
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel - Product Management</h1>
      
      {/* Add Product Form */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ccc" }}>
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
              style={{ width: "300px", padding: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Description: </label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              required
              style={{ width: "300px", padding: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Price (INR): </label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              required
              step="0.01"
              style={{ width: "300px", padding: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Image URL: </label>
            <input
              type="url"
              name="imageUrl"
              value={newProduct.imageUrl}
              onChange={handleInputChange}
              required
              style={{ width: "300px", padding: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Category: </label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              required
              style={{ width: "300px", padding: "5px" }}
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none" }}>
            Add Product
          </button>
        </form>
      </div>

      {/* Products List */}
      <div>
        <h2>Current Products</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Image</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Category</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.description}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{product.price}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.category}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    style={{ 
                      padding: "5px 10px", 
                      backgroundColor: "#dc3545", 
                      color: "white", 
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;