import React from 'react';
import Button from './Button';

const Table = ({ list, pattern, onDismiss, isSearched }) => (
  <div style={{ marginTop: "30px" }}>
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Comments number</th>
          <th>Points</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        {list.filter(isSearched(pattern)).map(item =>
          <tr key={item.objectID}>
            <td style={{ width: '20%' }}>
              <a href={item.url}>{item.title}</a>
            </td>
            <td style={{ width: '40%' }}>{item.author}</td>
            <td style={{ width: '10%' }}>{item.num_comments}</td>
            <td style={{ width: '10%' }}>{item.points}</td>
            <td style={{ width: '20%' }}>
              <Button onClick={() => onDismiss(item.objectID)}>
                Отбросить
              </Button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default Table;