import React, { Component } from 'react';
import './App.css';
import Search from './components/Search';
import Table from './components/Table';
import Preloader from "./components/Preloader";

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: "",
      isFetching: false
    };
  }

  setSearchTopStories = result => this.setState({ result });

  onDismiss = id => {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({ result: { ...this.state.result, hits: updatedList } });
  }

  onSearchChange = e => this.setState({ searchTerm: e.target.value });

  fetchSearchTopStories = searchTerm => {
    this.setState({ isFetching: true, result: null });
    fetch(`${PATH_BASE}/${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => {
        this.setSearchTopStories(result);
        this.setState({ isFetching: false });
      })
      .catch(error => error);
  }

  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    this.setState({ searchTerm: "" });
    e.preventDefault();
  }

  componentDidMount() {
    this.fetchSearchTopStories(DEFAULT_QUERY);
  }

  render() {
    const { searchTerm, result } = this.state;

    return (
      <div className="App">
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange} 
          onSubmit={this.onSearchSubmit}
        >
          Search by title
        </Search>

        { this.state.isFetching && <Preloader /> }
        
        {result && 
            <Table 
              list={result.hits}
              onDismiss={this.onDismiss}
            /> 
        }
      </div>
    )
  }
}

export default App;
