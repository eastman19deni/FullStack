import type { ProjectApi, ProjectListParams, ProjectCreateInput } from './types';
import { mockProjects, allTags } from '../model/mock';
import type { Project } from '../model/types';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let nextId = 1000;

export const mockProjectApi: ProjectApi = {
  async list({ query = '', status = 'all' }: ProjectListParams = {}) {
    await delay();
    const q = query.trim().toLowerCase();
    return mockProjects
      .filter((p) => status === 'all' || p.status === status)
      .filter(
        (p) =>
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
  },

  async getById(id: number) {
    await delay();
    return mockProjects.find((p) => p.id === id) ?? null;
  },

  async create(input: ProjectCreateInput) {
    await delay();
    const project: Project = {
      id: ++nextId,
      title: input.title,
      description: input.description,
      status: 'looking_for_roles',
      author: { id: 1, username: 'sasha' },
      tags: allTags.filter((t) => input.tagIds.includes(t.id)),
      roles: [],
      createdAt: new Date().toISOString(),
    };
    mockProjects.unshift(project);
    return project;
  },
};
