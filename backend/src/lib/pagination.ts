export type PaginationParams = {
	page: number;
	pageSize: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
};

export function parsePagination(query: any, defaults: { pageSize?: number } = {}): PaginationParams {
	const page = Math.max(1, Number(query.page || 1));
	const pageSize = Math.min(100, Math.max(1, Number(query.pageSize || defaults.pageSize || 20)));
	const sortBy = typeof query.sortBy === 'string' ? query.sortBy : undefined;
	const sortOrder = query.sortOrder === 'asc' || query.sortOrder === 'desc' ? query.sortOrder : undefined;
	return { page, pageSize, sortBy, sortOrder } as PaginationParams;
}

export function toPrismaArgs(params: PaginationParams) {
	const skip = (params.page - 1) * params.pageSize;
	const take = params.pageSize;
	const orderBy = params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : undefined as any;
	return { skip, take, orderBy };
}

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};

export const paginate = async <T, K extends { where?: any, orderBy?: any, include?: any, select?: any }>(
  model: {
    count: (args: { where: K['where'] }) => Promise<number>;
    findMany: (args: K & { skip?: number; take?: number }) => Promise<T[]>;
  },
  args: K,
  options: { page?: number, perPage?: number } = {}
): Promise<PaginatedResult<T>> => {
  const page = options.page || 1;
  const perPage = options.perPage || 20;

  const skip = (page - 1) * perPage;
  const take = perPage;

  const [total, data] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({
      ...args,
      skip,
      take,
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
};
