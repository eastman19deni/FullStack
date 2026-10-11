export type ProjectStatus = 'looking_for_roles' | 'team_assembled' | 'closed';

export interface User {
  id: number;
  username: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface ProjectRole {
  role: Role;
  slots: number;
  filled: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  author: User;
  tags: Tag[];
  roles: ProjectRole[];
  createdAt: string;
}