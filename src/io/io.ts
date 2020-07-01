import Core from '../core/core.js';
import Save from './save.js';

import { IO } from '../types/io/module';
import { API } from '../types/api/module.js';

/**
 * @todo написать интерфейс
 * @todo заменить прямое использование Core API-интерфейсом
 * @link https://trello.com/c/l6yrLNv0
 */
class IO {
  private core = new Core();
  private save = new Save();

  public makeRequest(request: IO.Request): void {
    const vacancies: API.Vacancies = this.core.makeRequest(
      {
        no_magic: true,
        per_page: 100,
        page: 0,
        area: request.area,
        text: request.text
      },
      request.limit
    );

    vacancies.then((vacs) => this.save.vacancies(vacs));
  }
}

export default IO;
