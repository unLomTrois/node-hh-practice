export namespace HH {
  export namespace Parser {
    export interface Core {
      makeRequest(): Promise<any[]>;
      saveVacancies(vacancies: any[], dir: string): Promise<void>;
    }
  }
}
