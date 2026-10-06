import { useRef, useEffect, useState, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { createImageUrl, saveDocument, getDocument } from "../Database/Supabase-client.js";
import useAuth from "../hooks/useAuth.js";

const toolbarOptions = [
  ["undo", "redo"],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link', 'image', 'formula'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['save']
];

const tooltipMapping = [
  { selector: '.ql-undo', title: 'Undo' },
  { selector: '.ql-redo', title: 'Redo' },
  { selector: '.ql-bold', title: 'Bold' },
  { selector: '.ql-italic', title: 'Italic' },
  { selector: '.ql-underline', title: 'Underline' },
  { selector: '.ql-strike', title: 'Strikethrough' },
  { selector: '.ql-blockquote', title: 'Blockquote' },
  { selector: '.ql-code-block', title: 'Code Block' },
  { selector: '.ql-link', title: 'Insert Link' },
  { selector: '.ql-image', title: 'Insert Image' },
  { selector: '.ql-formula', title: 'Insert Formula' },
  { selector: '.ql-list[value="ordered"]', title: 'Numbered List' },
  { selector: '.ql-list[value="bullet"]', title: 'Bulleted List' },
  { selector: '.ql-list[value="check"]', title: 'Check List' },
  { selector: '.ql-script[value="sub"]', title: 'Subscript' },
  { selector: '.ql-script[value="super"]', title: 'Superscript' },
  { selector: '.ql-indent[value="-1"]', title: 'Decrease Indent' },
  { selector: '.ql-indent[value="+1"]', title: 'Increase Indent' },
  { selector: '.ql-direction[value="rtl"]', title: 'Text Direction (RTL)' },
  { selector: '.ql-header', title: 'Heading Level' },
  { selector: '.ql-color', title: 'Text Color' },
  { selector: '.ql-background', title: 'Background Color' },
  { selector: '.ql-font', title: 'Font Style' },
  { selector: '.ql-align', title: 'Text Alignment' },
  { selector: '.ql-clean', title: 'Clear Formatting' },
  { selector: '.ql-save', title: 'Save' },
];

function normalizeTags(tags) {
    if (Array.isArray(tags)) return tags;
    if (!tags) return [];
    return [tags];
}

function normalizeDelta(content) {
    if (!content) return null;
    if (typeof content === "string") {
        try {
            return JSON.parse(content);
        } catch {
            return { ops: [{ insert: content }] };
        }
    }
    return content;
}

function setupImageDeleteButton(quill) {
    const overlayParent = quill.container.parentElement;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quill-image-delete-btn-show";
    button.textContent = "Delete";
    button.setAttribute("aria-label", "Delete image");
    button.hidden = true;

    let activeImage = null;
    overlayParent.appendChild(button);

    const hideButton = () => {
        activeImage = null;
        button.hidden = true;
    };

    const showButton = (imageElement) => {
        if (!imageElement) return;
        const containerRect = overlayParent.getBoundingClientRect();
        const imageRect = imageElement.getBoundingClientRect();
        activeImage = imageElement;
        button.hidden = false;
        button.style.left = `${imageRect.left - containerRect.left}px`;
        button.style.top = `${Math.max(imageRect.top - containerRect.top - 34, 8)}px`;
    };

    const handleEditorClick = (event) => {
        if (event.target?.tagName === "IMG") {
            showButton(event.target);
            return;
        }
        if (event.target !== button) {
            hideButton();
        }
    };

    const handleButtonClick = () => {
        if (!activeImage) return;
        const blot = Quill.find(activeImage);
        if (!blot) return;
        const index = quill.getIndex(blot);
        quill.deleteText(index, 1, "user");
        hideButton();
    };

    const repositionButton = () => {
        if (!activeImage || button.hidden) return;
        showButton(activeImage);
    };

    quill.root.addEventListener("click", handleEditorClick);
    quill.container.addEventListener("scroll", repositionButton);
    button.addEventListener("click", handleButtonClick);

    return {
        showButton,
        destroy() {
            quill.root.removeEventListener("click", handleEditorClick);
            quill.container.removeEventListener("scroll", repositionButton);
            button.removeEventListener("click", handleButtonClick);
            button.remove();
        },
    };
}

async function handleImage(model, quillRef, imageDeleteControls) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg";
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPEG,PNG,JPG Allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Max 5MB");
            return;
        }
        if (!model) {
            alert("Image scanner is not ready yet. Try again in a moment.");
            return;
        }

        const imageURL = URL.createObjectURL(file);
        const img = new Image();
        img.src = imageURL;
        await img.decode();

        try {
            const predictions = await model.classify(img);
            const range = quillRef.current.getSelection(true);

            const blocked = predictions.some(
                obj => ["Porn", "Hentai", "Sexy"].includes(obj.className) && obj.probability > 0.30
            );

            if (blocked) {
                alert("You are not allowed to upload 18+ images");
                return;
            }

            const publicImageUrl = await createImageUrl(file);
            if (!publicImageUrl) {
                alert("Failed to upload image");
                return;
            }

            quillRef.current.insertEmbed(range.index, "image", publicImageUrl);
            quillRef.current.setSelection(range.index + 1, 0, "silent");

            requestAnimationFrame(() => {
                const [imageBlot] = quillRef.current.getLeaf(range.index);
                const uploadedImage = imageBlot?.domNode?.tagName === "IMG"
                    ? imageBlot.domNode
                    : quillRef.current.root.querySelector(`img[src="${publicImageUrl}"]`);
                imageDeleteControls?.showButton(uploadedImage);
            });
        } catch (error) {
            console.log(error);
        }
    };
}

