#!/usr/bin/env node

import commander from 'commander';
import IO from './io/io.js';
import Suggest from './suggest.js';

/**
 * Модуль CLI
 */
class CLI {
  private io!: IO;
  private cli = new commander.Command();
  private suggest = new Suggest();

  /**
   * запуск CLI
   */
  public run = () => {
    this.cli.name('node-hh-parser').version('0.6.2');

    this.initCLIOptions();

    this.initCLICommands();

    this.cli.parse(process.argv);

    this.io = new IO(this.cli.silent);
  };

  /**
   * инициализация полей (опций)
   */
  private initCLIOptions = () => {
    this.cli
      .option<number>('-l, --limit <number>', 'ограничение по поиску', parseFloat, 2000)
      .option('-a, --area <area-name>', 'название территории поиска или индекс', 'Россия')
      .option('-L, --language <язык>', 'язык локализации', 'RU')
      .option('-C, --cluster', 'поиск по кластерам')
      .option('-S, --silent', 'не выводить информацию в консоль');
  };

  /**
   * инициализация команд (операций)
   */
  private initCLICommands = () => {
    this.cli
      .command('search <text>')
      .description('поиск вакансий по полю text')
      .action(async (text: string) => {
        this.suggest.silent_mode = this.cli.silent;

        const area = await this.suggest.area(this.cli.area, this.cli.language);

        this.io.search({
          text: text,
          area: area,
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
