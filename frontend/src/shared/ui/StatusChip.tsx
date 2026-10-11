import { Chip } from '@mui/material';
import type { ProjectStatus } from '../../entities/project/model/types';

const config: Record<ProjectStatus, { label: string; color: 'info' | 'success' | 'default' }> = {
  looking_for_roles: { label: 'Ищем роли', color: 'info' },
  in_progress: { label: 'Команда собрана', color: 'success' },
  completed: { label: 'Закрыт', color: 'default' },
};

export default function StatusChip({ status }: { status: ProjectStatus }) {
  const { label, color } = config[status];
  return <Chip label={label} color={color} size="small" />;
}