export function useQuillEditor({ onChange, model, documentId }) {
    const { user } = useAuth();
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const modelRef = useRef(null);
    const documentIdRef = useRef(documentId);
    const autosaveTimerRef = useRef(null);

    // "idle" | "unsaved" | "saving" | "saved" | "error"
    const [status, setStatus] = useState("idle");

    const [title, setTitle] = useState("Untitled");
    const [tags, setTags] = useState([]);
    const [pinned, setPinned] = useState(false);
    const titleRef = useRef(title);
    const tagsRef = useRef(tags);
    const pinnedRef = useRef(pinned);

    useEffect(() => { titleRef.current = title; }, [title]);
    useEffect(() => { tagsRef.current = tags; }, [tags]);
    useEffect(() => { pinnedRef.current = pinned; }, [pinned]);
    useEffect(() => { modelRef.current = model; }, [model]);
    useEffect(() => { documentIdRef.current = documentId; }, [documentId]);

    // saveNow now accepts optional overrides, but falls back to the
    // current hook state — so plain autosave calls (saveNow()) still work.
    const saveNow = useCallback(async (overrides = {}) => {
        if (!quillRef.current) return;

        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current);
            autosaveTimerRef.current = null;
        }

        setStatus("saving");
        const delta = quillRef.current.getContents();
        const finalTitle = overrides.title ?? titleRef.current;
        const finalTags = normalizeTags(overrides.tags ?? tagsRef.current);
        const finalPinned = overrides.pinned ?? pinnedRef.current;

        try {
            if (!user) {
                setStatus("error");
                return;
            }

            const data = await saveDocument({
                id: documentIdRef.current,
                userId: user.user_id,
                content: delta,
                title: finalTitle.trim() || "Untitled",
                tags: finalTags,
                pinned: finalPinned,
            });

            if (!documentIdRef.current && data?.id) {
                documentIdRef.current = data.id;
            }

            setStatus("saved");
        } catch (err) {
            console.error("Save failed:", err);
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current || quillRef.current) return;

        const icons = Quill.import("ui/icons");
        icons.undo = "⮌";
        icons.redo = "⮎";
        icons.clean = "🧹";
        icons.folder = "name";
        icons.save = "💾";

        let imageDeleteControls;

        quillRef.current = new Quill(containerRef.current, {
            theme: "snow",
            modules: {
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        undo() { quillRef.current.history.undo(); },
                        redo() { quillRef.current.history.redo(); },
                        image: async () => {
                            await handleImage(modelRef.current, quillRef, imageDeleteControls);
                        },
                        save() { saveNow(); }
                    }
                },
                history: { delay: 1000, maxStack: 100, userOnly: true },
            },
        });

        imageDeleteControls = setupImageDeleteButton(quillRef.current);

        const toolbarElement = containerRef.current.previousSibling;
        if (toolbarElement) {
            tooltipMapping.forEach(({ selector, title: tip }) => {
                const element = toolbarElement.querySelector(selector);
                if (element) element.setAttribute('title', tip);
            });
        }

        // Load existing content + title/tags once the editor exists
        (async () => {
            if (!documentIdRef.current) return;
            try {
                if (!user) return;

                const data = await getDocument({ id: documentIdRef.current, userId: user.user_id });

                if (data?.content) {
                    quillRef.current.setContents(normalizeDelta(data.content), "silent");
                }
                if (data?.title) setTitle(data.title);
                setTags(normalizeTags(data?.tags));
                setPinned(data?.pinned === true);
            } catch (err) {
                console.error("Load failed:", err);
            }
        })();

        quillRef.current.on("text-change", (delta, oldDelta, source) => {
            onChange?.(quillRef.current.root.innerHTML);

            // Only react to real user edits, not the silent load above
            if (source === "user") {
                setStatus("unsaved");
            }
        });

        return () => {
            imageDeleteControls.destroy();
            if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
            quillRef.current = null;
        };
    }, [onChange, saveNow, user]);

    useEffect(() => {
        function handleKeyDown(e) {
            const isSaveShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
            if (isSaveShortcut) {
                e.preventDefault();
                saveNow();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [saveNow]);

    return {
        containerRef,
        status,
        saveNow,
        title,
        setTitle: (value) => {
            titleRef.current = value;
            setTitle(value);
            setStatus("unsaved");
        },
        tags,
        setTags: (value) => {
            const normalizedTags = normalizeTags(value);
            tagsRef.current = normalizedTags;
            setTags(normalizedTags);
            setStatus("unsaved");
        },
        pinned,
        setPinned: (value) => {
            pinnedRef.current = value;
            setPinned(value);
            setStatus("unsaved");
        },
        documentId: documentIdRef.current,
    };
}
