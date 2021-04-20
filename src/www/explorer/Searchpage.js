
import { capitalize } from 'MochiMapUtils';
import { useWindowSize } from 'MochiMapHooks';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchPage () {
  const { width } = useWindowSize();
  const [searchIndex, setSearchIndex] = useState(1);
  const handleClick = (e, i) => { e.preventDefault(); setSearchIndex(i); };
  const sorry = (i) => window.alert(capitalize(search[i].name) +
    ' search is currently disabled, sorry for any inconvenience.');
  const search = [
    {
      name: 'address',
      property: 'addr',
      placeholder: 'Type Hashed or Tagged Address',
      handleClick: (e) => sorry(0) // handleClick(e, 0)
    }, {
      name: 'block',
      property: 'bnum',
      placeholder: 'Type Blockchain Block Number',
      handleClick: (e) => handleClick(e, 1)
    }, {
      name: 'network',
      property: 'ip',
      placeholder: 'Type Network IPv4 Address',
      handleClick: (e) => sorry(2) // handleClick(e, 2)
    }, {
      name: 'transaction',
      property: 'txid',
      placeholder: 'Type Transaction ID',
      handleClick: (e) => handleClick(e, 3)
    }
  ];

  return (
    <div className='explorer'>
      <div className='explorer_inner'>
        <div className='explorer_header'>
          {width > 500 ? 'Mochimo Blockchain Explorer' : 'Mochimo Explorer'}
        </div>
        <div className='explorer_filter'>
          <ul className='explorer_options'>
            {search.map((item, index) =>
              <Link
                onClick={item.handleClick}
                style={searchIndex === index ? {
                  color: '#fff',
                  letterSpacinr: '0.03rem',
                  borderBottom: '3px solid #2b0fff'
                } : {}}
                to='#'
                key={index}
              >{item.name[0].toUpperCase() + item.name.substring(1)}
              </Link>
            )}
          </ul>
        </div>
        <form
          action={'/explorer/' + search[searchIndex].name + '/search'}
          onSubmit={function () {
            const text = document.forms[0][search[searchIndex].property].value;
            document.forms[0][search[searchIndex].property].value = text.trim();
          }}
        >
          <div className='explorer_search'>
            <input
              type='text'
              name={search[searchIndex].property}
              placeholder={search[searchIndex].placeholder}
            />
            <input type='hidden' name='page' value='1' />
            <button type='submit' className='search_button'>
              Search {width > 500 && <FontAwesomeIcon icon={faSearch} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
