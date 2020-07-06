import { Parser } from '../types/core/module';
import { API } from '../types/api/module';
import fetch, { HeadersInit } from 'node-fetch';
import URLFormatter from './formatter.js';

import { createHash } from 'crypto';
import { resolve } from 'path';
import { readFileSync, writeFile, existsSync, mkdirSync } from 'fs';

// Модуль запросов
class Requests implements Parser.Requests {
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
      fetch(url, { headers: this.hh_headers }).then((res) => res.json())
    );

    // дождаться резолва промисов, получить их поля items, заполнить ими новый массив
    const vacancies: API.Vacancy[] = [].concat(
      ...(await Promise.all(data)).map((page) => page.items)
    );

    return vacancies;
  };

  getResumes(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  md5 = (str: string): string => {
    return createHash('md5').update(str).digest('hex');
  };

  async fetchCache(): Promise<any> {
    console.log('REQ FETCH CACHE');

    const requestArguments = 'https://jsonplaceholder.typicode.com/todos/1';

    const cahceDirPath = './cache';
    if (!existsSync(cahceDirPath)) {
      mkdirSync(cahceDirPath);
    }

    const cacheHash = this.md5(JSON.stringify(requestArguments));
    const cacheFilePath = resolve(
      process.cwd(),
      cahceDirPath,
      `${cacheHash}.json`
    );

    if (existsSync(cacheFilePath)) {
      // read from cache
      const data = JSON.parse(
        readFileSync(cacheFilePath, { encoding: 'utf-8' })
      );

      return data;
    } else {
      // make new fetch
      const fetchResponse = await fetch(requestArguments);

      const data = await fetchResponse.json();

      // cache response
      writeFile(cacheFilePath, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('completely saved');
      });

      return data;
    }
  }
}

export default Requests;
