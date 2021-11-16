import React from "react";
import Button from "./../Button";
import PropTypes from "prop-types";
import Sort from "./../Sort";

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort = (sortKey) => {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  };

  render() {
    const {
      list,
      onDismiss,
      isFetching,
      fetchStories,
      currentSearchTerm,
      page,
      onSort,
      sorts
    } = this.props;

    const {
      sortKey,
      isSortReverse
    } = this.state;

    const sortedList = sorts[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div style={{ marginTop: "30px", transition: isFetching ? "" : "transform .3s", transform: isFetching ? "scale(0)" : "scale(1)" }}>
        <table>
          <thead>
            <tr>
              <th>
                <Sort
                  sortKey={'TITLE'}
                  onSort={this.onSort}
                  activeSortKey={sortKey}
                >
                  Заголовок
                </Sort>
              </th>
              <th>
                <Sort
                  sortKey={'AUTHOR'}
                  onSort={this.onSort}
                  activeSortKey={sortKey}
                >
                  Автор
                </Sort>
              </th>
              <th>
                <Sort
                  sortKey={'COMMENTS'}
                  onSort={this.onSort}
                  activeSortKey={sortKey}
                >
                  Комментарии
                </Sort>
              </th>
              <th>
                <Sort
                  sortKey={'POINTS'}
                  onSort={this.onSort}
                  activeSortKey={sortKey}
                >
                  Очки
                </Sort>
              </th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {reverseSortedList.slice(-10).map(item =>
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
    )
  }
};

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  fetchStories: PropTypes.func,
  currentSearchTerm: PropTypes.string,
  page: PropTypes.number
}

export default Table;