import { Chip } from '@mui/material';
import type { Tag } from '../types';

export default function TagChip({ tag }: { tag: Tag }) {
  return <Chip label={tag.name} size="small" variant="outlined" />;
}