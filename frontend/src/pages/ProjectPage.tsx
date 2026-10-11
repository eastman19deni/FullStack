import { Box, Typography, Button, Divider, Paper, LinearProgress, Avatar } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAsync } from '../shared/lib/useAsync';
import { projectApi } from '../entities/project/api';
import StatusChip from '../shared/ui/StatusChip';
import TagChip from '../entities/tag/ui/TagChip';
import PageLoader from '../shared/ui/PageLoader';
import ErrorState from '../shared/ui/ErrorState';

export default function ProjectPage() {
  const { id } = useParams();
  const projectId = Number(id);

  const { data: project, loading, error, refetch } = useAsync(
    () => projectApi.getById(projectId),
    [projectId],
  );

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!project) {
    return (
      <Box>
        <Typography variant="h5">Проект не найден</Typography>
        <Button component={RouterLink} to="/projects" sx={{ mt: 2 }}>
          ← К списку проектов
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button component={RouterLink} to="/projects" sx={{ mb: 2 }}>
        ← К списку проектов
      </Button>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>{project.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 28, height: 28 }}>
                {project.author.username[0].toUpperCase()}
              </Avatar>
              <Typography color="text.secondary">
                {project.author.username} · {new Date(project.createdAt).toLocaleDateString('ru-RU')}
              </Typography>
            </Box>
          </Box>
          <StatusChip status={project.status} />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 3 }}>
          {project.tags.map((t) => <TagChip key={t.id} tag={t} />)}
        </Box>

        <Typography sx={{ whiteSpace: 'pre-line', mb: 3 }}>{project.description}</Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Ищем роли</Typography>
        {project.roles.length === 0 && (
          <Typography color="text.secondary">Роли пока не указаны</Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {project.roles.map((r) => {
            const progress = r.slots ? (r.filled / r.slots) * 100 : 0;
            return (
              <Box key={r.role.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>{r.role.name}</Typography>
                  <Typography color="text.secondary">{r.filled} / {r.slots}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ mt: 0.5, borderRadius: 1, height: 6 }}
                />
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Button variant="contained">Откликнуться</Button>
      </Paper>
    </Box>
  );
}
