import Requests from './requests.js';
import { API } from '../types/api/module';

// import d3 from 'd3-array';

class CurrencyConverter {
  private requests: Requests = new Requests();
  private currencyRatesRUBtoUSD: number | undefined;
  private linkToCurrencies = 'https://www.cbr-xml-daily.ru/daily_json.js';

  constructor() {
    this.getCurrency();
  }

  public getCurrency = async () => {
    this.currencyRatesRUBtoUSD = await this.requests.getCurrency(
      this.linkToCurrencies
    );
  };

  public convertRUBtoUSD = async (rub: number): Promise<number> => {
    return (
      rub /
      (this.currencyRatesRUBtoUSD ??
        (await this.requests.getCurrency(this.linkToCurrencies)))
    );
  };
}

class Analyzer {
  private converter: CurrencyConverter = new CurrencyConverter();

  public start = async (
    full_vacancies: API.FullVacancy[]
  ): Promise<API.FullVacancy[]> => {
    console.log(await this.converter.convertRUBtoUSD(47000));

    // массив вакансий с указанной ЗП
    const with_salary: API.FullVacancy[] = full_vacancies.filter(
      (vac) => vac.salary !== null
    );
    // console.log('with set salary', with_salary.length);

    const with_salary_limit: API.FullVacancy[] = with_salary.filter(
      (vac) => vac.salary.from !== null && vac.salary.to !== null
    );

    // console.log('with limit:', with_salary_limit.length);

    with_salary_limit.sort(
      (vac1: API.FullVacancy, vac2: API.FullVacancy) =>
        vac2.salary.to - vac1.salary.to
    );

    return with_salary_limit;
  };
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
    return this.analyzer.start(full_vacancies);
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
