'use client';

import { useState } from 'react';

type Note = {
  id: number;
  text: string;
  created_at: string;
};

type NotesClientProps = {
  apiBaseUrl: string;
  initialNotes: Note[];
  initialStatus: string;
};

export default function NotesClient({
  apiBaseUrl,
  initialNotes,
  initialStatus,
}: NotesClientProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [text, setText] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadNotes() {
    if (!apiBaseUrl) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/notes`);

      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = (await response.json()) as Note[];
      setNotes(data);
      setStatus('');
    } catch {
      setStatus('Failed to load notes');
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!apiBaseUrl || !trimmedText) {
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus('Creating note...');

      const response = await fetch(`${apiBaseUrl}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmedText }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      setText('');
      await loadNotes();
    } catch {
      setStatus('Failed to create note');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">Notes</h1>

        <form className="mb-6 flex gap-3" onSubmit={handleSubmit}>
          <input
            className="flex-1 rounded-md border border-gray-300 px-3 py-2"
            onChange={(event) => setText(event.target.value)}
            placeholder="Write a note..."
            value={text}
          />
          <button
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={!apiBaseUrl || isSubmitting || !text.trim()}
            type="submit"
          >
            {isSubmitting ? 'Saving...' : 'Add'}
          </button>
        </form>

        {status ? <p className="mb-4 text-sm text-gray-600">{status}</p> : null}

        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-md border border-gray-200 bg-gray-50 p-3"
            >
              <p className="mb-1">{note.text}</p>
              <p className="text-sm text-gray-500">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>

        {!status && notes.length === 0 ? (
          <p className="text-sm text-gray-600">No notes yet.</p>
        ) : null}
      </div>
    </main>
  );
}
