import { Pin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../components/common/SectionHeader.jsx";
import useNotes from "../hooks/useNotes.js";
import dataHandle from "../data/dataHandle.js";
import { useMemo, useState } from "react";
import { dataFilterNewest, dataFilterOldest } from "../lib/filter/dataFilter.js";

function deltaToPreview(content) {
  let delta = content;

  if (typeof content === "string") {
    try {
      delta = JSON.parse(content);
    } catch {
      return content.trim();
    }
  }

  if (!delta?.ops) return "";

  return delta.ops
    .map((op) => (typeof op.insert === "string" ? op.insert : ""))
    .join("")
    .trim();
}

function NoteCard({ note }) {
  const navigate = useNavigate();
  const { togglePinned } = useNotes();
  const preview = deltaToPreview(note.content);
  const isPinned = note.pinned === true;


  const handlePinClick = async (event) => {
    event.stopPropagation();

    try {
      await togglePinned(note.id, !isPinned);
    } catch (error) {
      console.error("Pin update failed:", error);
    }
  };

  return (
    <article
      className="section-card"
      onClick={() => navigate(`/editor/${note.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/editor/${note.id}`);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="section-card-header">
        <h3>{note.title || "Untitled"}</h3>
        <button
          aria-label={isPinned ? "Unpin note" : "Pin note"}
          className={`section-card-pin ${isPinned ? "section-card-pin-active" : ""}`}
          onClick={handlePinClick}
          title={isPinned ? "Unpin note" : "Pin note"}
          type="button"
        >
          <Pin size={15} fill={isPinned ? "currentColor" : "none"} />
        </button>
      </div>

      {note?.length > 0 && (
        <div className="section-card-tags">
          {note.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}

      <p className="section-card-preview">
        {preview || "No content yet."}
      </p>
    </article>
  );
}

export default function NotesPage({data}) {
  const [filter,setFilter] = useState("newest");

  const { documents, loading } = useNotes();
  
  const notes = dataHandle(data, documents);
  const allNotes = useMemo(() => {
    if (filter === "oldest") {
      return dataFilterOldest(notes)
    }
    return dataFilterNewest(notes)
  },[notes,filter])

  return (
    <div className="bg-[#121212] section">
      <SectionHeader sectiontitle={data} setFilter={setFilter} />
      <div className="section-body">
        {loading && <p className="section-empty">Loading documents...</p>}
        {!loading && notes.length === 0 && (
          <p className="section-empty">No documents found.</p>
        )}
        {!loading && allNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
