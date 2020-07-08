import { readFileSync, writeFile } from 'fs';

/**
 * Модуль кеширования
 */
class Cache {
  /**
   * читает информацию из кеша по @path и возвращает json-объект
   * @param path - путь к файлу кеша
   */
  public get = (path: string): any => {
    const file: string = readFileSync(path, { encoding: 'utf-8' });

    return JSON.parse(file);
  };

  /**
   * добавляет информацию объекта @data в кеш по пути @path
   * @param path - путь к файлу кеша
   * @param data - объект, который добавляется в кеш
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public add = (path: string, data: any): void => {
    writeFile(path, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
  };
}

export default Cache;
