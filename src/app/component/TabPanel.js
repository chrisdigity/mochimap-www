
import { Typography } from '@material-ui/core';

export default function TabPanel ({ active, children, error, name }) {
  if (!active) return null; // Tab Panel not selected...
  if (error) {
    return (
      <>
        <Typography variant='h6'>Cannot Display {name}</Typography>
        <Typography variant='caption'>Reason: {error}</Typography>
      </>
    );
  }
  return children;
}
