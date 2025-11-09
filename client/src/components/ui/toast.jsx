import React, { useEffect, useState } from "react";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
    console.log(message, type)
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!visible) return null;


  // Basic style object
  const baseStyle = {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "#fff",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
    fontSize: "15px",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(100%)",
    transition: "all 0.4s ease",
    zIndex: 9999,
  };

  // Color by type
  const typeColors = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
  };

  return (
    <div style={{ ...baseStyle, backgroundColor: typeColors[type] || "#333" }}>
      {message}
    </div>
  );
};

export default Toast;
