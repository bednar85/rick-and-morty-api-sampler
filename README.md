# Rick and Morty API Sampler

Using vanilla Javascript I created an API sampler app for the [Rick and Morty API](https://rickandmortyapi.com/documentation/#get-all-locations). It takes the Characters, Locations, and Episodes endpoints and samples them in various ways.

## Characters

For this endpoint, I am grabbing 5 pages worth of data and combining them together. I then wrote custom filtering and sorting logic around all of the character data.

## Locations and Episodes

For these API endpoints, I am grabbing all of the data for each endpoint, combining it together like before, then sorting the results based on the most characters which appear in each location and episode. I am grabbing the first 5 from each and displaying it in a card.
