import { Chip } from '@mui/material';
import type { ProjectStatus } from '../types';

const config: Record<ProjectStatus, { label: string; color: 'info' | 'success' | 'default' }> = {
  looking_for_roles: { label: 'Ищем роли', color: 'info' },
  team_assembled: { label: 'Команда собрана', color: 'success' },
  closed: { label: 'Закрыт', color: 'default' },
};

export default function StatusChip({ status }: { status: ProjectStatus }) {
  const { label, color } = config[status];
  return <Chip label={label} color={color} size="small" />;
}