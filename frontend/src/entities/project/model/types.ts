import type { User } from '../../user/model/types';
import type { Tag } from '../../tag/model/types';

export type ProjectStatus = 'looking_for_roles' | 'in_progress' | 'completed';

export interface ProjectRole {
    role: {id: number; name: string};
    slots: number;
    filled: number;
}

export interface Project{
    id: number;
    title: string;
    description: string;
    status: ProjectStatus;
    author: User;
    tags: Tag[];
    roles: ProjectRole[];
    createdAt: string;
}