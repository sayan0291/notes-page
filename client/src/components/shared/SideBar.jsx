import { Button, Icon } from "../common";
import { TextAlignEnd,X,NotebookText,Library,NotepadText,Pin,Trash2,Tags, CircleUserRound, Settings, Cog  } from 'lucide-react';
import { NavLink } from "react-router-dom";
import { Logo } from "./Navbar.jsx";
import useAuth from "../../hooks/useAuth.js"

const sideButton = [
    {id:1,name: "Library",children: [ {id: "all-notes",to: "/library/all-notes",name: "All notes",icon: <NotepadText className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1} />},{id: "pinned",to: "/library/pinned",name: "Pinned",icon: <Pin className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1} />} ]},
    {id:2,name: "Tags",children: [{id: "work",to: "/tags/work",name:"Work",color: "#7F77DD"},{id: "personal",to: "/tags/personal",name:"Personal",color: "#1D9E75"},{id: "ideas",to: "/tags/ideas",name:"Ideas",color:"#D85A30"},{id: "study",to: "/tags/study",name:"Study",color: "#378ADD"}]}
]

export const SideBar = ({open,setOpen}) => {
    const { user } = useAuth();

    return (
        <>
        <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
            className={`${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 ease-out md:hidden`}
        />
        <aside className={`${open ? "translate-x-0 opacity-100 shadow-[24px_0_60px_rgba(0,0,0,0.35)]" : "-translate-x-full opacity-0 shadow-none"} side-bar fixed inset-y-0 left-0 z-50 w-[min(82vw,320px)] transition-[transform,opacity,box-shadow] duration-300 ease-out md:static md:z-auto md:flex md:w-auto md:translate-x-0 md:opacity-100 md:shadow-none`}>
            <div className="flex-ic justify-between p-2">
                <Logo className1="text-white" />
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setOpen(false)}
                    className="flex-jc-ic h-10 w-10 rounded-[6px] border border-divider text-slate transition-colors duration-150 hover:bg-toolbar hover:text-white md:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="side-bar-section" >
                {sideButton.map((item) => {
                    return (
                        <div key={item.id}>
                            <div className="name-section">
                                <h2>{item.name}</h2>
                                <Icon varient="navIcon">
                                    {item.mainicon}
                                </Icon>
                            </div>
                            <div className="child-btn">
                                {item.children.map((btn) => (
                                    <NavLink key={btn.id} to={btn.to} onClick={() => setOpen(false)} className={({isActive}) => isActive ? "bg-toolbar text-tertiary-change nav-btn" : "nav-btn"} >
                                        {btn.icon ? ( 
                                            <Icon varient="navIcons">
                                                {btn.icon}
                                            </Icon>): (
                                            <div className="points" style={{background: btn.color}} />
                                        )}
                                        <h2 to={btn.to}>{btn.name}</h2>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="sidebar-footer">
                <div className="avatar">{user?.name?.at(0)}</div>
                <div className="profile-info">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                </div>
                <div className="profile-actions">
                    <NavLink className="w-10 h-10 rounded-sm bg-transparent border border-divider flex-jc-ic cursor-pointer text-tertiary transition-background duration-150 hover:bg-secondary-custom hover:text-tertiary/90" to="/settings" >
                        <Cog />
                    </NavLink>
                </div>
            </div>
        </aside>
        </>
    )
}
