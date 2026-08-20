import { createContext, useState, useContext, useCallback } from 'react';
import HostToast from '../components/HostToast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => 
        prev.map(t => t.id === id ? { ...t, exiting: true } : t)
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 250); // wait for animation
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => 
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="host-toast__container">
        {toasts.map((toast) => (
          <HostToast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type}
            exiting={toast.exiting}
            onDismiss={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
