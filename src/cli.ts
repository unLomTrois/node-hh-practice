#!/usr/bin/env node

import commander from 'commander';
import IO from './io.js';

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
  .option('-a, --area <area-id>', 'set area', parseFloat, 1)
  .option('-l, --limit <number>', 'set limit', parseFloat, 100);

// комманды
cli
  .command('search <text>')
  .description('поиск вакансий по полю text')
  .action((text) => {
    io.makeRequest(text, cli.area, cli.limit);
  });

cli.parse(process.argv);
