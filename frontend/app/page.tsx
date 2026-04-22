'use client';

import { useEffect, useState } from 'react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export default function Home() {
  const [message, setMessage] = useState(
    apiBaseUrl ? 'Loading...' : 'Missing NEXT_PUBLIC_API_URL'
  );

  useEffect(() => {
    if (!apiBaseUrl) {
      return;
    }

    fetch(`${apiBaseUrl}/api/hello`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Failed to connect to backend'));
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Option 2 App</h1>
        <p>{message}</p>
      </div>
    </main>
  );
}
