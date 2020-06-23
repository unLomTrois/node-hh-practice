import fetch, { HeadersInit } from 'node-fetch';
import { HH } from '../api/hh/module';

// HH
const queryToString = (query: HH.QueryInterface): string => {
  const query_list: string[] = [];

  Object.entries(query).forEach(([key, value]) => {
    query_list.push([key, value].join('='))
  });

  return query_list.join('&');
}

const getURL = (url: HH.URL): string => url.baseURL + url.method + queryToString(url.query)

// FUNC

const getFound = async (url: string, headers_init?: HeadersInit): Promise<number> => {

  // change per_page in url
  url = url.replace(/per_page=(100)|[0-9]\d?/, 'per_page=0');

  // get json
  const data: any = await fetch(url, { headers: headers_init })
    .then(res => res.json());

  // get found field
  const found: number = data.found;

  return found;
}

const getVacancies = async (hh_url: HH.URL, headers_init?: HeadersInit, limit: number = 2000): Promise<any[]> => {

  // get url
  const base_url = getURL(hh_url);

  const found: number = await getFound(
    base_url,
    headers_init
  );

  console.log(found);

  // получаем количество элементов на страницу
  const per_page: number = hh_url.query.per_page ?? 100;

  // вычисляем количество требуемых страниц
  const pages: number = Math.ceil((found <= limit ? found : limit ) / per_page);

  console.log(pages);

  const urls: string[] = Array.from(
    Array(pages).fill(base_url),
    (url: string, page: number) => url.replace(/&page=([0-9]|1[0-9])/, `&page=${ page }`)
  );

  // console.log(urls);

  const responses: Promise<any>[] = urls.map(url => fetch(url, { headers: headers_init }).then(res => res.json()));

  const vacancies: any[] = new Array().concat( ...(await Promise.all(responses)).map(page => page.items) );

  return vacancies;
}

export {
  getVacancies
}
