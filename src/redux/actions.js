const createPromise = (action) => (dispatch) => {
  return new Promise((resolve, reject) => dispatch({...action, meta: {resolve, reject}}));
};

const FETCHING_CONTRACTS = 'FETCHING_CONTRACTS';
const FETCH_CONTRACTS_SUCCESS = 'FETCH_CONTRACTS_SUCCESS';
export const fetchContracts = (drizzle) => ({
  type: FETCHING_CONTRACTS,
  drizzle
});

export default {
  FETCHING_CONTRACTS,
  FETCH_CONTRACTS_SUCCESS,
  ERROR: 'ERROR',
}