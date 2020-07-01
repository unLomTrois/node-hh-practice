#!/usr/bin/env node

import commander from 'commander';
const { Command } = commander;
const cli = new Command();

import IO from './io.js';
const io = new IO();

cli.name('node-hh-parsevr').version('0.4.0');

// опции
cli
  .option('-a, --area <area-name>', 'set area', parseFloat, 1)
  .option('-l, --limit <number>', 'set limit', parseFloat, 100);

// комманды
cli
  .command('search <text>')
  .description('само за себя говорит')
  .action((text) => {
    io.makeRequest(text, cli.area, cli.limit);
  });

cli.parse(process.argv);
