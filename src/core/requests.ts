import { API } from '../types/api/module';
import fetch, { HeadersInit, RequestInit, Response } from 'node-fetch';
import URLFormatter from './formatter.js';

import { createHash } from 'crypto';
import { resolve } from 'path';
import { readFileSync, writeFile, existsSync, mkdirSync } from 'fs';

/**
 * @todo сделать модуль хеширования
 * @todo сделать модуль кеширования
 * @todo модуль кеширования должен быть частью IO, с возможностью открывать и писать в файлы
 */

// Модуль запросов
class Requests {
  private formatter: URLFormatter = new URLFormatter();

  private hh_headers: HeadersInit = {
    'User-Agent': 'node-hh-parser (vadim.kuz02@gmail.com)'
  };

  // сделать запрос для получения общего числа вакансий по запросу
  private getFound = async (url: string): Promise<number> => {
    // изменить per_page=*число* в url на per_page=0,
    // чтобы не получать ненужные данные
    url = url.replace(/per_page=(100)|[0-9]\d?/, 'per_page=0');

    // сделать запрос и дождаться json-представления
    const data: any = await fetch(url, {
      headers: this.hh_headers
    }).then((res) => res.json());

    // взять нужное поле found
    return data.found;
  };

  public getVacancies = async (
    query: API.Query,
    limit = 2000
  ): Promise<API.Vacancy[]> => {
    const base_api_url: API.URL = {
      baseURL: 'https://api.hh.ru',
      method: '/vacancies',
      query: query
    };

    // получить строчное представление url
    const base_url = this.formatter.getURL(base_api_url);

    // общее число найденных вакансий
    const found: number = await this.getFound(base_url);

    console.log('found:', found, 'vacancies');

    // получаем количество элементов на страницу
    const per_page: number = base_api_url.query.per_page ?? 100;

    // вычисляем количество требуемых страниц
    const pages: number = Math.ceil(
      (found <= limit ? found : limit) / per_page
    );
    console.log('parsed pages:', pages);

    // сгенерировать массив ссылок числом pages, с пагинацией page
    const urls: string[] = Array.from(
      Array(pages).fill(base_url),
      (url: string, page: number) =>
        url.replace(/&page=([0-9]|1[0-9])/, `&page=${page}`)
    );

    // сделать серию ассинхронных запросов, получить promise представления json
    const data: Promise<API.Vacancy>[] = urls.map((url) =>
      this.fetchCache(url, { headers: this.hh_headers })
    );

    // дождаться резолва промисов, получить их поля items
    const vacancies: API.Vacancy[] = (await Promise.all(data)).map(
      (page) => page.items
    );

    return vacancies;
  };

  public getFullVacancies = async (urls: string[]): Promise<API.Vacancy[]> => {
    const data: Promise<API.Vacancy>[] = urls.map((url) =>
      this.fetchCache(url)
    );

    const vacancies: API.Vacancy[] = await Promise.all(data);

    return vacancies;
  };

  /**
   * зашифровать строку в хеш md5
   * @return string
   */
  private md5 = (str: string): string => {
    return createHash('md5').update(str).digest('hex');
  };

  /**
   * делает fetch по @url и @init , либо читая из @cache
   * @returns json-представление
   */
  private fetchCache = async (
    url: string,
    init?: RequestInit
  ): Promise<any> => {
    const cahceDirPath = './cache';
    if (!existsSync(cahceDirPath)) {
      mkdirSync(cahceDirPath);
    }

    const cacheHash: string = this.md5(JSON.stringify(url));
    const cacheFilePath: string = resolve(
      process.cwd(),
      cahceDirPath,
      `${cacheHash}`
    );

    if (existsSync(cacheFilePath)) {
      // read from cache
      const data: any = JSON.parse(
        readFileSync(cacheFilePath, { encoding: 'utf-8' })
      );

      return data;
    } else {
      // make new fetch
      const fetchResponse: Response = await fetch(url, init);

      // get json
      const data: any = await fetchResponse.json();

      // cache response
      writeFile(cacheFilePath, JSON.stringify(data), (err) => {
        if (err) throw err;
      });

      return data;
    }
  };
}

export default Requests;
