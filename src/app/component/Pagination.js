import { styled, TablePagination } from '@mui/material';

const SlimPagination = styled(TablePagination)({
  '.MuiTablePagination-toolbar': {
    minHeight: 0
  },
  '.MuiTablePagination-selectLabel': {
    marginTop: 0, marginBottom: 0
  },
  '.MuiTablePagination-select': {
    paddingTop: 0, paddingBottom: 0
  },
  '.MuiTablePagination-displayedRows': {
    marginTop: 0, marginBottom: 0
  },
  '.MuiTablePagination-actions': {
    '.MuiIconButton-root': {
      paddingTop: 0, paddingBottom: 0
    }
  }
});

const DEFAULTS = {
  rowsPerPageOptions: [5, 20, 50],
  labelRowsPerPage: 'Limit',
  component: 'div'
};

export default function Pagination
({ length = 0, limit = 5, offset = 0, ...props }) {
  // assign defaults and props to options
  const opts = Object.assign(Object.assign({}, DEFAULTS), props);
  // calculate extended options where necessary
  if (!('rowsPerPage' in opts)) opts.rowsPerPage = limit;
  if (!('page' in opts)) opts.page = offset / limit;
  if (!('count' in opts)) {
    opts.count = typeof length === 'number' && (length === 0 || length % limit)
      ? ((opts.page) * limit) + length
      : -1;
  }
  return (
    <SlimPagination {...opts} sx={{ overflowX: 'hidden' }} />
  );
}
