"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuRadioGroupDemo({setDataFilter}) {
  const [position, setPosition] = React.useState("newest")

  React.useEffect(()=>{
    setDataFilter(position)
  },[position])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button className="bg-toolbar text-slate hover:bg-toolbar/90 hover:text-slate/90 transition-colors duration-150" >{position}</Button>} />
      <DropdownMenuContent className="w-32 bg-white">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Filter</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
