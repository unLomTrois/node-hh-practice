import Core from '../core/core.js';
import Save from './save.js';

import { IO } from '../types/io/module';
import { API } from '../types/api/module.js';

import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * @name TODO
 * @todo написать интерфейс
 * @todo заменить прямое использование Core API-интерфейсом
 * @link https://trello.com/c/l6yrLNv0
 */

/**
 * Модуль IO
 * @link https://trello.com/c/oFJsCDZK
 */
class IO {
  private core = new Core();
  private save = new Save();
  /**
   * search and save vacancies
   * @param request - IO.Request
   */
  public async search(request: IO.Request): Promise<void> {
    // получить вакансии
    const vacancies: API.Vacancy[] = await this.getVacancies(request);

    // сохранить собранные вакансии
    this.saveVacancies(vacancies);
  }

  public async getFull(): Promise<void> {
    const short_vacancies = this.getVacanciesFromLog();

    /**
     * @todo API.Vacancy - это общий вид, его нужно конкретизировать, есть также полный вид вакансии, и сокращённый
     */
    const full_vacancies: API.Vacancy[] = await this.getFullVacancies(
      short_vacancies
    );

    this.saveFullVacancies(full_vacancies);
  }

  private async getFullVacancies(
    short_vacancies: API.Vacancy[]
  ): Promise<API.Vacancy[]> {
    return this.core.getFullVacancies(short_vacancies);
  }

  /**
   * делает серии запросов по request
   * @param request - IO.Request
   * @returns промис на API.Vacancy[] - массив из вакансий, не превышающий 2000 объектов
   */
  private getVacancies(request: IO.Request): Promise<API.Vacancy[]> {
    return this.core.makeRequest(
      {
        no_magic: true,
        per_page: 100,
        page: 0,
        area: request.area,
        text: request.text
      },
      request.limit
    );
  }

  /**
   * сохраняет собранные вакансии
   * @param vacancies - API.Vacancies
   */
  private saveVacancies(vacancies: API.Vacancy[]): void {
    this.save.add(vacancies);
  }

  private saveFullVacancies(vacancies: API.Vacancy[]): void {
    this.save.add(vacancies, './log', 'full_vacancies.json');
  }

  /**
   * получает вакансии из папки log
   * @todo сделать async-модуль чтения и записи
   */
  private getVacanciesFromLog(): API.Vacancy[] {
    const log_dir_path = './log';

    // предполагаем, что файл сокращённых вакансий - vacancies.json
    const log_file_name = 'vacancies.json';

    const path = resolve(process.cwd(), log_dir_path, log_file_name);

    // short_vacancies
    const data: API.Vacancy[] = JSON.parse(
      readFileSync(path, { encoding: 'utf-8' })
    );

    return data;
  }
}

export default IO;
