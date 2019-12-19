import './styles.css';

import { chunk } from './utils.js';

const initialState = {
  filters: {
    name: '',
    status: '',
    gender: ''
  },
  currentPage: 0,
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
    currentPage: 0
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
    currentPage: initialState.currentPage
  };
}

function setCurrentPage(pageIndex) {
  state = {
    ...state,
    currentPage: pageIndex
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
  console.log('');
  console.log('getFilteredResults');
  console.log('  filters:', filters);
  console.log('  results:', results);

  const noFiltersSet = Object.values(filters).every(currentValue => currentValue === '');
  
  console.log('  noFiltersSet:', noFiltersSet);

  if (noFiltersSet) {
    return initialState.allResults;
  }

  // convert filter object to an array of entries
  // exclude key value pairs in which the value is an empty string
  // map over the remaining key value pairs so it's an array of only the active keys
  const activeFilterKeys = Object.entries(filters)
    .filter(currentEntry => currentEntry[1] !== '')
    .map(currentEntry => currentEntry[0]);

  console.log('  activeFilterKeys:', activeFilterKeys);

  const filteredResults = results.filter(result => {
    const conditions = {};

    console.log('');
    console.log('  result.name:', result.name);
    
    // check each condition
    if (activeFilterKeys.includes('name')) {
      const parsedResultName = result.name.toLowerCase();
      const parsedFilterName = filters.name.toLowerCase();

      conditions.name = parsedResultName.includes(parsedFilterName);
    }

    if (activeFilterKeys.includes('status')) {
      console.log('  result.status:', result.status);

      conditions.status = result.status.toLowerCase() === filters.status.toLowerCase();
    }

    if (activeFilterKeys.includes('gender')) {
      console.log('  result.gender:', result.gender);

      conditions.gender = result.gender.toLowerCase() === filters.gender.toLowerCase();
    }

    console.log('  conditions:', conditions);

    return Object.values(conditions).every(currentValue => currentValue === true);    
  });

  return filteredResults;
}

// probably change this so it sets it in the state rather than "getting it each time"
function getPaginatedResults(results) { return chunk(results, 10) };

// DOM Manipulation
function renderResults(results) {
  // it would be easiest if right here is where we did the chunking and determined which page sub array to use
  const { currentPage } = state;

  console.log('');
  console.log('renderResults');
  console.log('  results:', results);

  const paginatedResults = getPaginatedResults(results);

  console.log('  paginatedResults:', paginatedResults);

  if (!paginatedResults.length) {
    document.getElementById('results').innerHTML = '<div class="">No results</div>';
  } else {
    document.getElementById('results').innerHTML = paginatedResults[currentPage]
      .map(datum => `
        <div class="">    
          <img class="" src="${datum.image}" width="160" height="160" />
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
}

// Event Handlers
function handleFilterChange(event) {
  console.log('');
  console.log('handleFilterChange');
  console.log('  state:', state);

  const { name, value } = event.target;

  setFilters(name, value);

  const { allResults } = initialState;
  const { filters, results } = state;
  
  const filteredResults = getFilteredResults(filters, allResults);

  setResults(filteredResults);
  renderResults(filteredResults);
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

paginationControlsElement.addEventListener(
  'click',
  (event) => {
    const paginatedResults = getPaginatedResults(state.results);

    console.log('');
    console.log('button click event listener');
    console.log('  paginatedResults:', paginatedResults);

    const lastPage = paginatedResults.length - 1;
    const goBack = event.target.matches('.pagination-controls-btn--prev') && state.currentPage > 0;
    const goForward = event.target.matches('.pagination-controls-btn--next') && state.currentPage !== lastPage;

    if (goBack) {
      setCurrentPage(state.currentPage - 1);
    } else if (goForward) {
      setCurrentPage(state.currentPage + 1);
    }

    if (goBack || goForward) {
      renderResults(state.results);
    }

    console.log('state:', state);
  },
  false
);

// Initial Data Call
loadCharacterData();
