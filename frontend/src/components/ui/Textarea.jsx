import React from "react";
import "./Textarea.css";

const Textarea = ({ className = "", ...props }) => {
  const classNames = `textarea ${className}`;
  return <textarea className={classNames} {...props} />;
};

export default Textarea;
