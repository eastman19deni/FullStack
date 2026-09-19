import {
  Card, CardActionArea, CardContent, Typography, Box, LinearProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Project } from '../types';
import TagChip from './TagChip';
import StatusChip from './StatusChip';

export default function ProjectCard({ project }: { project: Project }) {
  const totalSlots = project.roles.reduce((acc, r) => acc + r.slots, 0);
  const filledSlots = project.roles.reduce((acc, r) => acc + r.filled, 0);
  const progress = totalSlots ? (filledSlots / totalSlots) * 100 : 0;

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea
        component={RouterLink}
        to={`/projects/${project.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
            <Typography variant="h6">{project.title}</Typography>
            <StatusChip status={project.status} />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {project.tags.map((t) => <TagChip key={t.id} tag={t} />)}
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Typography variant="caption" color="text.secondary">
              Команда: {filledSlots} / {totalSlots}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 0.5, borderRadius: 1, height: 6 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Автор: {project.author.username}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}