import './styles.css';

import { chunk, compare, sortByKey, sortByArrayLength } from './utils.js';

const itemsPerPage = 9;

const initialState = {
  filters: {
    name: '',
    status: '',
    gender: ''
  },
  sortOptions: {
    sortBy: 'id',
    sortDirection: 'ascending'
  },
  currentPageIndex: 0,
  characters: [],
  locations: [],
  episodes: []
};

const completeData = {
  allCharacters: [],
  allLocations: [],
  allEpisodes: []
};

let state = { ...initialState };

// Update Various Sections of State
function setFilters(key, value) {
  state = {
    ...state,
    filters: {
      ...state.filters,
      [key]: value
    },
    currentPageIndex: 0
  };
}

function setSortOptions(key, value) {
  state = {
    ...state,
    sortOptions: {
      ...state.sortOptions,
      [key]: value
    },
    currentPageIndex: 0
  };
}

function setCharacters(characters) {
  state = {
    ...state,
    characters
  }
}

function setLocations(locations) {
  state = {
    ...state,
    locations
  }
}

function setEpisodes(episodes) {
  state = {
    ...state,
    episodes
  }
}

function resetFilters() {
  state = {
    ...state,
    filters: {
      ...initialState.filters
    },
    currentPageIndex: initialState.currentPageIndex
  };
}

function setCurrentPageIndex(pageIndex) {
  state = {
    ...state,
    currentPageIndex: pageIndex
  };
}

// Load Data Method
function loadCharacterData() {
  Promise.all([
    fetch('https://rickandmortyapi.com/api/character/?page=1'),
    fetch('https://rickandmortyapi.com/api/character/?page=2'),
    fetch('https://rickandmortyapi.com/api/character/?page=3'),
    fetch('https://rickandmortyapi.com/api/character/?page=4'),
    fetch('https://rickandmortyapi.com/api/character/?page=5')
  ]).then(responses => Promise.all(responses.map(response => response.json()))
  ).then(data => {
    // combine all of the characters into one array
    const allCharacters = data.flatMap(datum => datum.results);
    
    // set allCharacters in the initial state as a source of truth
    completeData.allCharacters = allCharacters;

    setCharacters(allCharacters);
    renderCharacters(allCharacters);
  });  
}

function loadLocationData() {
  Promise.all([
    fetch('https://rickandmortyapi.com/api/location?page=1'),
    fetch('https://rickandmortyapi.com/api/location?page=2'),
    fetch('https://rickandmortyapi.com/api/location?page=3'),
    fetch('https://rickandmortyapi.com/api/location?page=4')
  ]).then(responses => Promise.all(responses.map(response => response.json()))
  ).then(data => {
    // combine all of the results into one array
    const allLocations = data.flatMap(datum => datum.results);
    
    // set allLocations in the initial state as a source of truth
    completeData.allLocations = allLocations;
    
    const sortedLocations = sortByArrayLength(allLocations, 'descending', 'residents');

    setLocations(sortedLocations);
    renderLocationsList(sortedLocations);
  });  
}

function loadEpisodeData() {
  Promise.all([
    fetch('https://rickandmortyapi.com/api/episode?page=1'),
    fetch('https://rickandmortyapi.com/api/episode?page=2')
  ]).then(responses => Promise.all(responses.map(response => response.json()))
  ).then(data => {
    // combine all of the results into one array
    const allEpisodes = data.flatMap(datum => datum.results);
    
    // set allEpisodes in the initial state as a source of truth
    completeData.allEpisodes = allEpisodes;

    const sortedEpisodes = sortByArrayLength(allEpisodes, 'descending', 'characters');
    
    setEpisodes(sortedEpisodes);
    renderEpisodesList(sortedEpisodes);
  });  
}

// Filter Logic
function getSortedAndFilteredCharacters(filters, characters) {

  // Filter Logic
  // filters are applied if any of the values in Object.values(filters) are set to something other than an empty string or only contains spaces
  const filtersApplied = Object.values(filters).some(currentValue => currentValue.trim() !== '');

  // start by setting filteredCharacters to the entire data set
  let filteredCharacters = completeData.allCharacters;
  
  if (filtersApplied) {
    // convert filter object to an array of entries
    // exclude key value pairs in which the value is an empty string
    // map over the remaining key value pairs so it's an array of only the active keys
    const activeFilterKeys = Object.entries(filters)
      .filter(currentEntry => currentEntry[1].trim() !== '')
      .map(currentEntry => currentEntry[0]);

    filteredCharacters = characters.filter(result => {
      const conditions = {};

      // console.log('');
      // console.log('  result.name:', result.name);

      // check each condition
      if (activeFilterKeys.includes('name')) {
        const parsedResultName = result.name.toLowerCase();
        const parsedFilterName = filters.name.toLowerCase().trim();

        conditions.name = parsedResultName.includes(parsedFilterName);
      }

      if (activeFilterKeys.includes('status')) {
        // console.log('  result.status:', result.status);

        conditions.status = result.status.toLowerCase() === filters.status.toLowerCase();
      }

      if (activeFilterKeys.includes('gender')) {
        // console.log('  result.gender:', result.gender);

        conditions.gender = result.gender.toLowerCase() === filters.gender.toLowerCase();
      }

      // console.log('  conditions:', conditions);

      return Object.values(conditions).every(currentValue => currentValue === true);    
    });
  }

  // if filteredCharacters is empty, exit early and skip the sorting logic
  if (!filteredCharacters.length) {
    return filteredCharacters;
  }

  // Sorting Logic
  const { sortOptions } = state;


  const { sortBy, sortDirection } = sortOptions;

  let sortedCharacters = filteredCharacters;

  if (sortBy === 'id') {
    console.log('  id');
    sortedCharacters = sortByKey(filteredCharacters, sortDirection, 'numerical', sortBy);
  } else if (sortBy === 'episodes') {
    console.log('  episodes');
    sortedCharacters = sortByArrayLength(filteredCharacters, sortDirection, 'episode');
  } else {
    console.log('  else');
    sortedCharacters = sortByKey(filteredCharacters, sortDirection, 'alphabetical', sortBy);
  }


  return sortedCharacters;
}

