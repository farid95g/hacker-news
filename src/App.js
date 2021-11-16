import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import {
  DEFAULT_QUERY,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_HPP,
  PARAM_PAGE
} from "./constants";
import Search from "./components/Search";
import Table from "./components/Table";
import Preloader from "./components/Preloader";
import Button  from "./components/Button";
import { sortBy } from 'lodash';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class App extends Component {
  _isMounted = false;

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
      },
      isFetching: false
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
    axios(`${PATH_BASE}/${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_HPP}&${PARAM_PAGE}${page}`)
      .then(result => {
        this._isMounted && this.setSearchTopStories(result.data);
      })
      .catch(error => this._isMounted && this.setState({ error, isFetching: false }));
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
    this._isMounted = true;
    this.setState({ searchKey: DEFAULT_QUERY });
    this.fetchSearchTopStories(DEFAULT_QUERY);
  }

  componentWillUnmount() {
    this._isMounted = false;
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
              onSort={this.onSort}
              sorts={SORTS}
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

export {
  Button,
  Search,
  Table
};