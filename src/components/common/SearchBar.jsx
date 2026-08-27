import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Tìm kiếm bài viết, tài liệu...', 
  className = '',
  onClear
}) => {
  return (
    <div className={`search-bar-container ${className}`}>
      <Search className="search-icon" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value && onClear && (
        <button type="button" onClick={onClear} className="clear-button">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
