#!/usr/bin/env node

import commander from 'commander';
import IO from './io/io.js';
import Suggest from './suggest.js';
import { execSync } from 'child_process';
import chalk from 'chalk';

const ctx = new chalk.Instance({ level: 1 });

/**
 * Модуль CLI
 */
class CLI {
  private cli = new commander.Command();
  private io = new IO();
  private suggest = new Suggest();

  /**
   * запуск CLI
   */
  public run = () => {
    this.cli.name('node-hh-parser').version('0.6.2');

    this.initCLIOptions();

    this.initCLICommands();

    this.cli.parse(process.argv);

    this.io.setSilent(this.cli.silent);
    this.suggest.silent_mode = this.cli.silent;
  };

  /**
   * инициализация полей (опций)
   */
  private initCLIOptions = () => {
    this.cli
      .option<number>('-l, --limit <number>', 'ограничение по поиску', parseFloat, 2000)
      .option('-A, --all', 'выполнить все остальные комманды автоматически', 'Россия')
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
        const area = await this.suggest.area(this.cli.area, this.cli.language);

        await this.io.search({
          text: text,
          area: area,
          limit: this.cli.limit,
          cluster: this.cli.cluster ?? this.cli.all ?? false
        });

        if (this.cli.all) {
          setTimeout(() => {
            console.log(ctx.yellow('\n>'), 'node cli.js get-full');
            execSync('node cli.js get-full', { stdio: 'inherit' });

            console.log(ctx.yellow('\n>'), 'node cli.js prepare');
            execSync('node cli.js prepare', { stdio: 'inherit' });

            console.log(ctx.yellow('\n>'), 'node cli.js analyze');
            execSync('node cli.js analyze', { stdio: 'inherit' });
          }, 1000);
        }
      });

    this.cli
      .command('get-full')
      .description('получает полное представление вакансий')
      .action(() => {
        this.io.getFull(this.cli.limit);
      });

    this.cli
      .command('prepare')
      .description('подготовить полные вакансии, очистить их от ненужных полей')
      .action(() => {
        this.io.prepare();
      });

    this.cli
      .command('analyze')
      .description('проанализировать полученные данные')
      .action(() => {
        this.io.analyze();
      });
  };
}

const cli = new CLI();

cli.run();
