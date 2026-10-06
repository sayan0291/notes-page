import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { PlusIcon } from "lucide-react"
import {Button,DropdownMenuRadioGroupDemo} from "../common"

export const SectionHeader = ({sectiontitle,setFilter}) => {

    const [dataFilter,setDataFilter] = useState();
    useEffect(() => {
        setFilter(dataFilter)
    },[dataFilter])

    return(
        <>
            <div className="section-header">
                <h2 className="text-md text-tertiary uppercase">{sectiontitle}</h2>
                <div className="flex-ic gap-2">
                    <DropdownMenuRadioGroupDemo setDataFilter={setDataFilter} />
                    <NavLink to='/editor'>
                        <Button variant="outline" size="icon" className="bg-white rounded-3xl" >
                            <PlusIcon />
                        </Button>
                    </NavLink>
                </div>
            </div>
        </>
    )
}