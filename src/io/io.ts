import Core from '../core/core.js';
import Save from './save.js';

import { IO } from '../types/io/module';
import { API } from '../types/api/module.js';

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

  /**
   * @name TEST_FEATURE
   */
  public async fetchCache(): Promise<void> {
    console.log('IO FETCH CACHE');

    const data = await this.core.fetchCache();
    console.log(data);
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
}

export default IO;
