
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function ExplorerSearchForm ({ ledgerOnly }) {
  const location = useLocation();
  const navigate = useNavigate();
  const defaultHint = 'Type Search';
  const [searchHint, setSearchHint] = useState(defaultHint);
  const [searchHintError, setSearchHintError] = useState();
  const handleSubmit = (event) => {
    event.preventDefault();
    const { value } = event.target?.search || {};
    navigate(location.pathname + '?search=' + value);
    return false;
  };
  const handleSearchText = (event) => {
    const { value } = event.target;
    const types = [];
    let error = false;
    if (value) {
      if ((/^(?:0x[0-9a-f]*|[0-9a-f*]+)$/i).test(value)) types.push('blocks');
      if ((/^[0-9a-f*]+$/i).test(value)) types.push('transactions');
      if ((/^[0-9a-f*]+$/i).test(value)) types.push('balances');
      if (types.length) setSearchHint(`Search ${types.join(' & ')} for...`);
      else {
        setSearchHint('Invalid Search Query...');
        error = true;
      }
    } else setSearchHint(defaultHint);
    setSearchHintError(error);
  };

  return (
    <Paper
      component='form' onSubmit={handleSubmit} sx={{
        padding: ({ spacing }) => spacing(1),
        width: { xs: '100%', sm: '80%' },
        background: ({ palette }) => palette.divider
      }}
    >
      <TextField
        autoFocus fullWidth size='small'
        label={searchHint} error={searchHintError}
        onChange={handleSearchText} InputProps={{
          required: true,
          name: 'search',
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton type='submit' aria-label='search'>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Paper>
  );
}
