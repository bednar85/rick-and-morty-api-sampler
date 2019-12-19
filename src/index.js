import './styles.css';

import { chunk } from './utils.js';

const itemsPerPage = 10;

const initialState = {
  filters: {
    name: '',
    status: '',
    gender: ''
  },
  currentPageIndex: 0,
  results: [],
  allResults: []
};

let state = { ...initialState };

// Update Various Sections of State
function setFilters(name, value) {
  state = {
    ...state,
    filters: {
      ...state.filters,
      [name]: value
    },
    currentPageIndex: 0
  };
}

function setResults(results) {
  state = {
    ...state,
    results
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
    // combine all of the results into one array
    const combinedResults = data.flatMap(datum => datum.results);
    
    // set allResults in the initial state as a source of truth
    initialState.allResults = combinedResults;

    setResults(combinedResults);
    renderResults(combinedResults);
  });  
}

// Filter Logic
function getFilteredResults(filters, results) {
  // no filters are applied if every value in Object.values(filters) is either an empty string or only contains spaces
  const noFiltersApplied = Object.values(filters).every(currentValue => currentValue.trim() === '');

  if (noFiltersApplied) {
    return initialState.allResults;
  }

  // convert filter object to an array of entries
  // exclude key value pairs in which the value is an empty string
  // map over the remaining key value pairs so it's an array of only the active keys
  const activeFilterKeys = Object.entries(filters)
    .filter(currentEntry => currentEntry[1].trim() !== '')
    .map(currentEntry => currentEntry[0]);

  const filteredResults = results.filter(result => {
    const conditions = {};

    // check each condition
    if (activeFilterKeys.includes('name')) {
      const parsedResultName = result.name.toLowerCase();
      const parsedFilterName = filters.name.toLowerCase().trim();

      conditions.name = parsedResultName.includes(parsedFilterName);
    }

    if (activeFilterKeys.includes('status')) {
      conditions.status = result.status.toLowerCase() === filters.status.toLowerCase();
    }

    if (activeFilterKeys.includes('gender')) {
      conditions.gender = result.gender.toLowerCase() === filters.gender.toLowerCase();
    }

    return Object.values(conditions).every(currentValue => currentValue === true);    
  });

  return filteredResults;
}

function getPaginatedResults(results) { return chunk(results, itemsPerPage); }

function getTotalPages(results) {
  return results.length ? Math.ceil(results.length / itemsPerPage) : 0;
}

// DOM Manipulation
function renderResults(results) {
  // it would be easiest if right here is where we did the chunking and determined which page sub array to use
  const { currentPageIndex } = state;

  console.log('');
  console.log('renderResults');
  console.log('  results:', results);

  const paginatedResults = getPaginatedResults(results);

  console.log('  paginatedResults:', paginatedResults);

  if (!paginatedResults.length) {
    document.getElementById('results').innerHTML = '<div class="">No results match those filters.</div>';
  } else {
    document.getElementById('results').innerHTML = paginatedResults[currentPageIndex]
      .map(datum => `
        <div class="">    
          <img class="" src="${datum.image}" width="160" height="160" />
          <div class="">id: ${datum.id}</div>
          <div class="">name: ${datum.name}</div>
          <div class="">status: ${datum.status}</div>
          <div class="">species: ${datum.species}</div>
          <div class="">gender: ${datum.gender}</div>
          <div class="">origin: ${datum.origin.name}</div>
          <div class="">location: ${datum.location.name}</div>
        </div>
      `)
      .join('');
  }

  updatePaginationMessaging(currentPageIndex, paginatedResults.length);
}

function updatePaginationMessaging(currentPageIndex, totalPages) {
  const paginationMessaging = totalPages === 0 ? '' : `Page ${currentPageIndex + 1} of ${totalPages}`;

  document.querySelector('.pagination-controls-pagination-status').innerHTML = paginationMessaging;
}

// Event Handlers
function handleFilterChange(event) {
  console.log('');
  console.log('handleFilterChange');
  console.log('  state:', state);

  const { name, value } = event.target;

  setFilters(name, value);

  const { allResults } = initialState;
  const { filters, currentPageIndex, results } = state;
  
  const filteredResults = getFilteredResults(filters, allResults);

  setResults(filteredResults);
  renderResults(filteredResults);
}

function handlePageChange(event) {
  const { currentPageIndex, results } = state;
  const totalPages = getTotalPages(results);

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
    renderResults(results);
  }
}

// Event Listeners
const filterControlsElement = document.querySelector('.filter-controls');

filterControlsElement.addEventListener(
  'change',
  event => {
    if (event.target.matches('.filter-controls-select-input')) {
      handleFilterChange(event);
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
    if (event.target.matches('.filter-controls-text-input')) {
      handleFilterChange(event);
    }
  }
);

const paginationControlsElement = document.querySelector('.pagination-controls');

paginationControlsElement.addEventListener('click', event => handlePageChange(event));

// Initial Data Call
loadCharacterData();