function getPaginatedCharacters(characters) { return chunk(characters, itemsPerPage); }

function getTotalPages(characters) {
  return characters.length ? Math.ceil(characters.length / itemsPerPage) : 0;
}

// DOM Manipulation
function renderCharacters(characters) {
  // it would be easiest if right here is where we did the chunking and determined which page sub array to use
  const { currentPageIndex } = state;

  console.log('');
  console.log('renderResults');
  console.log('  results:', results);

  const paginatedCharacters = getPaginatedCharacters(characters);

  console.log('  paginatedResults:', paginatedResults);

  if (!paginatedCharacters.length) {
    document.querySelector('.character-cards').innerHTML = '<div class="no-results-message">No characters match those filters.</div>';
  } else {
    document.querySelector('.character-cards').innerHTML = paginatedCharacters[currentPageIndex]
      .map(datum => `
        <div class="character-card">    
          <img class="character-card-image" src="${datum.image}" width="160" height="160" />
          <h3 class="character-card-heading">${datum.name}</h3>
          <div class="character-card-body">
            <p class="character-card-copy">Status: ${datum.status}</p>
            <p class="character-card-copy">Gender: ${datum.gender}</p>
            <p class="character-card-copy">Last Known Location: ${datum.location.name}</p>
            <p class="character-card-copy">Appeared in ${datum.episode.length} episodes</p>
          </div>
        </div>
      `)
      .join('');
  }

  updatePaginationMessaging(currentPageIndex, paginatedCharacters.length);
}

function updatePaginationMessaging(currentPageIndex, totalPages) {
  const paginationMessaging = totalPages === 0 ? '' : `Page ${currentPageIndex + 1} of ${totalPages}`;

  document.querySelector('.pagination-controls-pagination-status').innerHTML = paginationMessaging;
}

function renderLocationsList(locations) {
  document.querySelector('.locations-card .data-card-list').innerHTML = locations
    .slice(0, 5)
    .map(datum => `
      <li class="data-card-list-item">    
        <div class="data-card-list-item-heading">${datum.name}</div>
        <div class="data-card-list-item-subheading">located in the ${datum.dimension}</div>
        <div class="data-card-list-item-text">${datum.residents.length} residents</div>
      </li>
    `)
    .join('');
}

function renderEpisodesList(episodes) {
  document.querySelector('.episodes-card .data-card-list').innerHTML = episodes
    .slice(0, 5)
    .map(datum => `
      <li class="data-card-list-item">
        <div class="data-card-list-item-heading">${datum.name}</div>
        <div class="data-card-list-item-subheading">${datum.episode}</div>
        <div class="data-card-list-item-text">${datum.characters.length} characters</div>
      </li>
    `)
    .join('');
}

// Event Handlers
function handleFilterChange(event) {
  const { name, value } = event.target;

  setFilters(name, value);

  const { allCharacters } = completeData;
  const { filters, characters } = state;
  
  const filteredCharacters = getSortedAndFilteredCharacters(filters, allCharacters);

  setCharacters(filteredCharacters);
  renderCharacters(filteredCharacters);
}

function handleSortChange(event) {
  const { name, value } = event.target;

  setSortOptions(name, value);

  const { allCharacters } = completeData;
  const { filters, characters } = state;
  
  const filteredCharacters = getSortedAndFilteredCharacters(filters, allCharacters);

  setCharacters(filteredCharacters);
  renderCharacters(filteredCharacters);
}

function handlePageChange(event) {
  const { currentPageIndex, characters } = state;
  const totalPages = getTotalPages(characters);

  // if totalPages is greater than zero, set lastPageIndex to totalPages - 1
  const lastPageIndex = totalPages > 0 ? totalPages - 1 : 0;
  const goBack = event.target.matches('.pagination-controls-btn--prev') && currentPageIndex > 0;
  const goForward = event.target.matches('.pagination-controls-btn--next') && currentPageIndex < lastPageIndex;

  if (goBack) {
    setCurrentPageIndex(currentPageIndex - 1);
  } else if (goForward) {
    setCurrentPageIndex(currentPageIndex + 1);
  }

  if (goBack || goForward) {
    renderCharacters(characters);
  }
}

// Event Listeners
const filterControlsElement = document.querySelector('.filter-form');

filterControlsElement.addEventListener(
  'change',
  event => {
    if (event.target.matches('.filter-form-select-input')) {
      handleFilterChange(event);
    }
  }
);

const sortControlsElement = document.querySelector('.sort-form');

sortControlsElement.addEventListener(
  'change',
  event => {
    if (event.target.matches('.sort-form-select-input')) {
      handleSortChange(event);
    }
  }
);

// prevent form submittal via the Enter key, it's clearing the text input
filterControlsElement.addEventListener(
  'keydown',
  event => {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  }
);

filterControlsElement.addEventListener(
  'keyup',
  event => {
    if (event.target.matches('.filter-form-text-input')) {
      handleFilterChange(event);
    }
  }
);

const paginationControlsElement = document.querySelector('.pagination-controls');

paginationControlsElement.addEventListener('click', event => handlePageChange(event));

// Initial Data Call
loadCharacterData();
loadLocationData();
loadEpisodeData();
