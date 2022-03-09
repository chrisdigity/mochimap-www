
import { Grid } from '@mui/material';

let gruid = 0;

export function Gridrow
({ items = [], itemProps = {}, itemSizes = {}, ...props }) {
  return (
    <Grid container item {...props}>
      {items.map((item) => (
        <Grid key={`GridrowId-${gruid++}`} item {...itemSizes} {...itemProps}>
          {item}
        </Grid>
      ))}
    </Grid>
  );
}
