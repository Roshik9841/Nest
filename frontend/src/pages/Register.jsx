import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Register = () => {
    const[form,setForm] = useState({name:"",email:"",phone:"",password:""});
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("",form);
        setForm({name:"",email:"",phone:"",password:""})
        
    };
    function handleChange(field,value){
        setForm((prev)=>({...prev,[field]:value}))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                   
                    <div>
                        <label className="font-semibold mb-1 block">Username</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e)=>handleChange("name",e.target.value)}
                            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

             
                    <div>
                        <label className="font-semibold mb-1 block">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e)=>handleChange("email",e.target.value)}
                            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="font-semibold mb-1 block">Phone</label>
                        <input
                            type="number"
                            pattern="\d{10}"
                            value={form.phone}
                            onChange={(e)=>handleChange("phone",e.target.value)}
                            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="font-semibold mb-1 block">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e)=>handleChange("password",e.target.value)}
                            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};
