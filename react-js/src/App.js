import React, { Component } from 'react';
import './App.css';

import CharacterCards from './components/CharacterCards/CharacterCards';

class App extends Component {
  constructor(props) {
    super(props);

    this.loadCharacterData = this.loadCharacterData.bind(this);

    this.state = {
      allCharacters: []
    };
  }

  componentDidMount() {
    this.loadCharacterData();
  }

  loadCharacterData() {
    Promise.all([
      fetch('https://rickandmortyapi.com/api/character/?page=1'),
      fetch('https://rickandmortyapi.com/api/character/?page=2'),
      fetch('https://rickandmortyapi.com/api/character/?page=3'),
      fetch('https://rickandmortyapi.com/api/character/?page=4'),
      fetch('https://rickandmortyapi.com/api/character/?page=5')
    ])
      .then(responses =>
        Promise.all(responses.map(response => response.json()))
      )
      .then(data => {
        // combine all of the results into one array
        const allCharacters = data.flatMap(datum => datum.results);

        // set allCharacters in the initial state as a source of truth
        this.setState({
          allCharacters
        });
      });
  }

  render() {
    const { allCharacters } = this.state;

    const filters = {
      name: '',
      status: '',
      gender: ''
    };

    const sortOptions = {
      sortBy: 'id',
      sortDirection: 'ascending'
    };

    const characterCardsProps = {
      allCharacters,
      filters,
      sortOptions
    };

    return (
      <div>
        <CharacterCards {...characterCardsProps} />
      </div>
    );
  }
}

export default App;
