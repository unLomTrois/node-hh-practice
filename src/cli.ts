#!/usr/bin/env node

import commander from 'commander';
import IO from './io/io.js';

import Suggest from './suggest.js';

/**
 * @todo транформмировать этот файл в общий класс
 */

// иниициализация IO
const io = new IO();

// инициализация CLI
const cli = new commander.Command();
cli.name('node-hh-parsevr').version('0.4.0');

// инициализация suggest
const suggest = new Suggest();

// опции
cli
  .option(
    '-a, --area <area-name>',
    'название территории поиска или индекс',
    'Россия'
  )
  /**
   * @todo расписать возможные состояния
   */
  .option('-L, --locale <lang>', 'язык локализации', 'RU');

cli.option<number>(
  '-l, --limit <number>',
  'ограничение по поиску',
  parseFloat,
  2000
);

// комманды
cli
  .command('search <text>')
  .description('поиск вакансий по полю text')
  .action(async (text: string) => {
    io.search({
      text: text,
      area: await suggest.area(cli.area, cli.locale),
      limit: cli.limit
    });
  });

cli
  .command('get-full')
  .description(
    'получает полное представление вакансий, полученных в результате вызова команды search'
  )
  .action(() => {
    io.getFull(cli.limit);
  });

cli.parse(process.argv);
