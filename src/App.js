import React, { Component } from 'react';
import './App.css';
import Search from './components/Search';
import Table from './components/Table';
import Preloader from "./components/Preloader";
import Button from './components/Button';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_HPP = "hitsPerPage=10";
const PARAM_PAGE = "page=";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: "",
      isFetching: false
    };
  }

  setSearchTopStories = result => {
    const { hits, page } = result;

    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [ ...oldHits,  ...hits ];
    
    this.setState({
      result: { hits: updatedHits, page }
    });
  }

  onDismiss = id => {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({ result: { ...this.state.result, hits: updatedList } });
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
    const page = (result && result.page) || 0;
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
        
        {result && 
            <Table 
              list={result.hits}
              onDismiss={this.onDismiss}
              isFetching={this.state.isFetching}
              fetchStories={this.fetchSearchTopStories}
              currentSearchTerm={currentSearchTerm}
              page={page}
            />
        }
      </div>
    )
  }
}

export default App;
