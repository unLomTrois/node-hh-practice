import Requests from './requests.js';
import { API } from '../types/api/module';

// import d3 from 'd3-array';

class Analyzer {
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // private converter: CurrencyConverter = new CurrencyConverter();

  public prepare = async (
    full_vacancies: API.FullVacancy[]
  ): Promise<API.PreparedVacancy[]> => {
    // нам важны поля key_skills
    const prepared_vacancies = full_vacancies.map((vac: API.FullVacancy) => {
      return {
        id: vac.id,
        name: vac.name,
        area: vac.area,
        key_skills: vac.key_skills,
        has_test: vac.has_test,
        test: vac.test,
        billing_type: vac.billing_type,
        accept_incomplete_resumes: vac.accept_incomplete_resumes
      };
    });

    return prepared_vacancies;
  };

  // public start = async (
  //   full_vacancies: API.FullVacancy[]
  // ): Promise<API.FullVacancy[]> => {
  //   console.log(await this.converter.convertRUBtoUSD(47000));

  // };
}

class Core {
  private requests: Requests = new Requests();
  private analyzer: Analyzer = new Analyzer();

  /**
   * запрашивает списки вакансий из Request-модуля, возвращает их
   * @param query - запрос, объект API.Query
   * @param limit - ограничение по количеству требуемых к выдаче вакансий
   */
  public getVacancies = async (
    url: API.URL,
    limit: number
  ): Promise<API.Vacancy[]> => {
    return this.requests.getVacancies(url, limit);
  };

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
    const full_vacancies: API.FullVacancy[] = await this.requests.getFullVacancies(
      limited_urls
    );

    return full_vacancies;
  };

  public analyze = async (
    full_vacancies: API.FullVacancy[]
  ): Promise<API.FullVacancy[]> => {
    return full_vacancies; //this.analyzer.start(full_vacancies);
  };

  public prepare = async (
    full_vacancies: API.FullVacancy[]
  ): Promise<API.PreparedVacancy[]> => {
    return this.analyzer.prepare(full_vacancies);
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
