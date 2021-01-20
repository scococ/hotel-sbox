import React from "react";

const Button = ({
  value,
  icon,
  handleClick,
  handleLock,
  service_mode,
    locked,
  locking,
}) => {
  return (
    <div
      className={`btn ${locking ? 'prevent': ''} `}
      onClick={() =>
        value === "L"
          ? service_mode
            ? handleClick(value)
            : locked ? null : handleLock()
          : value === "*" && !service_mode
          ? null
          : handleClick(value)
      }
    >
      <strong className="btn-text">{value}</strong>
      {icon && <span className="icon-placeholder">{icon}</span>}
    </div>
  );
};




export default Button;
