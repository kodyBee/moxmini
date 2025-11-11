'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Figure Finder Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(85deg, #000000 10%, #001220 40%)',
        color: 'white',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">
          We encountered an error while loading the Figure Finder. This could be due to a network
          issue or a problem with the data source.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="cursor-pointer px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="cursor-pointer px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors inline-block"
          >
            Go home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded text-left">
            <p className="text-red-400 text-sm font-mono">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
