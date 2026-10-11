import { mockProjectApi } from './mock';
import type { ProjectApi } from './types';

export const projectApi: ProjectApi = mockProjectApi;

export type { ProjectApi, ProjectListParams, ProjectCreateInput } from './types';
