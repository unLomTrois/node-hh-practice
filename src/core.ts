import { writeFile, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { getVacancies } from './hh/vacancies.js';
import { HeadersInit } from 'node-fetch';

class Core {
  /**
   * заголовки
   */
  private hh_headers: HeadersInit = {
    'User-Agent': 'node-hh-parser (vadim.kuz02@gmail.com)'
  };

  /**
   * makeRequest
   */
  public async makeRequest(): Promise<any[]> {
    return getVacancies(
      {
        baseURL: 'https://api.hh.ru',
        method: '/vacancies',
        query: {
          no_magic: true,
          per_page: 100,
          page: 0,
          area: 1641
        }
      },
      this.hh_headers
    );
  }

  /**
   * метод сохранения вакансий
   * @param vacancies - массив вакансий
   * @param dir - директория для сохранения логов
   */
  public async saveVacancies(vacancies: any[], dir = './log'): Promise<void> {
    // если нет папки для сохранения логов, создать её
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    // получение информации промиса
    console.log(`${vacancies.length} vacancies have parsed`);

    // получить путь для сохранения
    const log_path = resolve(process.cwd(), dir, 'vacancies.json');

    // сохранить вакансии
    writeFile(log_path, JSON.stringify(vacancies, undefined, 2), (err) => {
      if (err) throw err;
      console.log('completely saved');
    });
  }
}

export default Core;
