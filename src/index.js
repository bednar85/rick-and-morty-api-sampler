import "./styles.css";

let state = {
  filters: {
    name: '',
    status: '',
    gender: ''
  },
  results: [],
  allResults: []
};

function setFilters(name, value) {
  state = {
    ...state,
    filters: {
      ...state.filters,
      [name]: value
    }
  };
}

function setResults(results) {
  state = {
    ...state,
    results
  }
}

function loadCharacterData() {
  Promise.all([
    fetch("https://rickandmortyapi.com/api/character/?page=1"),
    fetch("https://rickandmortyapi.com/api/character/?page=2"),
    fetch("https://rickandmortyapi.com/api/character/?page=3")
  ]).then(responses => Promise.all(responses.map(response => response.json()))
  ).then(data => {
    // combine all of the results into one array
    const combinedResults = data.flatMap(datum => datum.results);

    // set allResults as a source of truth
    state.allResults = combinedResults;

    setResults(combinedResults);
    renderResults(combinedResults);
  });  
}

function getFilteredResults(filters, results) {
  const noFiltersSet = Object.values(filters).every(currentValue => currentValue === '');

  if (noFiltersSet) {
    return state.allResults;
  }

  // convert filter object to an array of entries
  // exclude key value pairs in which the value is an empty string
  // map over the remaining key value pairs so it's an array of only the active keys
  const activeFilterKeys = Object.entries(filters)
    .filter(currentEntry => currentEntry[1] !== '')
    .map(currentEntry => currentEntry[0]);

  const filteredResults = results.filter(result => {
    const conditions = [];

    // check each condition
    if (activeFilterKeys.includes('name')) {
      const parsedResultName = result.name.toLowerCase();
      const parsedFilterName = filters.name.toLowerCase();

      conditions.push(parsedResultName.includes(parsedFilterName));
    }

    if (activeFilterKeys.includes('status')) {
      conditions.push(result.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (activeFilterKeys.includes('gender')) {
      conditions.push(result.gender.toLowerCase() === filters.gender.toLowerCase());
    }

    return conditions.every(currentValue => currentValue === true);    
  });

  return filteredResults;
}

function renderResults(results) {
  document.getElementById("results").innerHTML = results
    .map(
      datum => `
  <div>    
    <img src="${datum.image}" width="160" height="160" />
    <div>id: ${datum.id}</div>
    <div>name: ${datum.name}</div>
    <div>status: ${datum.status}</div>
    <div>species: ${datum.species}</div>
    <div>gender: ${datum.gender}</div>
    <div>origin: ${datum.origin.name}</div>
    <div>location: ${datum.location.name}</div>
  </div>
  `
    )
    .join("");
}

// const paginationControlsElement = document.querySelector('.pagination-controls');

// paginationControlsElement.addEventListener(
//   "click",
//   (event) => {
//     if (
//       event.target.matches(".pagination-controls-btn--prev") &&
//       state.info.prev
//     ) {
//       loadData(state.info.prev);
//     }

//     if (
//       event.target.matches(".pagination-controls-btn--next") &&
//       state.info.next
//     ) {
//       loadData(state.info.next);
//     }

//     console.log("state:", state);
//   },
//   false
// );

function handleFilterChange(event) {
  const { name, value } = event.target;

  setFilters(name, value);

  const { filters, results } = state;

  const filteredResults = getFilteredResults(filters, results);

  setResults(filteredResults);

  renderResults(filteredResults);
}

const filterControlsElement = document.querySelector('.filter-controls');

filterControlsElement.addEventListener(
  "change",
  event => {
    if (event.target.matches(".filter-controls-select-input")) {
      handleFilterChange(event);
    }
  },
  false
);

// prevent form submittal via the Enter key, it's clearing the text input
filterControlsElement.addEventListener(
  "keydown",
  event => {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  },
  false
);



filterControlsElement.addEventListener(
  "keyup",
  event => {
    if (event.target.matches(".filter-controls-text-input")) {
      handleFilterChange(event);
    }
  },
  false
);

loadCharacterData();
