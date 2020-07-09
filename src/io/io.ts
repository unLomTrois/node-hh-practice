import Core from '../core/core.js';
import Save from './save.js';

import { IO } from '../types/io/module';
import { API } from '../types/api/module.js';

import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Модуль IO
 * @link https://trello.com/c/oFJsCDZK
 */
class IO {
  private core = new Core();
  private save = new Save();

  /**
   * находит, получает и сохраняет массивы вакансий по @request
   * @param request - объект IO.Request
   */
  public search = async (request: IO.Request): Promise<void> => {
    const query: API.Query = {
      no_magic: true,
      per_page: 100,
      page: 0,
      area: request.area,
      text: request.text
    };

    const base_api_url: API.URL = {
      baseURL: 'https://api.hh.ru',
      method: '/vacancies',
      query: query
    };

    // получить вакансии
    const vacancies: API.Vacancy[] = await this.getVacancies(
      base_api_url,
      request.limit
    );

    // сохранить собранные вакансии
    this.saveVacancies(vacancies, 'vacancies.json');

    // cluster part
  };

  /**
   * Получает и сохраняет массивы полного представления вакансий
   */
  public getFull = async (limit = 2000): Promise<void> => {
    const short_vacancies = this.getVacanciesFromLog();

    /**
     * @todo API.Vacancy - это общий вид, его нужно конкретизировать, есть также полный вид вакансии, и сокращённый
     */
    const full_vacancies: API.FullVacancy[] = await this.getFullVacancies(
      short_vacancies,
      limit
    );

    this.saveVacancies(full_vacancies, 'full_vacancies.json');
  };

  public analyze = async (): Promise<void> => {
    const full_vacancies = this.getFullVacanciesFromLog();

    const analyzed_vacancies = this.core.analyze(full_vacancies);

    this.saveVacancies(await analyzed_vacancies, 'analyzed_vacancies.json');
  };

  /**
   * запрашивает из Core полное представления вакансий
   *
   * возвращает массив из API.FullVacancy, не превышающий 2000 объектов
   * @param short_vacancies - массив из объектов API.Vacancy
   */
  private getFullVacancies = async (
    short_vacancies: API.Vacancy[],
    limit: number
  ): Promise<API.FullVacancy[]> =>
    this.core.getFullVacancies(short_vacancies, limit);

  /**
   * запрашиват из Core вакансии по запросу @request
   *
   * возвращает массив из API.Vacancy, не превышающий 2000 объектов
   * @param request - объект IO.Request
   */
  private getVacancies = (
    url: API.URL,
    limit: number
  ): Promise<API.Vacancy[]> => {
    return this.core.getVacancies(url, limit);
  };

  /**
   * сохраняет собранные вакансии
   * @param vacancies - API.Vacancies
   */
  private saveVacancies = (
    vacancies: API.Vacancy[],
    logfilename: string
  ): void => {
    return this.save.add(vacancies, 'log', logfilename);
  };

  /**
   * получает массив вакансий из папки log
   */
  private getVacanciesFromLog = (): API.Vacancy[] => {
    const log_dir_path = './log';

    // предполагаем, что файл сокращённых вакансий - vacancies.json
    const log_file_name = 'vacancies.json';

    const path = resolve(process.cwd(), log_dir_path, log_file_name);

    // short_vacancies
    const data: API.Vacancy[] = JSON.parse(
      readFileSync(path, { encoding: 'utf-8' })
    );

    return data;
  };

  /**
   * получает массив полных вакансий из папки log
   */
  private getFullVacanciesFromLog = (): API.FullVacancy[] => {
    const log_dir_path = './log';

    // предполагаем, что файл сокращённых вакансий - vacancies.json
    const log_file_name = 'full_vacancies.json';

    const path = resolve(process.cwd(), log_dir_path, log_file_name);

    // short_vacancies
    const data: API.Vacancy[] = JSON.parse(
      readFileSync(path, { encoding: 'utf-8' })
    );

    return data;
  };
}

export default IO;
