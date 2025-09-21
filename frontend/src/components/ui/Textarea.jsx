import React from "react";

const Textarea = ({ className = "", ...props }) => {
  const baseClasses =
    "w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " +
    "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 " +
    "dark:focus:ring-blue-400 dark:focus:border-blue-400 " +
    "transition-colors duration-200";

  const finalClasses = `${baseClasses} ${className}`;

  return <textarea className={finalClasses} {...props} />;
};

export default Textarea;
