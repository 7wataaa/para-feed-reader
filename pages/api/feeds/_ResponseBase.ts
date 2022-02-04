type ResponseBodyBase = {
  code: number;
  message: string;
  data?: unknown;
};

type ResponseError = {
  code: number;
  message: string;
  data?: any;
};

export type { ResponseBodyBase, ResponseError };
