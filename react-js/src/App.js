import React from 'react';
import './App.css';

import CharacterCards from './components/CharacterCards/CharacterCards';

function App() {
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
    filters,
    sortOptions
  };

  return (
    <div>
      <CharacterCards {...characterCardsProps} />
    </div>
  );
}

export default App;
