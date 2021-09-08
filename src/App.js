import React, { Component } from 'react';
import './App.css';
import Search from './components/Search';
import Table from './components/Table';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({ result: { ...this.state.result, hits: updatedList } });
  }

  onSearchChange(ev) {
    this.setState({ searchTerm: ev.target.value });
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}/${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  render() {
    const { searchTerm, result } = this.state;

    return (
      <div className="App">
        <Search value={searchTerm} onChange={this.onSearchChange}>
          Search by title
        </Search>
        {result 
          ? <Table 
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
              isSearched={isSearched}
            />
          : <div style={{ textAlign: "center" }}>
              <img src="https://miro.medium.com/max/978/0*cWpsf9D3g346Va20.gif" alt="loading" />
            </div>
        }
      </div>
    )
  }
}

export default App;
