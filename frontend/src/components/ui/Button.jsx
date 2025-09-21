import React from "react";
import "./Button.css";

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size,
  ...props
}) => {
  const classNames = `btn btn-${variant} ${
    size ? `btn-${size}` : ""
  } ${className}`;

  return (
    <button className={classNames} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
