declare module 'shrink-ray' {
  import { RequestHandler } from 'express';
  import * as zlib from 'zlib';
  type FilterFunction = (req, res) => boolean;

  type Options = Partial<{
    filter: FilterFunction;
    cache(req, res): boolean;
    cacheSize: number;
    threshold: number;
    zlib: Partial<{
      /** default: zlib.constants.Z_NO_FLUSH */
      flush?: number;

      /** default: zlib.constants.Z_FINISH */
      finishFlush?: number;

      /** default: 16*1024 */
      chunkSize?: number;
      windowBits?: number;

      /** compression only */
      strategy?: number;

      /** deflate/inflate only, empty dictionary by default */
      dictionary?: any;

      /** compression only */
      level: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

      /** compression only */
      memLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }>;
    brotli: {
      lgblock: number;
      lgwin: number;
      mode: 0 | 1 | 2;
      quality: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
    };
  }>;

  interface CreateMiddleware {
    (options?: Options): RequestHandler;
    filter: FilterFunction;
  }

  const createMiddleware: CreateMiddleware;

  export = createMiddleware;
}
