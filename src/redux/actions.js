const FETCHING_CONTRACTS = 'FETCHING_CONTRACTS';
const FETCH_CONTRACTS_SUCCESS = 'FETCH_CONTRACTS_SUCCESS';
const FETCHING_GAMES = 'FETCHING_GAMES';
const FETCH_GAMES_SUCCESS = 'FETCH_GAMES_SUCCESS';
const INIT_WEB3_SUCCESS = 'INIT_WEB3_SUCCESS';

export const fetchContracts = () => ({
  type: FETCHING_CONTRACTS,
});

export const fetchGames = () => ({
  type: FETCHING_GAMES,
});

export default {
  FETCHING_CONTRACTS,
  FETCH_CONTRACTS_SUCCESS,
  FETCHING_GAMES,
  FETCH_GAMES_SUCCESS,
  INIT_WEB3_SUCCESS,
  ERROR: 'ERROR',
}


