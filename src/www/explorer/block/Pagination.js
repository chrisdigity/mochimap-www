
import { integerRange } from 'MochiMapUtils';

export default function Pagination (
  { itemsPerPage, itemTotal, currentPage, paginate }) {
  const maxPages = Math.ceil(itemTotal / itemsPerPage);
  const pages = integerRange(1, maxPages);

  return (
    <div className='more_result'>
      <ul>
        {Number(currentPage) === 1 ? (
          <li className='not_active'>⇠</li>
        ) : (
          <li onClick={() => paginate(Number(currentPage) - 1)}>⇠</li>
        )}
        {pages.map((page) =>
          Number(currentPage) === page ? (
            <li key={page} className='pres_pg' onClick={() => paginate(page)}>
              {page}
            </li>
          ) : (
            <li key={page} onClick={() => paginate(page)}>
              {page}
            </li>
          )
        )}
        {Number(currentPage) === pages[pages.length - 1] ? (
          <li className='not_active'>⇢</li>
        ) : (
          <li onClick={() => paginate(Number(currentPage) + 1)}>⇢</li>
        )}
      </ul>
    </div>
  );
}
