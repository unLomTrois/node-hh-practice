#!/usr/bin/env node

import commander from 'commander';
import IO from './io/io.js';

/**
 * Модуль CLI
 */
class CLI {
  private io = new IO();
  private cli = new commander.Command();

  /**
   * запуск CLI
   */
  public run = () => {
    this.initCLI();

    this.cli.parse(process.argv);
  };

  /**
   * инициализация CLI
   *
   * инициализируются поля и команды (операции)
   */
  private initCLI = () => {
    this.cli.name('node-hh-parser').version('0.6.0');

    this.initCLIOptions();

    this.initCLICommands();
  };

  /**
   * инициализация команд (операций)
   */
  private initCLICommands = () => {
    this.cli
      .command('search <text>')
      .description('поиск вакансий по полю text')
      .action(async (text: string) => {
        this.io.search({
          text: text,
          area: this.cli.area, //await this.suggest.area(this.cli.area, this.cli.locale),
          limit: this.cli.limit
        });
      });

    this.cli
      .command('get-full')
      .description(
        'получает полное представление вакансий, полученных в результате вызова команды search'
      )
      .action(() => {
        this.io.getFull(this.cli.limit);
      });
  };

  /**
   * инициализация полей (опций)
   */
  private initCLIOptions = () => {
    this.cli
      .option<number>(
        '-a, --area <area-name>',
        'название территории поиска или индекс',
        parseFloat,
        1624
      )
      /**
       * @todo расписать возможные состояния
       */
      .option('-L, --locale <lang>', 'язык локализации', 'RU');

    this.cli.option<number>(
      '-l, --limit <number>',
      'ограничение по поиску',
      parseFloat,
      2000
    );
  };
}

const cli = new CLI();

cli.run();
