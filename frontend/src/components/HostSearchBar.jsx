import { Search } from 'lucide-react';

function HostSearchBar({ placeholder, value, onChange, id }) {
  return (
    <div className="host-search-bar">
      <Search className="host-search-bar__icon" size={18} strokeWidth={1.8} />
      <input
        type="text"
        className="host-search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
      />
    </div>
  );
}

export default HostSearchBar;
