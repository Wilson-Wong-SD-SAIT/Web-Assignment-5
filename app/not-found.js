// app/not-found.js

import React from 'react';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg">Sorry, the page you are looking for does not exist.</p>
      <img src="/404-error.png" alt="404 Error" className="mt-8 w-64" />
    </div>
  );
}

export default NotFoundPage;
