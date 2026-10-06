import { Menu } from "lucide-react"
import { Logo } from "../shared"
import { Button } from "../common"

export const MobileNavbar = ({open,setOpen}) => {

    return(
        <>
            <div className="md:hidden flex-bw-ic bg-secondary-custom p-2">
                <Logo className1="text-white" />
                <Button varient="toolbarBtn" onClick={() => setOpen(!open)} >
                    <Menu className="text-slate" />
                </Button>
            </div>
        </>
    )
}