import fetch from 'node-fetch';
import { URL } from 'url';

/**
 * Suggest-модуль
 *
 * Делает вспомогательные запросы
 */
class Suggest {
  /**
   * делает запрос и получает индекс территории
   * @param text - название территории, например: "Россия", "Москва"
   * @param locale - локализация запроса, дефолт: "RU"
   */
  public area = async (text: string, locale = 'RU'): Promise<number> => {
    const url = `https://api.hh.ru/suggests/areas?text=${text}&locale=${locale}`;

    const data: any = await fetch(new URL(url)).then((res) => res.json());

    const area = data.items[0];

    return area.id;
  };
}

export default Suggest;
