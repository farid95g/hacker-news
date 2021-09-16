import React from "react";
import Button from "./../Button";
import PropTypes from "prop-types";

const Table = ({ 
  list, 
  onDismiss, 
  isFetching, 
  fetchStories, 
  currentSearchTerm, 
  page 
}) => (
  <div style={{ marginTop: "30px", transition: isFetching ? "" : "transform .3s", transform: isFetching ? "scale(0)" : "scale(1)" }}>
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
        {list.slice(-10).map(item =>
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

    <Button
      onClick={() => fetchStories(currentSearchTerm, page + 1)}
    >
      More Stories
    </Button>
  </div>
);

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  fetchStories: PropTypes.func,
  currentSearchTerm: PropTypes.string,
  page: PropTypes.number
}

export default Table;