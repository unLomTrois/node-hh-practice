import Requests from './requests.js';
import Analyzer from './analyzer.js';
import Prepare from './prepare.js';

import { API } from '../types/api/module';

class Core {
  public requests: Requests = new Requests();
  public analyzer: Analyzer = new Analyzer();
  public prepare: Prepare = new Prepare();

  public getClusters = async (url: API.URL): Promise<API.Vacancy[]> => {
    return this.requests.getClusters(url);
  };

  /**
   * запрашивает полное представление вакансий из Request-модуля, возвращает их
   * @param short_vacancies - массив вакансий
   */
  public getFullVacancies = async (
    short_vacancies: API.Vacancy[],
    limit: number
  ): Promise<API.FullVacancy[]> => {
    // получить поля url
    const urls: string[] = this.getUrlsToFull(short_vacancies);

    const limited_urls = urls.slice(0, limit);

    // профетчить полученный массив url-ов через модуль запросов
    const full_vacancies: API.FullVacancy[] = await this.requests.getFullVacancies(limited_urls);

    return full_vacancies;
  };

  /**
   * возвращает массив из строк вида URL, ведущие к полному представлению вакансии
   * @param short_vacancies - массив сокращённых вакансий
   */
  private getUrlsToFull(short_vacancies: any[]): string[] {
    return short_vacancies.map((vac) => vac.url);
  }
}

export default Core;
