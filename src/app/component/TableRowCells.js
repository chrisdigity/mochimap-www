
import { TableCell, TableRow } from '@material-ui/core';

export default function TableRowCells ({ id, cells }) {
  return (
    <TableRow>
      {(Array.isArray(cells) ? cells : [cells]).map((cell, index) => (
        <TableCell key={`${id}-cell${index}`} {...cell} />
      ))}
    </TableRow>
  );
}
