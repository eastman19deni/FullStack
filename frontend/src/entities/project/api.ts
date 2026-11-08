import { ApiError, api } from '../../shared/api/client';
import type { Project, ProjectStatus } from './model/types';

export interface ProjectListParams {
  query?: string;
  status?: ProjectStatus | 'all';
}

export interface ProjectCreateInput {
  title: string;
  description: string;
  tagIds: number[];
}

interface RawProject {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  author: { id: number; username: string };
  tags: { id: number; name: string }[];
  created_at: string;
}

// Бэкенд не хранит роли проектов, поэтому roles пока пустой
function toProject(raw: RawProject): Project {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    author: raw.author,
    tags: raw.tags,
    roles: [],
    createdAt: raw.created_at,
  };
}

export const projectApi = {
  async list({ query = '', status = 'all' }: ProjectListParams = {}): Promise<Project[]> {
    const params = new URLSearchParams();
    if (query.trim()) params.set('query', query.trim());
    if (status !== 'all') params.set('status', status);
    const raw = await api<RawProject[]>(`/projects?${params.toString()}`);
    return raw.map(toProject);
  },

  async getById(id: number): Promise<Project | null> {
    try {
      return toProject(await api<RawProject>(`/projects/${id}`));
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }
  },

  async create(input: ProjectCreateInput): Promise<Project> {
    const raw = await api<RawProject>('/projects', {
      method: 'POST',
      auth: true,
      body: {
        title: input.title,
        description: input.description,
        tag_ids: input.tagIds,
      },
    });
    return toProject(raw);
  },

  async apply(projectId: number, message = ''): Promise<void> {
    await api('/applications', {
      method: 'POST',
      auth: true,
      body: { project_id: projectId, message },
    });
  },
};
