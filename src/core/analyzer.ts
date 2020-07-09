import { API } from '../types/api/module';

type analyzedInfo = any;

type SalaryCluster = any[];

type ExperienceCluster = any[];

type EmploymentCluster = any[];

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

    const experience_cluster: ExperienceCluster =
      prepared_clusters.clusters.experience.items;

    const employment_cluster: EmploymentCluster =
      prepared_clusters.clusters.employment.items;

    const analyzed_data: API.AnalyzedData = {
      salary_info: this.analyzeSalary(salary_cluster, found),
      experience_info: this.analyzeExperience(experience_cluster, found),
      employment_info: this.analyzeEmployment(employment_cluster, found)
    };

    return analyzed_data;
  };

  private analyzeEmployment = (
    employment_cluster: EmploymentCluster,
    found: number
  ): analyzedInfo => {
    const groups: any[] = employment_cluster.map((part) => {
      delete part.url;

      part.ratio = parseFloat(((part.count / found) * 100).toFixed(2));

      return part;
    });

    return groups;
  };

  private analyzeExperience = (
    experience_cluster: ExperienceCluster,
    found: number
  ): analyzedInfo => {
    const groups: any[] = [
      {
        from: 0,
        to: 1,
        count: experience_cluster.find((part) => part.name === 'Нет опыта')
          .count
      },
      {
        from: 1,
        to: 3,
        count: experience_cluster.find(
          (part) => part.name === 'От 1 года до 3 лет'
        ).count
      },
      {
        from: 3,
        to: 6,
        count: experience_cluster.find((part) => part.name === 'От 3 до 6 лет')
          .count
      },
      {
        from: 6,
        to: null,
        count: experience_cluster.find((part) => part.name === 'Более 6 лет')
          .count
      }
    ];

    groups.forEach((exp) => {
      exp.ratio = parseFloat(((exp.count / found) * 100).toFixed(2));
    });

    return groups;
  };

  private analyzeSalary = (
    salary_cluster: SalaryCluster,
    found: number
  ): analyzedInfo => {
    const borders: any[] = [];

    // количество вакансий с указанной зп
    const specified: number = salary_cluster.find(
      (part) => part.name === 'Указана'
    ).count;

    salary_cluster.forEach((part) => {
      if (part.name !== 'Указана') {
        borders.push({
          from: parseFloat(part.name.split(' ')[1]), //полчаем число из фразы "от *число* руб."
          count: part.count,
          ratio: parseFloat(((part.count / specified) * 100).toFixed(2))
        });
      }
    });

    // результат
    return {
      mean_salary: parseFloat(
        (d3.sum(borders, (d) => d.from * d.count) / specified).toFixed(2)
      ), // средняя зп
      specified_ratio: parseFloat((specified / found).toFixed(2)), // отношение всех вакансий к количеству с указнной зп
      borders
    };
  };
}

export default Analyzer;
