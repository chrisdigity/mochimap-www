
import { Typography } from '@material-ui/core';

export default function TabPanel ({ active, children, error }) {
  if (!active) return null; // Tab Panel not selected...
  if (error) {
    return (
      <>
        <Typography variant='h6'>{error}</Typography>
      </>
    );
  }
  return children;
}
