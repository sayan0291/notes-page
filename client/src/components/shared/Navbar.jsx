import { Icon,Button } from "../common"
import { NavLink } from "react-router-dom"
import useAuth from "../../hooks/useAuth";
import { LayoutDashboard } from "lucide-react"

export const Navbar = ({className=""}) => {
    const { user } = useAuth();
    
    return(
        <div className={`nav-bar ${className}`}>
            <Logo className2="text-gray-600" />
            {
                !user ? (<NavLink className="nav-btn" to="/register" aria-label="register" >Getting Started</NavLink>) : 
                        (<NavLink className="text-mid-green" to="/library/all-notes" aria-label="Dashboard" ><LayoutDashboard strokeWidth={1} /></NavLink>)
            }
        </div>
    )
}

export const Logo = ({className1="",className2=""}) => {
    return(
        <>
            <div className={`flex-ic gap-1 text-lg font-medium ${className1}`}>
                <img src="/paper.png" className="w-10" />
                <h1 className={className2}>zenotes</h1>
            </div>
        </>
    )
}