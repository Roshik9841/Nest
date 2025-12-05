import { useState, useEffect } from "react";
import axios from "axios";
import {Header} from "../components/Header"
import { useParams, useNavigate } from "react-router-dom";

export const AddProduct = () => {
  const { id } = useParams();      // If id exists → Edit mode
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    address: ""
  });

  // Fetch data only in Edit mode
  const fetchProduct = async () => {
    if (id) {
      const res = await axios.get(`http://localhost:5000/api/data/${id}`);
      setForm(res.data);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      // Edit mode
      await axios.put(`http://localhost:5000/api/data/${id}`, form);
    } else {
      // Add mode
      await axios.post("http://localhost:5000/api/data/", form);
    }

    navigate("/view-product");
  };

  return (<>
    <Header/>
    <div className="max-w-6xl mx-auto p-4 m-5 ">
      
      <h2 className="text-xl font-bold mb-4">
        {id ? "Edit Course" : "Add Course"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex max-w-3xl mx-auto flex-col gap-7 bg-gray-200 p-5"
      >
        <div>
          <label className="font-semibold mb-2 block">Name:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border w-1/2 px-4 py-2"
          />
        </div>

        <div>
          <label className="font-semibold mb-2 block">Age:</label>
          <input
            type="text"
            value={form.age}
            onChange={(e) => handleChange("age", e.target.value)}
            className="border w-1/2 px-4 py-2"
          />
        </div>

        <div>
          <label className="font-semibold mb-2 block">Address:</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="border w-1/2 px-4 py-2"
          />
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          {id ? "Update" : "Submit"}
        </button>
      </form>
    </div>
    </>
  );
};
