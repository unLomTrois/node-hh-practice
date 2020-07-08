import { API } from '../types/api/module';

/**
 * Класс для преобразований API-интерфейсов/объектов в примитивы (строки) для запросов
 */
class URLFormatter {
  /**
   * преобразовывает интерфейс запроса в строка вида ?option1=value1&option2=value2&...
   * @param query - запрос, объект API.Query
   */
  private queryToString = (query: API.Query): string => {
    const query_list: string[] = [];

    // объединить пары ключей и значений интерфейса знаком '='
    Object.entries(query).forEach(([key, value]) => {
      query_list.push([key, value].join('='));
    });

    // объединить эти пары пар знаком '&'
    return query_list.join('&');
  };

  /**
   * преобразовывает объект API.URL строку вида https://hh.ru/method?option1=value1&option2=value2&...
   * @param url - API.URL объект
   */
  public getURL = (url: API.URL): string =>
    `${url.baseURL + url.method}?${this.queryToString(url.query)}`;
}

export default URLFormatter;
