import { apiEndpoint } from '../config';
import { getResponse, getRequest, makeRequest } from "../util/requests";

export const fetchContracts = () => getResponse(makeRequest(
  apiEndpoint + '/contracts', getRequest()
));