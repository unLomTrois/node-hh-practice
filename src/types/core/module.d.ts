import { API } from '../api/module';

export namespace Parser {
  export interface Core {
    makeRequest(query: API.Query, limit: number): Promise<any[]>;
  }

  export interface Requests {
    // getFound(url: string): Promise<number>;
    getVacancies(query: API.Query, limit?: number): Promise<any[]>;
    getResumes(): Promise<any[]>;
  }
}
