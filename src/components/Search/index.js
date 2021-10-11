import React from 'react';

class Search extends React.Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const {
      value,
      onChange,
      children,
      onSubmit
    } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <div>
          <label>{children}:</label><br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <input
              type="text"
              value={value}
              onChange={onChange}
              ref={node => this.input = node}
            />
            <button type="submit">Search</button>
          </div>
        </div>
      </form>
    )
  }
}
export default Search;