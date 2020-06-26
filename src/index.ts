import Core from './core.js';

const core = new Core();

core.makeRequest().then((vacs) => core.saveVacancies(vacs));
