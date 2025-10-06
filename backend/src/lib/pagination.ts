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
