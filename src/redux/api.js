import { apiEndpoint } from '../config';
import { getResponse, getRequest, makeRequest } from "../util/requests";

export const fetchContracts = () => getResponse(makeRequest(
  apiEndpoint + '/contracts', getRequest()
));

export const fetchGames = () => getResponse(makeRequest(
  apiEndpoint + '/fixtures-01', getRequest()
));

export const fetchGameResult = (gameId) => getResponse(makeRequest(
  apiEndpoint + `/fixtures-01/get-result?gameId=${gameId}`, getRequest()
));