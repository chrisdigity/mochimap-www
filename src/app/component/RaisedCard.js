
import { Card, CardContent } from '@mui/material';

export default function RaisedCard ({ children, sx, ...props }) {
  return (
    <Card raised sx={{ background: 'rgba(46, 46, 46, 0.75)', ...sx }} {...props}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
