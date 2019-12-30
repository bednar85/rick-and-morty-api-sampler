import React, { Component } from 'react';

import {
  capitalize,
  chunk,
  sortByArrayLength,
  sortByKey
} from './../../utils/';

class CharacterCards extends Component {
  constructor(props) {
    super(props);

    this.itemsPerPage = 9;

    this.state = {
      currentPageIndex: 0
    };
  }

  get filteredCharacters() {
    const { allCharacters, filters, sortOptions } = this.props;

    // Filter Logic
    // filters are applied if any of the values in Object.values(filters) are set to something other than an empty string or only spaces
    const filtersApplied = Object.values(filters).some(
      currentValue => currentValue.trim() !== ''
    );

    // start by setting filteredCharacters to the entire data set
    let filteredCharacters = allCharacters;

    if (filtersApplied) {
      /**
       * convert filter object to an array of entries
       * exclude key value pairs in which the value is an empty string
       * map over the remaining key value pairs so it's an array of only the active filter keys
       */
      const activeFilterKeys = Object.entries(filters)
        .filter(currentEntry => currentEntry[1].trim() !== '')
        .map(currentEntry => currentEntry[0]);

      filteredCharacters = allCharacters.filter(result => {
        const conditions = {};

        // check each condition
        activeFilterKeys.forEach(currentFilterKey => {
          const resultValue = result[currentFilterKey].toLowerCase();
          const filterValue = filters[currentFilterKey].toLowerCase();

          if (currentFilterKey === 'name') {
            conditions.name = resultValue.includes(filterValue.trim());
          } else {
            conditions[currentFilterKey] = resultValue === filterValue;
          }
        });

        return Object.values(conditions).every(
          currentValue => currentValue === true
        );
      });
    }

    // if filteredCharacters is empty, exit early and skip the sorting logic
    if (!filteredCharacters.length) {
      return filteredCharacters;
    }

    // Sorting Logic
    const { sortBy, sortDirection } = sortOptions;

    let sortedCharacters = filteredCharacters;

    if (sortBy === 'id') {
      sortedCharacters = sortByKey(
        filteredCharacters,
        sortDirection,
        'numerical',
        sortBy
      );
    } else if (sortBy === 'episodes') {
      sortedCharacters = sortByArrayLength(
        filteredCharacters,
        sortDirection,
        'episode'
      );
    } else {
      sortedCharacters = sortByKey(
        filteredCharacters,
        sortDirection,
        'alphabetical',
        sortBy
      );
    }

    return sortedCharacters;
  }

  get paginatedCharacters() {
    const filteredCharacters = this.filteredCharacters;
    const paginatedCharacters = chunk(filteredCharacters, this.itemsPerPage);

    console.log('');
    console.log('CharacterCards - get paginatedCharacters');
    console.log('  paginatedCharacters:', paginatedCharacters);

    return paginatedCharacters;
  }

  get characterCards() {
    const { currentPageIndex } = this.state;

    // console.log('');
    // console.log('paginatedCharacters:', paginatedCharacters);

    const paginatedCharacters = this.paginatedCharacters;

    if (!paginatedCharacters.length) {
      return (
        <div className="no-results-message">
          Sorry, there are no characters that match those filters.
        </div>
      );
    } else {
      return paginatedCharacters[currentPageIndex].map(datum => {
        const statusValue = capitalize(datum.status);
        const genderValue = capitalize(datum.gender);
        const episodeLabel = datum.episode.length > 1 ? `episodes` : `episode`;

        return (
          <div className="character-card" key={datum.id}>
            <img
              className="character-card-image"
              src={datum.image}
              width="160"
              height="160"
            />
            <h3 className="character-card-heading">{datum.name}</h3>
            <div className="character-card-body">
              <p className="character-card-copy">Status: {statusValue}</p>
              <p className="character-card-copy">Gender: {genderValue}</p>
              <p className="character-card-copy">
                Last Known Location: {datum.location.name}
              </p>
              <p className="character-card-copy">
                Appeared in {datum.episode.length} {episodeLabel}
              </p>
            </div>
          </div>
        );
      });
    }

    // updatePaginationMessaging(currentPageIndex, paginatedCharacters.length);
  }

  render() {
    // const { visible } = this.state;

    console.log('');
    console.log('CharacterCards - render');
    console.log('  this.props:', this.props);
    console.log('  this.state:', this.state);

    return <div className="">{this.characterCards}</div>;
  }
}

export default CharacterCards;
