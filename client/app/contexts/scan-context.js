import { createContext, useState } from "react";
// Create the context
export const ScanContext = createContext();

// Create a provider component to wrap the root of your application
export const AppProvider = ({ children }) => {
  const [qrcode, setQrcode] = useState({ date: null, qr: null });
  const [history, setHistory] = useState([]);

  // Provide the state and functions to the consuming components
  return (
    <ScanContext.Provider value={{ qrcode, setQrcode, history, setHistory }}>
      {children}
    </ScanContext.Provider>
  );
};
