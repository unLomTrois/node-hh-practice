import { API } from '../types/api/module';

class Prepare {
  public prepareVacancies = async (
    full_vacancies: API.FullVacancy[]
  ): Promise<API.PreparedVacancy[]> => {
    // нам важны поля key_skills
    const prepared_vacancies = full_vacancies.map((vac: API.FullVacancy) => {
      return {
        id: vac.id,
        name: vac.name,
        area: vac.area,
        key_skills: vac.key_skills,
        has_test: vac.has_test,
        test: vac.test,
        billing_type: vac.billing_type,
        accept_incomplete_resumes: vac.accept_incomplete_resumes
      };
    });

    return prepared_vacancies;
  };

  public prepareClusters = async (clusters: API.Clusters): Promise<API.PreparedClusters> => {
    const clusters_parts: any[] = clusters.clusters;

    // нам важны поля key_skills
    const prepared_clusters = {
      found: clusters.found,
      clusters: {
        salary: clusters_parts.find((part) => part.id === 'salary'),
        industry: clusters_parts.find((part) => part.id === 'industry'),
        experience: clusters_parts.find((part) => part.id === 'experience'),
        employment: clusters_parts.find((part) => part.id === 'employment'),
        schedule: clusters_parts.find((part) => part.id === 'schedule')
      }
    };

    return prepared_clusters;
  };
}

export default Prepare;
