import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {Header} from "../components/Header"

export const ViewProduct = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await axios.get("http://localhost:5000/api/data/");
        setData(res.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/data/${id}`);
        setData(prev => prev.filter(item => item._id !== id));
    };

    return (
        <>
        <Header/>
            <div className="max-w-4xl mx-auto flex justify-between p-4">
                <h1 className="text-2xl font-bold">Courses</h1>
                <Link
                    to="/add-product"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Add Course
                </Link>
            </div>

            {data.map((item) => (
                <div
                    key={item._id}
                    className="max-w-xl mx-auto p-4 m-5 border-b-2 border-gray-300 grid grid-cols-3"
                >
                    <ul>
                        <li>{item.name}</li>
                        <li>{item.age}</li>
                        <li>{item.address}</li>
                    </ul>

                    <Link
                        to={`/add-product/${item._id}`}
                        className="bg-yellow-400 px-3 py-2 rounded-2xl text-center"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-2xl"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </>
    );
};
