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
    this.cli.name('node-hh-parser').version('0.6.0');

    this.initCLIOptions();

    this.initCLICommands();

    this.cli.parse(process.argv);
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
      .option('-L, --locale <lang>', 'язык локализации', 'RU')
      .option('-C, --cluster', 'поиск по кластерам')
      .option<number>('-l, --limit <number>', 'ограничение по поиску', parseFloat, 2000);
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
          limit: this.cli.limit,
          cluster: this.cli.cluster ?? false
        });
      })

      .command('get-full')
      .description('получает полное представление вакансий')
      .action(() => {
        this.io.getFull(this.cli.limit);
      })

      .command('prepare')
      .description('подготовить полные вакансии, очистить их от ненужных полей')
      .action(() => {
        this.io.prepare();
      })

      .command('analyze')
      .description('проанализировать полученные данные')
      .action(() => {
        this.io.analyze();
      });
  };
}

const cli = new CLI();

cli.run();
