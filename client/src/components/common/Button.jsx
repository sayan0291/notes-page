const varients = {
    joinBtn: "bg-mid-1-green px-4 py-2 font-serif rounded-sm text-slate transition-all hover:bg-green hover:text-slate/80",
    logBtn: "p-2 bg-green-300 text-gray-800 hover:bg-green-300/90 hover:text-gray-900 transition-all duration-150",
    notebuttn: "bg-red-400 px-5 py-2 rounded-3xl",
    filterBtn: "flex gap-1 text-tertiary",
    toolbarBtn: "bg-transparent transition-colors p-1 text-[#CCCCCC] hover:bg-toolbar-change hover:text-[#888888] duration-250 rounded-md mx-2 border-divider border-[0.01em]",
    userbuttn: "bg-[rgba(0,0,0,0.75)] shadow p-3 rounded-[50%]",
    addbuttn: "bg-red-500 px-5 py-2 rounded-3xl hover:bg-red-400 duration-300",
    cancelbuttn: "bg-gray-800 flex-ic gap-2 p-2 rounded-sm hover:bg-gray-600/50 duration-700 text-red hover:text-red/90",
    logOutBtn: "flex h-[34px] items-center gap-2 rounded-[8px] border border-[#b50f17] px-5 text-[12px] font-bold text-[#ff5b5b] transition-colors hover:bg-[#2a1111] focus-visible:bg-[#2a1111] focus-visible:outline-none"
}

export default function Button({varient="menuBtn",children, ...props}){

    return(
        <>
            <button className={`${varients[varient]}`} {...props}>{children}</button>
        </>
    )
}