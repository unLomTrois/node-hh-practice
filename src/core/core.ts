import Requests from './requests.js';
import { API } from '../types/api/module';

class Core {
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
  ): Promise<API.FullVacancy[]> => {
    // получить поля url
    const urls: string[] = short_vacancies.map((vac) => vac.url);

    // профетчить полученный массив url-ов через модуль запросов
    const full_vacancies: API.FullVacancy[] = await this.requests.getFullVacancies(
      urls
    );

    return full_vacancies;
  };
}

export default Core;
