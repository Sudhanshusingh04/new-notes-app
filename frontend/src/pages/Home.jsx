
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  Search,
  Plus,
  FileText,
  Trash2,
  Pencil,
  X,
  Menu,
  Sparkles,
  StickyNote,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const STORAGE_KEY = "notes-app-notes";

const colors = [
  "bg-amber-50 border-amber-200",
  "bg-indigo-50 border-indigo-200",
  "bg-emerald-50 border-emerald-200",
  "bg-pink-50 border-pink-200",
  "bg-sky-50 border-sky-200",
  "bg-violet-50 border-violet-200",
];

export default function Home() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        if (Array.isArray(parsed)) setNotes(parsed);
      }
    } catch {
      console.error("Unable to load saved notes");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, loaded]);

  const filteredNotes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, search]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setNotes((prev) => [newNote, ...prev]);
    }

    resetForm();
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    }
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <BookOpen size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Note<span className="text-indigo-600">Space</span>
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm font-semibold text-indigo-600"
            >
              Home
            </a>
            <a
              href="#my-notes"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              My Notes
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              About
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              onClick={openCreateForm}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus size={18} className="mr-1" />
              Create Note
            </Button>
          </div>

          <button
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileMenu((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenu && (
          <div className="space-y-1 border-t border-slate-200 bg-white p-4 md:hidden">
            <a
              href="#home"
              onClick={() => setMobileMenu(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-50"
            >
              Home
            </a>
            <a
              href="#my-notes"
              onClick={() => setMobileMenu(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-50"
            >
              My Notes
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenu(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-50"
            >
              About
            </a>
            <Button onClick={openCreateForm} className="mt-2 w-full">
              <Plus size={18} className="mr-2" />
              Create Note
            </Button>
          </div>
        )}
      </nav>

      <main id="home" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-10 text-white shadow-xl shadow-indigo-200/50 sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-52 w-52 rounded-full bg-violet-300/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-50">
              <Sparkles size={14} />
              Your ideas, all in one place
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Capture your thoughts.
              <br />
              <span className="text-indigo-200">
                Create something great.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base sm:leading-7">
              Keep your ideas, daily tasks, plans, and inspiration
              organized in one simple space. Your next great idea
              starts with a note.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={openCreateForm}
                className="h-12 rounded-xl bg-white px-6 font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                <Plus size={19} className="mr-2" />
                Write a note
                <ArrowRight size={17} className="ml-2" />
              </Button>

              <a
                href="#my-notes"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore my notes
              </a>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-7 grid grid-cols-2 gap-4 sm:gap-5">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <StickyNote size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Total notes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredNotes.length}</p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Notes found
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CREATE / EDIT FORM */}
        {showForm && (
          <section className="mt-8" aria-label="Note editor">
            <Card className="overflow-hidden rounded-2xl border-indigo-100 shadow-lg shadow-indigo-100/50">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-bold text-slate-900">
                    {editingId ? "Edit your note" : "Create a new note"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Write down whatever is on your mind.
                  </p>
                </div>

                <button
                  onClick={resetForm}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close note editor"
                >
                  <X size={20} />
                </button>
              </div>

              <CardContent className="p-5 sm:p-6">
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label
                      htmlFor="note-title"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Note title
                    </label>
                    <Input
                      id="note-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. My goals for this week"
                      maxLength={120}
                      required
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="note-content"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Description
                    </label>
                    <textarea
                      id="note-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start writing your thoughts here..."
                      rows={5}
                      maxLength={10000}
                      required
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus size={17} className="mr-2" />
                      {editingId ? "Save Changes" : "Save Note"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        )}

        {/* NOTES SECTION */}
        <section id="my-notes" className="scroll-mt-24 pt-10 sm:pt-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Your workspace
              </p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                My Notes
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                All your thoughts, organized in one place.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your notes..."
                aria-label="Search notes"
                className="h-11 rounded-xl border-slate-200 bg-white pl-10"
              />
            </div>
          </div>

          {filteredNotes.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNotes.map((note, index) => (
                <Card
                  key={note.id}
                  className={`group overflow-hidden rounded-2xl border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${colors[index % colors.length]}`}
                >
                  <CardContent className="flex h-full min-h-52 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-indigo-600 shadow-sm">
                        <FileText size={20} />
                      </div>

                      <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                        <button
                          onClick={() => handleEdit(note)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-indigo-600"
                          aria-label={`Edit ${note.title}`}
                          title="Edit note"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(note.id)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-red-600"
                          aria-label={`Delete ${note.title}`}
                          title="Delete note"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-5 break-words text-lg font-bold text-slate-800">
                      {note.title}
                    </h3>

                    <p className="mt-2 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                      {note.content}
                    </p>

                    <div className="mt-5 border-t border-black/5 pt-3 text-xs text-slate-500">
                      {note.updatedAt ? "Updated " : "Created "}
                      {formatDate(note.updatedAt || note.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                {search ? <Search size={25} /> : <StickyNote size={25} />}
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {search ? "No notes found" : "Your notes start here"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search
                  ? "Try another search term to find your notes."
                  : "Capture an idea, make a plan, or write a reminder. Your first note is just one click away."}
              </p>

              {!search && (
                <Button
                  onClick={openCreateForm}
                  className="mt-5 rounded-xl bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus size={18} className="mr-2" />
                  Create your first note
                </Button>
              )}
            </div>
          )}
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-8"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen size={24} />
          </div>
          <h2 className="mt-4 text-xl font-bold">A little space for every idea</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Keep your thoughts clear, your plans organized, and your ideas
            ready whenever inspiration strikes.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          <p>
            Made with care by{" "}
            <span className="font-semibold text-indigo-600">NoteSpace</span>
          </p>
          <p className="mt-1 text-xs">
            Your thoughts. Your space. Your ideas.
          </p>
        </footer>
      </main>
    </div>
  );
}
