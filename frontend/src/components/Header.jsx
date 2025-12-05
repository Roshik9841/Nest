import {Link} from 'react-router-dom'
import { useNavigate,useLocation} from 'react-router-dom'
export const Header = ()=>{
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboard = location.pathname==='/dashboard'
    return(
        <header className="bg-gradient-to-b from-[#293143] via-[#373F4F] to-[#444C5C]  w-full  px-4 py-6 flex justify-between  items-center text-white">
            <p className="text-3xl font-semibold">
                Admin Dashboard
            </p>
            <div className="flex space-x-7  items-center pr-4">
              {isDashboard?<p className="font-semibold text-lg">Welcome, admin</p>:
              <button type="submit" className="border rounded-4xl px-5 py-2 cursor-pointer hover:bg-[#66707b]" onClick={()=>navigate('/dashboard')}>Dashboard</button>}
                <button type="submit" className="border rounded-4xl px-5 py-2 cursor-pointer hover:bg-[#66707b]" onClick={()=>navigate('/login')}>Logout</button>
            </div>
        </header>
    )
}