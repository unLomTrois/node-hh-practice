import Core from './core/core.js';

/**
 * @todo написать интерфейс
 * @todo заменить прямое использование Core API-интерфейсом
 * @link https://trello.com/c/l6yrLNv0
 */
class IO {
  private core = new Core();

  /**
   * makeRequest
   * @todo заменить отдельные аргументы интерфейсом запроса IO
   */
  public makeRequest = (text: string, area: number, limit: number): void => {
    this.core
      .makeRequest(
        {
          no_magic: true,
          per_page: 100,
          page: 0,
          area: area,
          text: text
        },
        limit
      )
      /**
       * @todo написать обособленный Save-модуль
       * @todo заменить сохранение напрямую обращением к Save-модулю
       * @link https://trello.com/c/SfevqagQ
       */
      .then((vacs) => this.core.saveVacancies(vacs));
  };
}

export default IO;
