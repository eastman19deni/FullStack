import { useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useAsync } from '../shared/lib/useAsync';
import { projectApi } from '../entities/project/api';
import type { ProjectStatus } from '../entities/project/model/types';
import ProjectCard from '../entities/project/ui/ProjectCard';
import ProjectSearch from '../features/project-search/ui/ProjectSearch';
import PageLoader from '../shared/ui/PageLoader';
import ErrorState from '../shared/ui/ErrorState';
import EmptyState from '../shared/ui/EmptyState';

type Filter = 'all' | ProjectStatus;

export default function ProjectsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const { data, loading, error, refetch } = useAsync(
    () => projectApi.list({ query, status: filter }),
    [query, filter],
  );

  const visible = data ?? [];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">Доска проектов</Typography>
          <Typography color="text.secondary">
            Находите идеи и присоединяйтесь к командам
          </Typography>
        </Box>
        <ProjectSearch value={query} onChange={setQuery} />
      </Box>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, v: Filter | null) => v && setFilter(v)}
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="all">Все</ToggleButton>
        <ToggleButton value="looking_for_roles">Ищем роли</ToggleButton>
        <ToggleButton value="in_progress">Команда собрана</ToggleButton>
        <ToggleButton value="completed">Закрытые</ToggleButton>
      </ToggleButtonGroup>

      {loading && <PageLoader />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && visible.length === 0 && <EmptyState text="Ничего не найдено" />}
      {!loading && !error && visible.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {visible.map((p) => <ProjectCard key={p.id} project={p} />)}
        </Box>
      )}
    </Box>
  );
}
