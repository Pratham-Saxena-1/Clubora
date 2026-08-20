import { X } from 'lucide-react';
import { useEffect } from 'react';

function HostModal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="host-modal__overlay" onClick={onClose}>
      <div className="host-modal" onClick={(e) => e.stopPropagation()}>
        <div className="host-modal__header">
          <h2 className="host-modal__title">{title}</h2>
          <button className="host-modal__close" onClick={onClose} aria-label="Close modal">
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        
        <div className="host-modal__body">
          {children}
        </div>
        
        {footer && (
          <div className="host-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostModal;
