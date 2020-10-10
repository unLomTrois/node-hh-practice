import Core from '../core/core.js';
import Save from './save.js';

import { IO } from '../types/io/module';
import { API } from '../types/api/module.js';

import { readFileSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';

const ctx = new chalk.Instance({ level: 1 });

/**
 * Модуль IO
 * @link https://trello.com/c/oFJsCDZK
 */
class IO {
  public silent_mode: boolean = false;
  private core = new Core();
  private _save = new Save();
  private log_dir_path = './log';

  public setSilent = (silent: boolean) => {
    this.silent_mode = silent;
    this._save.silent_mode = silent;
  };

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
      text: request.text,
      order_by: 'salary_desc'
    };

    const base_api_url: API.URL = {
      baseURL: 'https://api.hh.ru',
      method: '/vacancies',
      query: query
    };

    // получить вакансии
    const vacancies: API.Vacancy[] = await this.core.requests.getVacancies(
      base_api_url,
      request.limit
    );

    // сохранить собранные вакансии
    this.save(vacancies, 'vacancies.json');

    if (!this.silent_mode) {
      console.log(ctx.yellow('вакансий найдено:'), ctx.green(vacancies.length));
    }

    // cluster part
    if (request.cluster) {
      const clusters_api_url: API.URL = JSON.parse(JSON.stringify(base_api_url));

      clusters_api_url.query.clusters = true;

      // получить вакансии
      const vacancies_clusters: API.Vacancy[] = await this.core.getClusters(clusters_api_url);

      // сохранить собранные вакансии
      this.save(vacancies_clusters, 'clusters.json');
    }
  };

  /**
   * Получает и сохраняет массивы полного представления вакансий
   */
  public getFull = async (limit = 2000): Promise<void> => {
    const short_vacancies = await this.getFromLog('vacancies.json');

    const start = new Date().getTime();

    const full_vacancies: API.FullVacancy[] = await this.core.getFullVacancies(
      short_vacancies,
      limit
    );

    const end = new Date().getTime();

    if (!this.silent_mode) {
      console.log(ctx.yellow('время поиска:'), ctx.green((end - start) / 1000, 'сек'));
    }

    this.save(full_vacancies, 'full_vacancies.json');
  };

  public analyze = async (): Promise<void> => {
    const prepared_vacancies: API.PreparedVacancy[] = this.getFromLog('prepared_vacancies.json');

    const prepared_clusters: API.PreparedClusters = this.getFromLog('prepared_clusters.json');

    const analyzed_data = await this.core.analyzer.analyze(prepared_vacancies, prepared_clusters);

    this.save(analyzed_data, 'analyzed_data.json');
  };

  public prepare = async (): Promise<void> => {
    // RAW data
    const full_vacancies: API.FullVacancy[] = this.getFromLog('full_vacancies.json');
    const clusters: API.Clusters = this.getFromLog('clusters.json');

    // prepared data
    const prepared_vacancies: API.PreparedVacancy[] = await this.core.prepare.prepareVacancies(
      full_vacancies
    );

    const prepared_clusters: API.PreparedClusters = await this.core.prepare.prepareClusters(
      clusters
    );

    this.save(prepared_vacancies, 'prepared_vacancies.json');
    this.save(prepared_clusters, 'prepared_clusters.json');
  };

  /**
   * сохраняет собранные вакансии
   * @param vacancies - API.Vacancies
   */
  private save = (something_to_save: any, filename_to_log: string): void => {
    return this._save.add(something_to_save, this.log_dir_path, filename_to_log);
  };

  /**
   * получает массив вакансий c названием log_file_name из папки log
   */
  private getFromLog = (log_file_name: string): API.Vacancy[] => {
    const path = resolve(process.cwd(), this.log_dir_path, log_file_name);

    // short_vacancies
    const data: API.Vacancy[] = JSON.parse(readFileSync(path, { encoding: 'utf-8' }));

    return data;
  };
}

export default IO;
