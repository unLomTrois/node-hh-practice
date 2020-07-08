import Requests from './requests.js';
import { API } from '../types/api/module';

class Core {
  private requests: Requests = new Requests();

  /**
   * запрашивает списки вакансий из Request-модуля, возвращает их
   * @param query - запрос, объект API.Query
   * @param limit - ограничение по количеству требуемых к выдаче вакансий
   */
  public getVacancies = async (
    query: API.Query,
    limit: number
  ): Promise<API.Vacancy[]> => {
    return this.requests.getVacancies(query, limit);
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
    const full_vacancies: API.FullVacancy[] = await this.requests.getFullVacancies(
      limited_urls
    );

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
