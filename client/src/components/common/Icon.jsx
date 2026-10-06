const varients = {
    navIcon: "md:hidden block",
    navIcons: "mr-2",
    userIcon: " bg-toolbar/20 rounded-2xl",
    feature: "py-3 px-1",
    formIcon: "text-green"
}

export const Icon = ({varient="logo",children}) => {
    return(
        <>
            <div className={`${varients[varient]}`}>
                {children}
            </div>
        </>
    )
}