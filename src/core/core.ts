import { Parser } from '../types/core/module';
import Requests from './requests.js';
import { API } from '../types/api/module';

class Core implements Parser.Core {
  private requests: Requests = new Requests();

  /**
   * makeRequest
   */
  public makeRequest = async (
    query: API.Query,
    limit: number
  ): Promise<API.Vacancy[]> => {
    return this.requests.getVacancies(query, limit);
  };
}

export default Core;
