
import { useState } from 'react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  Select,
  TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'relative',
    'flex-direction': 'column',
    'justify-content': 'end',
    'align-items': 'center'
  },
  form: {
    'min-width': '400px',
    'padding-top': theme.spacing(1),
    padding: theme.spacing(4),
    width: '60vw',
    display: 'flex',
    background: theme.palette.divider
  },
  grow: {
    'flex-grow': 1
  }
}));

export default function ExplorerSearchForm () {
  const [searchText, setSearchText] = useState();
  const [searchType, setSearchType] = useState();
  const [searchHint, setSearchHint] = useState('Type Search Query');
  const handleSearchText = (event) => setSearchText(event.target.value);
  const handleSearchType = (event) => {
    const { value } = event.target;
    switch (value) {
      case 'node': setSearchHint('Type IPv4 Address'); break;
      case 'blockchain': setSearchHint('Type Block Number/Hash'); break;
      case 'transaction': setSearchHint('Type Transaction ID'); break;
      case 'address': setSearchHint('Type WOTS+ Address'); break;
      case 'tag': setSearchHint('Type Tagged Address'); break;
      default: setSearchHint('Type Search Query');
    }
    setSearchType(value);
  };

  const classes = useStyles();

  return (
    <form className={classes.root}>
      <Paper className={classes.form}>
        <FormControl>
          <InputLabel id='search-native-label'>Search for</InputLabel>
          <Select
            native
            dir='rtl'
            color='secondary'
            value={searchType}
            onChange={handleSearchType}
            labelId='search-native-label'
            inputProps={{ name: searchType && 'search' }}
          >
            <option aria-label='all' />
            <option value='node'>Node</option>
            <option value='blockchain'>Blockchain</option>
            <option value='transaction'>Transaction</option>
            <option value='address'>Address</option>
            <option value='tag'>Tag</option>
          </Select>
        </FormControl>
        <TextField
          autoFocus
          className={classes.grow}
          color='secondary'
          onChange={handleSearchText}
          label={`${searchHint}...`}
          InputProps={{
            required: true,
            name: searchText && 'for',
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
    </form>
  );
}
