import React from 'react';

const Sort = ({ sortKey, onSort, children }) =>
  <span style={{ "cursor" : "pointer"}} onClick={() => onSort(sortKey)}>
    {children}
  </span>

export default Sort;