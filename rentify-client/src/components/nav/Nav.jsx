import "./Nav.css";
import {useNavigate} from "react-router-dom";
const Nav = ({data}) => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    return <>
        <div className="nav" >
            <h3 onClick={() => navigate('/post-property')} className="nav-data">{data}</h3>
            <h3 onClick={logout} className="nav-logout" >Logout</h3>    
        </div>    
    </>
};
export default Nav;