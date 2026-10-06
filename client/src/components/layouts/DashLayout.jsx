import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { SideBar,MobileNavbar } from "../shared"

export const DashLayout = () => {
    const [open,setOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if(window.innerWidth >= 768){
                setOpen(false)
            }
        }

        window.addEventListener('resize',handleResize);
        return () => window.removeEventListener('resize',handleResize);

    }, [])

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        }
    }, [open])

    return(
        <div className="h-dvh overflow-hidden">
            <MobileNavbar open={open} setOpen={setOpen} />
            <div className="flex h-[calc(100dvh-56px)] md:h-full">
                <SideBar open={open} setOpen={setOpen} />
                <main className={`${open ? "overflow-hidden" : "overflow-auto"} min-w-0 flex-1 scrollbar-hide md:overflow-auto`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
