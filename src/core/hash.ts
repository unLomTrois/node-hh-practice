import { createHash } from 'crypto';

class Hash {
  /**
   * хеширует строку алгоритмом md5 и возвращает строку с 16-чным числом
   * @param str - строка
   */
  public md5 = (str: string): string => {
    return createHash('md5').update(str).digest('hex');
  };
}

export default Hash;
