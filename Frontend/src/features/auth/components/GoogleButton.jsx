import React from "react";

const GoogleButton = () => {
  return (
    <a
      href="/api/auth/google"
      class="mb-5 flex items-center justify-center gap-3 w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.9 0 6.5 1.7 8 3.1l5.9-5.9C34.4 3.3 29.7 1 24 1 14.6 1 6.6 6.8 2.8 14.3l6.9 5.4C11.8 13.3 17.4 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.5 24.5c0-1.6-.1-2.7-.4-3.9H24v7.4h12.7c-.3 2-1.8 5-5 7.1l7.7 6c4.5-4.2 7.1-10.4 7.1-16.6z"
        />
        <path
          fill="#FBBC05"
          d="M9.7 28.7c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-6.9-5.4C1 18.1 0 21 0 24s1 5.9 2.8 8.7l6.9-5.4z"
        />
        <path
          fill="#34A853"
          d="M24 47c6.5 0 12-2.1 16-5.7l-7.7-6c-2.1 1.4-4.9 2.3-8.3 2.3-6.6 0-12.2-3.8-14.3-9.2l-6.9 5.4C6.6 41.2 14.6 47 24 47z"
        />
      </svg>

      <span>Continue with Google</span>
    </a>
  );
};

export default GoogleButton;
