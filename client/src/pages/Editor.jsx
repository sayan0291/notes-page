import { useEffect, useMemo, useState } from "react";
import { Pin, Plus, Save, X } from "lucide-react";
import { useParams } from "react-router-dom";
import useNSFW from "../hooks/useNSFW.js";
import { useQuillEditor } from "../utils/useQuillEditor.js";

const TAG_OPTIONS = ["work", "personal", "ideas", "study"];

export const Editor = ({ documentId }) => {
    const params = useParams();
    const activeDocumentId = documentId ?? params.documentId;
    const { model, loading, error: scannerError } = useNSFW();
    const { containerRef, status, saveNow, title, setTitle, tags, setTags, pinned, setPinned } =
        useQuillEditor({ documentId: activeDocumentId, model });

    const [selectedTag, setSelectedTag] = useState(TAG_OPTIONS[0]);
    const availableTags = useMemo(
        () => TAG_OPTIONS.filter((tag) => !tags.includes(tag)),
        [tags]
    );
    const statusLabel = scannerError
        ? "Scanner unavailable"
        : loading
        ? "Scanner loading..."
        : status === "saving"
            ? "Saving..."
            : status === "saved"
                ? "Saved"
                : status === "unsaved"
                    ? "Unsaved changes"
                    : status === "error"
                        ? "Error saving"
                        : "";

    useEffect(() => {
        if (availableTags.length > 0 && !availableTags.includes(selectedTag)) {
            setSelectedTag(availableTags[0]);
        }
    }, [availableTags, selectedTag]);

    const addTag = () => {
        const tag = selectedTag.trim();
        if (tag && !tags.includes(tag)) {
            setTags([tag]);
        }
    };

    const removeTag = (tag) => setTags(tags.filter((item) => item !== tag));

    return (
        <div className="editor">
            <div className="editor-meta">
                <div className="editor-title-group">
                    <input
                        className="editor-title-input"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Document title"
                    />

                    <div className="editor-tags">
                        {tags.map((tag) => (
                            <span className="editor-tag" key={tag}>
                                {JSON.parse(tag)[0]}
                                <button
                                    aria-label={`Remove ${tag} tag`}
                                    className="editor-tag-remove"
                                    onClick={() => removeTag(tag)}
                                    type="button"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}

                        <div className="editor-tag-input-wrap">
                            <select
                                className="editor-tag-select"
                                disabled={availableTags.length === 0}
                                value={selectedTag}
                                onChange={(event) => setSelectedTag(event.target.value)}
                            >
                                {availableTags.length === 0 && (
                                    <option value={selectedTag}>All tags added</option>
                                )}
                                {availableTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                            <button
                                aria-label="Add tag"
                                className="editor-tag-add"
                                disabled={availableTags.length === 0}
                                onClick={addTag}
                                type="button"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="editor-save-group">
                    <span className={`editor-save-status editor-save-status-${status}`}>
                        {statusLabel}
                    </span>
                    <button
                        aria-label={pinned ? "Unpin note" : "Pin note"}
                        className={`editor-pin-button ${pinned ? "editor-pin-button-active" : ""}`}
                        onClick={() => setPinned(!pinned)}
                        title={pinned ? "Unpin note" : "Pin note"}
                        type="button"
                    >
                        <Pin size={16} fill={pinned ? "currentColor" : "none"} />
                    </button>
                    <button
                        className="editor-save-button"
                        disabled={status === "saving"}
                        onClick={() => saveNow()}
                        type="button"
                    >
                        <Save size={16} />
                        Save
                    </button>
                </div>
            </div>

            <div id="toolbar" />
            <div ref={containerRef} style={{ minHeight: 300 }} />
        </div>
    );
};
