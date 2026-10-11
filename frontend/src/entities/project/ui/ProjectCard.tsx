import { Card, CardActionArea, CardContent, Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Project } from '../model/types';
import StatusChip from '../../../shared/ui/StatusChip';
import TagChip from '../../tag/ui/TagChip';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea
        component={RouterLink}
        to={`/projects/${project.id}`}
        sx={{ height: '100%', alignItems: 'flex-start' }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="h6">{project.title}</Typography>
            <StatusChip status={project.status} />
          </Box>
          <Typography
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
