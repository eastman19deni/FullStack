import type { Project } from './types';
import type { Tag } from '../../tag/model/types';

export const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Трекер привычек для студентов',
    description:
      'Простое веб-приложение для отслеживания ежедневных привычек с геймификацией. Ищем команду для запуска MVP.',
    status: 'looking_for_roles',
    author: { id: 2, username: 'bob' },
    tags: [
      { id: 1, name: 'Web' },
      { id: 3, name: 'Mobile' },
    ],
    roles: [
      { role: { id: 1, name: 'Frontend' }, slots: 1, filled: 0 },
      { role: { id: 3, name: 'Designer' }, slots: 1, filled: 1 },
    ],
    createdAt: '2026-10-01',
  },
  {
    id: 2,
    title: 'AI-помощник для конспектов',
    description:
      'Сервис, который превращает лекции в структурированные конспекты и карточки для повторения.',
    status: 'in_progress',
    author: { id: 3, username: 'carol' },
    tags: [
      { id: 2, name: 'AI' },
      { id: 1, name: 'Web' },
    ],
    roles: [
      { role: { id: 2, name: 'Backend' }, slots: 2, filled: 0 },
      { role: { id: 4, name: 'QA' }, slots: 1, filled: 1 },
    ],
    createdAt: '2026-10-02',
  },
  {
    id: 3,
    title: 'Кооперативная игра-головоломка',
    description: 'Небольшая игра на двоих с физикой и уровнями-загадками.',
    status: 'completed',
    author: { id: 1, username: 'alice' },
    tags: [{ id: 4, name: 'GameDev' }],
    roles: [
      { role: { id: 1, name: 'Frontend' }, slots: 1, filled: 1 },
      { role: { id: 3, name: 'Designer' }, slots: 1, filled: 1 },
    ],
    createdAt: '2026-10-03',
  },
];

export const allTags: Tag[] = [
  { id: 1, name: 'Web' },
  { id: 2, name: 'AI' },
  { id: 3, name: 'Mobile' },
  { id: 4, name: 'GameDev' },
];

export const allRoles = [
  { id: 1, name: 'Frontend' },
  { id: 2, name: 'Backend' },
  { id: 3, name: 'Designer' },
  { id: 4, name: 'QA' },
];
