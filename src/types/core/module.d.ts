import { API } from '../api/module';

export namespace Parser {
  export interface CoreAPI {
    text: string;
    area: number;
  }

  export interface Core {
    makeRequest(query: CoreAPI, limit: number): Promise<any[]>;
    saveVacancies(vacancies: any[], dir: string): Promise<void>;
  }

  export interface Requests {
    // getFound(url: string): Promise<number>;
    getVacancies(query: API.Query, limit?: number): Promise<any[]>;
    getResumes(): Promise<any[]>;
  }
}
