export namespace API {
  type schedule = 'fullDay' | 'shift' | 'flexible' | 'remote' | 'flyInFlyOut';

  type experience =
    | 'noExperience'
    | 'between1And3'
    | 'between3And6'
    | 'moreThan6';

  type employment = 'full' | 'part' | 'project' | 'volunteer' | 'probation';

  type currency =
    | 'AZN'
    | 'BYR'
    | 'EUR'
    | 'GEL'
    | 'KGS'
    | 'KZT'
    | 'RUR'
    | 'UAH'
    | 'USD'
    | 'UZS';

  type order_by =
    | 'publication_time'
    | 'salary_desc'
    | 'salary_asc'
    | 'relevance'
    | 'distance';

  type search_field = 'name' | 'company_name' | 'description';

  export interface Query {
    no_magic?: boolean;
    area?: number;
    text?: string;
    schedule?: schedule;
    per_page?: number;
    page?: number;
    specialization?: string;
    experience?: experience;
    describe_arguments?: boolean;
    employment?: employment;
    industry?: string;
    salary?: number;
    currency?: currency;
    order_by?: order_by;
    search_field?: search_field;
  }

  /// URL

  type baseURL = 'https://api.hh.ru';

  type method = '/vacancies';

  export interface URL {
    baseURL: baseURL;
    method: method;
    query: Query;
  }

  /// ALIASES

  export type Vacancy = any;
  export type Vacancies = Promise<Vacancy[]>;

  /// Not used
  export interface Response {
    name: string;
    snippet: Snippet;
  }

  export interface Snippet {
    requirement: string | undefined | null;
    responsibility: string | undefined | null;
  }
}
