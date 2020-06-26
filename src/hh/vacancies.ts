import fetch, { HeadersInit } from 'node-fetch';
import { HH } from '../types/hh/module';

/// ПРЕОБРАЗОВАНИЯ

// преобразование интерфейса запроса в строку вида ?option1=value1&option2=value2& ...
const queryToString = (query: HH.Query): string => {
  const query_list: string[] = [];

  // объединить пары ключей и значений интерфейса знаком '='
  Object.entries(query).forEach(([key, value]) => {
    query_list.push([key, value].join('='));
  });

  // объединить эти пары знаком '&'
  return query_list.join('&');
};

// преобразовать (объединить) поля класса HH.URL в url-запрос
const getURL = (url: HH.URL): string =>
  url.baseURL + url.method + '?' + queryToString(url.query);

/// ЗАПРОСЫ

// сделать запрос для получения общего числа вакансий по запросу
const getFound = async (
  url: string,
  headers_init?: HeadersInit
): Promise<number> => {
  // изменить per_page=*число* в url на per_page=0,
  // чтобы не получать ненужные данные
  url = url.replace(/per_page=(100)|[0-9]\d?/, 'per_page=0');

  // сделать запрос и дождаться json-представления
  const data: any = await fetch(url, { headers: headers_init }).then((res) =>
    res.json()
  );

  // взять нужное поле found
  const found: number = data.found;

  return found;
};

// получить все найденные вакансии
const getVacancies = async (
  hh_url: HH.URL,
  headers_init?: HeadersInit,
  limit = 2000
): Promise<any[]> => {
  // получить строчное представление url
  const base_url = getURL(hh_url);

  // общее число найденных вакансий
  const found: number = await getFound(base_url, headers_init);

  console.log(found);

  // получаем количество элементов на страницу
  const per_page: number = hh_url.query.per_page ?? 100;

  // вычисляем количество требуемых страниц
  const pages: number = Math.ceil((found <= limit ? found : limit) / per_page);
  console.log(pages);

  // сгенерировать массив ссылок числом pages, с пагинацией page
  const urls: string[] = Array.from(
    Array(pages).fill(base_url),
    (url: string, page: number) =>
      url.replace(/&page=([0-9]|1[0-9])/, `&page=${page}`)
  );

  // сделать серию ассинхронных запросов, получить promise представления json
  const responses: Promise<any>[] = urls.map((url) =>
    fetch(url, { headers: headers_init }).then((res) => res.json())
  );

  // дождаться резолва промисов, получить их поля items, заполнить ими новый массив
  const vacancies: any[] = [].concat(
    ...(await Promise.all(responses)).map((page) => page.items)
  );

  return vacancies;
};

export { getVacancies };
