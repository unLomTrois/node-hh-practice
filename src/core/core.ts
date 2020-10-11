import Requests from './requests.js';
import Analyzer from './analyzer.js';
import Prepare from './prepare.js';

class Core {
  public requests: Requests = new Requests();
  public analyzer: Analyzer = new Analyzer();
  public prepare: Prepare = new Prepare();
}

export default Core;
