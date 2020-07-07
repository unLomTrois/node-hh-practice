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

  public getFullVacancies = async (
    short_vacancies: API.Vacancy[]
  ): Promise<API.Vacancy[]> => {
    // получить поля url
    const urls: string[] = short_vacancies.map((vac) => vac.url);

    // профетчить полученный массив url-ов через модуль запросов
    const full_vacancies: API.Vacancy[] = await this.requests.getFullVacancies(
      urls
    );

    return full_vacancies;
    // get short_vacancies (vacancies) from log
    // get array of links to full from short_vacansies
    // make fetch by each vacancies
  };
}

export default Core;
