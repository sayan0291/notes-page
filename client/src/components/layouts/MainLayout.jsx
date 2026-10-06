import { useRef } from "react"
import { Outlet } from "react-router-dom"
import { ScrollBar } from "../animation/Animation"

export const MainLayout = () => {
    const scrollRef = useRef(null);

    return(
        <div className="h-screen overflow-hidden bg-black">
            <ScrollBar containerRef={scrollRef} />
            <main ref={scrollRef} className="h-screen overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <Outlet />
            </main>
        </div>
    )
}
