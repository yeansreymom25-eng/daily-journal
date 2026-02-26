"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const COLORS = {
    bg: "#edd0ac",
    top: "#4f252a",
    primary: "#f1745e",
    primaryHover: "#e06464",
    text: "#4f252a",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      <header className="w-full border-b shadow-md" style={{ backgroundColor: COLORS.top }}>
        <div className="w-full px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="text-white text-base sm:text-lg font-semibold">
            ← Back
          </button>

          <button
            className="px-4 sm:px-5 py-2 rounded-lg text-white font-bold text-sm sm:text-base"
            style={{ backgroundColor: COLORS.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 sm:mb-10 text-center" style={{ color: COLORS.text }}>
          Settings
        </h1>

        <div className="bg-white rounded-2xl shadow-lg border p-6 sm:p-10 w-full max-w-2xl">
          <p className="text-gray-600 mb-8 text-center text-sm sm:text-base">
            Manage your account preferences (UI only for now).
          </p>

          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-800">
              Display Name
            </label>
            <input
              type="text"
              defaultValue="My Journal User"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 font-semibold text-gray-800">
              Email
            </label>
            <input
              type="email"
              defaultValue="user@example.com"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1745e]"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="px-6 py-3 rounded-lg text-white font-bold"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
            >
              Save Changes
            </button>

            <button
              className="px-6 py-3 rounded-lg font-bold border"
              style={{
                backgroundColor: "#fbf3b9",
                color: COLORS.text,
                borderColor: COLORS.text,
              }}
            >
              Change Password
            </button>

            <button className="px-6 py-3 rounded-lg font-bold border border-red-400 text-red-600">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}