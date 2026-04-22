import NotesClient from './notes-client';

type Note = {
  id: number;
  text: string;
  created_at: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

async function getInitialNotes() {
  if (!apiBaseUrl) {
    return {
      notes: [] as Note[],
      status: 'Missing NEXT_PUBLIC_API_URL',
    };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/notes`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }

    const notes = (await response.json()) as Note[];

    return {
      notes,
      status: '',
    };
  } catch {
    return {
      notes: [] as Note[],
      status: 'Failed to load notes',
    };
  }
}

export default async function Home() {
  const { notes, status } = await getInitialNotes();

  return (
    <NotesClient
      apiBaseUrl={apiBaseUrl ?? ''}
      initialNotes={notes}
      initialStatus={status}
    />
  );
}
