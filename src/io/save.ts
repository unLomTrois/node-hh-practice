import chalk from 'chalk';
import { writeFile, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

/**
 * Модуль Сохранений
 * @link https://trello.com/c/SfevqagQ
 */
class Save {
  public silent_mode: boolean = false;

  /**
   * метод сохранения вакансий
   * @param something_to_save - что-то, что мы хотим добавить в лог
   * @param log_dir_path - путь к папке для сохранения логов
   * @param filename_to_log - название файла для сохранения в лог
   */
  public add = (something_to_save: any, log_dir_path: string, filename_to_log: string): void => {
    // если нет папки для сохранения логов, создать её
    if (!existsSync(log_dir_path)) {
      mkdirSync(log_dir_path);
    }

    // получить путь для сохранения
    const log_path = resolve(process.cwd(), log_dir_path, filename_to_log);

    // сохранить в лог
    writeFile(log_path, JSON.stringify(something_to_save, undefined, 2), (err) => {
      if (err) throw err;
      if (!this.silent_mode) {
        const ctx = new chalk.Instance({ level: 1 });
        console.log(ctx.yellow('успешно сохранено в:'), ctx.green(log_path));
      }
    });
  };
}

export default Save;
