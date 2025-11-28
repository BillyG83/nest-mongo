export interface Paginated<T> {
  data: T[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  links: {
    current: string;
    first: string;
    last: string;
    next: string;
    prev: string;
  };
}
