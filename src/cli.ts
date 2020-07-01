#!/usr/bin/env node

import commander from 'commander';
const { Command } = commander;
const cli = new Command();

import Core from './core/core.js';
const core = new Core();

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
    core
      .makeRequest(
        {
          no_magic: true,
          per_page: 100,
          page: 0,
          area: cli.area,
          text: text
        },
        cli.limit
      )
      .then((vacs) => core.saveVacancies(vacs));
  });

cli.parse(process.argv);
