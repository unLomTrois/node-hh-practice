import { Parser } from '../types/core/module';
import Requests from './requests.js';
import { API } from '../types/api/module';
import { Response } from 'node-fetch';

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

  public fetchCache = async (): Promise<Response> => {
    return this.requests.fetchCache();
  };
}

export default Core;
