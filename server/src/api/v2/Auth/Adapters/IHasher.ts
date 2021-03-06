export interface IHasher {
    // You should define the options. This is an adapter, so we
    // have ot be strict.
    hash(password: string, options: unknown): Promise<Buffer>;
    verify(hash: string, plain: string | Buffer, options?: any): Promise<boolean>;
  }
  