import React from 'react';

const Search = ({ value, onChange, children }) => (
  <form>
    <div>
      <label>{children}:</label><br />
      <input type="text" value={value} onChange={onChange} />
    </div>
  </form>
);

export default Search;