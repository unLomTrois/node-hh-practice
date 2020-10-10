import { API } from '../types/api/module';
import d3 from 'd3-array';

class Analyzer {
  public analyze = (
    prepared_vacancies: API.PreparedVacancy[],
    prepared_clusters: API.PreparedClusters
  ): API.AnalyzedData => {
    // обработка вакансий

    const rated_skills = this.rateKeySkills(prepared_vacancies);

    // обработка кластеров

    // всего вакансий
    const found: number = prepared_clusters.found;

    const salary_cluster: API.SalaryCluster = prepared_clusters.clusters.salary.items;

    const experience_cluster: API.ExperienceCluster = prepared_clusters.clusters.experience.items;

    const employment_cluster: API.EmploymentCluster = prepared_clusters.clusters.employment.items;

    const schedule_cluster: API.ScheduleCluster = prepared_clusters.clusters.schedule.items;

    const industry_cluster: API.IndustryCluster = prepared_clusters.clusters.industry.items;

    const analyzed_data: API.AnalyzedData = {
      analyzed_clusters: {
        salary_info: this.analyzeSalaryCluster(salary_cluster, found),
        experience_info: this.analyzeExperienceCluster(experience_cluster, found),
        employment_info: this.analyzeSimpleCluster(employment_cluster, found),
        schedule_info: this.analyzeSimpleCluster(schedule_cluster, found),
        industry_info: this.analyzeSimpleCluster(industry_cluster, found)
      },
      analyzed_vacancies: {
        key_skills: rated_skills
      }
    };

    return analyzed_data;
  };

  private analyzeSimpleCluster = (
    simple_cluster: API.SimpleCluster,
    found: number
  ): API.analyzedInfo => {
    const groups: any[] = simple_cluster.map((part) => {
      delete part.url;

      part.ratio = parseFloat(((part.count / found) * 100).toFixed(2));

      return part;
    });

    return groups;
  };

  private analyzeExperienceCluster = (
    experience_cluster: API.ExperienceCluster,
    found: number
  ): API.analyzedInfo => {
    const groups: any[] = [
      {
        from: 0,
        to: 1,
        count: experience_cluster.find((part) => part.name === 'Нет опыта').count
      },
      {
        from: 1,
        to: 3,
        count: experience_cluster.find((part) => part.name === 'От 1 года до 3 лет').count
      },
      {
        from: 3,
        to: 6,
        count: experience_cluster.find((part) => part.name === 'От 3 до 6 лет').count
      },
      {
        from: 6,
        to: null,
        count: experience_cluster.find((part) => part.name === 'Более 6 лет').count
      }
    ];

    groups.forEach((exp) => {
      exp.ratio = parseFloat(((exp.count / found) * 100).toFixed(2));
    });

    return groups;
  };

  private analyzeSalaryCluster = (
    salary_cluster: API.SalaryCluster,
    found: number
  ): API.analyzedInfo => {
    const borders: any[] = [];

    // количество вакансий с указанной зп
    const specified: number = salary_cluster.find((part) => part.name === 'Указана').count;

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
      mean_salary: parseFloat((d3.sum(borders, (d) => d.from * d.count) / specified).toFixed(2)), // средняя зп
      specified_ratio: parseFloat((specified / found).toFixed(2)), // отношение всех вакансий к количеству с указнной зп
      borders
    };
  };

  private rateKeySkills = (prepared_vacancies: API.PreparedVacancy[]): API.analyzedInfo[] => {
    const key_skills: string[] = [].concat(
      ...prepared_vacancies.map((vac) =>
        vac.key_skills.map((key_list: { name: any }) => key_list.name)
      )
    );

    // const unique_key_skills = Array.from(new Set(key_skills));
    // заполняем объект полями пар названия и количества
    const result: any = {};
    key_skills.forEach((skill) => {
      result[skill] = (result[skill] || 0) + 1;
    });

    const weighed_skills = Object.entries<number>(result)
      .map((arr) => {
        return {
          name: arr[0],
          count: arr[1],
          ratio: parseFloat(((arr[1] / key_skills.length) * 100).toFixed(2))
        };
      })
      .filter((skill) => skill.ratio >= 0.1)
      .sort((skill_1, skill_2) =>
        skill_1.count < skill_2.count ? 1 : skill_2.count < skill_1.count ? -1 : 0
      );

    return weighed_skills;
  };
}

export default Analyzer;
