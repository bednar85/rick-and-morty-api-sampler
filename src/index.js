import "./styles.css";

let state = {};

// merge the current state with the new state
function setState(newState) {
  state = {
    ...state,
    ...newState
  };
}

function loadData(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { info, results } = data;

      setState({ info, results });
      renderResults(data.results);
    })
    .catch(error => {
      console.log("Error: ", error);
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

const paginationElement = document.querySelector('.pagination-controls');

paginationElement.addEventListener(
  "click",
  (event) => {
    if (
      event.target.matches(".pagination-controls-btn--prev") &&
      state.info.prev
    ) {
      loadData(state.info.prev);
    }

    if (
      event.target.matches(".pagination-controls-btn--next") &&
      state.info.next
    ) {
      loadData(state.info.next);
    }

    console.log("state:", state);
  },
  false
);

loadData("https://rickandmortyapi.com/api/character/");
