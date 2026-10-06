import React, { useContext } from "react"
import { Trash2 } from "lucide-react"
import { deleteData, readData } from "../../Form"

const Display = {
    error: {icon: "border-red-400",background: "from-red-300 to-red-100"},
    nothing: {icon: "border-yellow-400",background: "from-yellow-100 to-yellow-50"},
    notFound: {icon: "border-red-300",background: "from-red-100 to-red-50"}
}

export const ErrorCard = ({cardtitle,carddescription,children,type}) => {

    return(
        <div className="fl-jt-ct h-screen">
            <div className={`max-w-md mx-auto px-10 py-3 border border-white rounded-lg bg-gradient-to-b ${Display[type].background} flex self-start space-x-3 shadow-md`}>
            <div className="flex-shrink-0">
                <div className={`w-10 h-10 flex items-center justify-center bg-white border ${Display[type].icon} rounded-full`} >
                    {children}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{cardtitle}</h3>
                <p className="text-gray-700 text-sm">{carddescription}</p>
            </div>
            </div>
        </div>
    )
}

export const Card = ({notesObj,setShowEditSection}) => {
    const { notes,setNotes,setNotedetails } = useContext(NotesContext)
    const dateObj = new Date(notesObj.created_at)
    const date = dateObj.toLocaleDateString();

    const handleDelete = async (event) => {
        event.stopPropagation()
        await DeleteData(notesObj.id)
        ReadData(setNotes)
    }
    const handleclick = (notesobj) => {
        setShowEditSection(true)
        setNotedetails(notesObj)
    }

  return (
    <div className="service-card m-5 shadow-xl cursor-pointer snap-start shrink-0 py-4 px-6 bg-white flex flex-col items-start gap-3 transition-all duration-300" onClick={handleclick}>
      <div className="fl-bt w-full">
        <p className="font-bold text-2xl text-black/80">
          {notesObj.title}
        </p>
        <Trash2 className="self-end text-slate-400 hover:text-red-300 duration-400" onClick={() => handleDelete(notesObj)} />
      </div>
      <p className="text-gray-400 text-sm">
        {notesObj.description}
      </p>
      <p className="text-slate-600 self-end">
        {date}
      </p>
    </div>
  );
}

