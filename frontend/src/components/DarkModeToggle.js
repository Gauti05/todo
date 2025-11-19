import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="ml-4 p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle dark mode"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
