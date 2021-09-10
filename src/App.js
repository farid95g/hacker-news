import React, { Component } from 'react';
import './App.css';
import Search from './components/Search';
import Table from './components/Table';
import Preloader from "./components/Preloader";

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_HPP = "hitsPerPage=10";
const PARAM_PAGE = "page=";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: "",
      searchTerm: "",
      isFetching: false,
      error: null
    };
  }

  needsToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories = result => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [ ...oldHits,  ...hits ];
    
    this.setState({
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({ 
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchChange = e => this.setState({ searchTerm: e.target.value });

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isFetching: true });
    fetch(`${PATH_BASE}/${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_HPP}&${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => {
        this.setSearchTopStories(result);
        this.setState({ isFetching: false });
        console.log(result)
      })
      .catch(error => this.setState({ error, isFetching: false }));
  }

  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    
    this.setState({ searchTerm: "" });
    e.preventDefault();
  }

  componentDidMount() {
    this.setState({ searchKey: DEFAULT_QUERY });
    this.fetchSearchTopStories(DEFAULT_QUERY);
  }

  render() {
    const { 
      searchTerm, 
      results,
      searchKey,
      error
    } = this.state;

    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    const currentSearchTerm = searchTerm ? searchTerm : DEFAULT_QUERY;

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
        
        {results && 
            <Table 
              list={list}
              onDismiss={this.onDismiss}
              isFetching={this.state.isFetching}
              fetchStories={this.fetchSearchTopStories}
              currentSearchTerm={searchKey}
              page={page}
            />
        }

        {error &&
          <p style={{ textAlign: "center" }}>Sorry, something went wrong!</p>
        }
      </div>
    )
  }
}

export default App;
