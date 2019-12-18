import "./styles.css";

let state = {};

// merge the current state with the new state
function setState(newState) {
  state = {
    ...state,
    ...newState
  };
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

    setState({ results: combinedResults });
    renderResults(combinedResults);
  });  
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

  },
  false
);

loadCharacterData();
