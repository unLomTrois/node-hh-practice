import { API } from '../types/api/module';

type analyzedInfo = any;

type SalaryCluster = any[];

import d3 from 'd3-array';

/**
 * @todo убрать асинки
 */
class Analyzer {
  public analyze = async (
    prepared_vacancies: API.PreparedVacancy[],
    prepared_clusters: API.PreparedClusters
  ): Promise<API.AnalyzedData> => {
    prepared_vacancies;
    prepared_clusters;

    // всего вакансий
    const found: number = prepared_clusters.found;

    const salary_cluster: SalaryCluster =
      prepared_clusters.clusters.salary.items;

    const analyzed_data: API.AnalyzedData = {
      salary_info: this.analyzeSalary(salary_cluster, found)
    };

    return analyzed_data;
  };

  private analyzeSalary = (
    salary_cluster: SalaryCluster,
    found: number
  ): analyzedInfo => {
    const borders: any[] = [];

    salary_cluster.forEach((part) => {
      if (part.name !== 'Указана') {
        borders.push({
          from: parseFloat(part.name.split(' ')[1]), //полчаем число из фразы "от *число* руб."
          count: part.count
        });
      }
    });

    // количество вакансий с указанной зп
    const specified: number = salary_cluster.find(
      (part) => part.name === 'Указана'
    ).count;

    // результат
    return {
      mean_salary: d3.sum(borders, (d) => d.from * d.count) / specified, // средняя зп
      specified_ratio: specified / found // отношение всех вакансий к количеству с указнной зп
    };
  };
}

export default Analyzer;
