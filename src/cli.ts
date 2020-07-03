#!/usr/bin/env node

import commander from 'commander';
import IO from './io/io.js';

// иниициализация IO
const io = new IO();

// инициализация CLI
const cli = new commander.Command();
cli.name('node-hh-parsevr').version('0.4.0');

// опции
cli
  /**
   * @todo сделать suggest-модуль, заменить id-представление на name-представление
   * @link https://trello.com/c/S7mFIRBk
   */
  .option<number>('-a, --area <area-id>', 'set area', parseFloat, 1)
  .option<number>('-l, --limit <number>', 'set limit', parseFloat, 100);

// комманды
cli
  .command('search <text>')
  .description('поиск вакансий по полю text')
  .action((text: string) => {
    io.search({
      text: text,
      area: cli.area,
      limit: cli.limit
    });
  });

cli.parse(process.argv);
