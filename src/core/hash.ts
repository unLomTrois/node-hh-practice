import { createHash } from 'crypto';

class Hash {
  public md5 = (str: string): string => {
    return createHash('md5').update(str).digest('hex');
  };
}

export default Hash;
