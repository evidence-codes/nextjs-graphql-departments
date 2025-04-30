export interface Department {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  subDepartments?: Department[];
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedDepartments {
  items: Department[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export interface SubDepartmentInput {
  name: string;
}

export interface CreateDepartmentInput {
  name: string;
  subDepartments?: SubDepartmentInput[];
}

export interface UpdateDepartmentInput {
  name: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
  };
}
