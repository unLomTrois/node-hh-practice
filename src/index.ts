import { getVacancies } from './hh/vacancies';
import { writeFile } from 'fs'

const hh_headers: HeadersInit = {
  'User-Agent': 'node-hh-parser (vadim.kuz02@gmail.com) '
};

const vacancies = getVacancies({
  'baseURL': 'https://api.hh.ru',
  'method': '/vacancies',
  'query': {
    '?no_magic': true,
    'per_page': 100,
    'page': 0,
    'area': 1641
  }
}, hh_headers);

const save = async (vacancies: Promise<any[]>) => {

  const data = await vacancies;
  console.log(`${ data.length } vacancies have parsed`);

  writeFile('./log/log.json', JSON.stringify(data, undefined, 2), err => {
    if (err) throw err;
    console.log('completely saved');
    }
  );
}

save(vacancies);
