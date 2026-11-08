import { api } from '../../shared/api/client';
import type { Tag } from './model/types';

export const tagApi = {
  list: () => api<Tag[]>('/tags'),
};
