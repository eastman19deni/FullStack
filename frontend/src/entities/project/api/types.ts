import type { Project, ProjectStatus } from '../model/types';

export interface ProjectListParams {
  query?: string;
  status?: ProjectStatus | 'all';
}

export interface ProjectCreateInput {
  title: string;
  description: string;
  tagIds: number[];
  roleIds: number[];
}

export interface ProjectApi {
  list(params?: ProjectListParams): Promise<Project[]>;
  getById(id: number): Promise<Project | null>;
  create(input: ProjectCreateInput): Promise<Project>;
}
