import { writeFile, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { API } from './types/api/module';

class Save {
  /**
   * метод сохранения вакансий
   * @param vacancies - массив вакансий
   * @param dir - директория для сохранения логов
   */
  public vacancies = async (
    vacancies: API.Vacancy[],
    dir = './log'
  ): Promise<void> => {
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
  };
}

export default Save;
