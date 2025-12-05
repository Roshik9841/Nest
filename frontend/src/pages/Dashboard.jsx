import {Header} from "../components/Header"
import { Link } from "react-router-dom";
export const Dashboard = ()=>{
    
    return(
      
        <div>
              <Header/>
            <nav>
                <Link to="/add-product">Add Course</Link>
                <Link to="/view-product">View Course</Link>
                <Link to="/view-users">View users</Link>
                
            </nav>
        </div>
    );
}