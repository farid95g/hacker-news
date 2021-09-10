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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input type="text" value={value} onChange={onChange} />
        <button type="submit">Search</button>
      </div>
    </div>
  </form>
);

export default Search;