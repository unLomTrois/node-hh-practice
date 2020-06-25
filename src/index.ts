import { getVacancies } from './hh/vacancies.js';
import { writeFile, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// заголовки запросов
const hh_headers: HeadersInit = {
  'User-Agent': 'node-hh-parser (vadim.kuz02@gmail.com)'
};

// получить вакансии
const vacancies = getVacancies(
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
  hh_headers
);

// сохранить полученные вакансии
const save = async (vacancies: Promise<any[]>, dir = './log') => {
  // если нет папки для сохранения логов, создать её
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }

  // получение информации промиса
  const data = await vacancies;
  console.log(`${data.length} vacancies have parsed`);

  // получить путь для сохранения
  const log_path = resolve(process.cwd(), dir, 'vacancies.json');

  // сохранить вакансии
  writeFile(log_path, JSON.stringify(data, undefined, 2), (err) => {
    if (err) throw err;
    console.log('completely saved');
  });
};

save(vacancies);
