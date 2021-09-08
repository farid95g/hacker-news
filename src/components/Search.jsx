import React from 'react';

const Search = ({ 
  value, 
  onChange, 
  children, 
  onSubmit 
}) => (
  <form onSubmit={onSubmit}>
    <div>
      <label>{children}:</label><br />
      <input type="text" value={value} onChange={onChange} />
      <button type="submit">Search</button>
    </div>
  </form>
);

export default Search;