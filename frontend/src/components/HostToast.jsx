import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

function HostToast({ message, type = 'info', exiting, onDismiss }) {
  const icons = {
    success: <CheckCircle size={20} strokeWidth={2} />,
    error: <AlertCircle size={20} strokeWidth={2} />,
    info: <Info size={20} strokeWidth={2} />
  };

  return (
    <div className={`host-toast host-toast--${type} ${exiting ? 'host-toast--exiting' : ''}`}>
      <div className="host-toast__icon">
        {icons[type]}
      </div>
      <p className="host-toast__message">{message}</p>
      <button className="host-toast__dismiss" onClick={onDismiss} aria-label="Dismiss">
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

export default HostToast;
