import { readFileSync, writeFile } from 'fs';

class Cache {
  public get = (path: string): any => {
    const file: string = readFileSync(path, { encoding: 'utf-8' });

    return JSON.parse(file);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public add = (path: string, data: any): void => {
    writeFile(path, JSON.stringify(data), (err) => {
      if (err) throw err;
    });
  };
}

export default Cache;
