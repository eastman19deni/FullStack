import type { Project, Role, Tag, User } from '../types';

export const users: User[] = [
  { id: 1, username: 'alice' },
  { id: 2, username: 'bob' },
  { id: 3, username: 'carol' },
];

export const tags: Tag[] = [
  { id: 1, name: 'Web' },
  { id: 2, name: 'AI' },
  { id: 3, name: 'Mobile' },
  { id: 4, name: 'GameDev' },
];

export const roles: Role[] = [
  { id: 1, name: 'Frontend' },
  { id: 2, name: 'Backend' },
  { id: 3, name: 'Designer' },
  { id: 4, name: 'QA' },
];

export const projects: Project[] = [
  {
    id: 1,
    title: 'Трекер привычек для студентов',
    description:
      'Веб-приложение для отслеживания ежедневных привычек с геймификацией и статистикой. Ищем команду для запуска MVP.',
    status: 'looking_for_roles',
    author: users[1],
    tags: [tags[0], tags[2]],
    roles: [
      { role: roles[0], slots: 1, filled: 0 },
      { role: roles[2], slots: 1, filled: 1 },
    ],
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 2,
    title: 'AI-помощник для конспектов',
    description:
      'Сервис, который превращает лекции в структурированные конспекты и карточки для повторения.',
    status: 'looking_for_roles',
    author: users[2],
    tags: [tags[1], tags[0]],
    roles: [
      { role: roles[1], slots: 2, filled: 0 },
      { role: roles[3], slots: 1, filled: 1 },
    ],
    createdAt: '2025-01-12T14:30:00Z',
  },
  {
    id: 3,
    title: 'Кооперативная игра-головоломка',
    description: 'Небольшая игра на двоих с физикой и уровнями-загадками.',
    status: 'team_assembled',
    author: users[1],
    tags: [tags[3]],
    roles: [
      { role: roles[0], slots: 1, filled: 1 },
      { role: roles[2], slots: 1, filled: 1 },
    ],
    createdAt: '2025-01-05T09:15:00Z',
  },
];