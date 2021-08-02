
import { useWindowSize } from 'MochiMapHooks';
import { integerRange } from 'MochiMapUtils';

export default function Pagination
({ title, page, pages, paginate, range = 4 }) {
  const { width } = useWindowSize();
  // interpret page variables as numbers and caculate page start/end
  const [currentPage, lastPage, firstPage] = [Number(page), Number(pages), 1];
  const pageStart = Math.max(currentPage - range, firstPage);
  const pageEnd = Math.min(pageStart + (range * 2), lastPage);

  return pages <= 1 ? null : (
    <div className='pagination'>
      <div className='dull'>{title}</div>
      <ul>
        {currentPage <= firstPage ? (<li className='not_active'>|⇠</li>) : (
          <li onClick={() => paginate(firstPage)}>|⇠</li>
        )}
        {lastPage > 100 && currentPage >= firstPage + 100 && width > 500 && (
          <li onClick={() => paginate(currentPage - 100)}>-100</li>
        )}
        {lastPage > 10 && currentPage >= firstPage + 10 && (
          <li onClick={() => paginate(currentPage - 10)}>-10</li>
        )}
        {integerRange(pageStart, pageEnd).map((page, i, array) =>
          currentPage === page ? (
            <li className='pres_pg' key={page}>{page}</li>
          ) : (
            <li key={page} onClick={() => paginate(page)}>
              {i === 0 && page > firstPage && '...'}
              {page}
              {i === array.length - 1 && page < lastPage && '...'}
            </li>
          )
        )}
        {lastPage > 10 && currentPage <= lastPage - 10 && (
          <li onClick={() => paginate(currentPage + 10)}>+10</li>
        )}
        {lastPage > 100 && currentPage <= lastPage - 100 && width > 500 && (
          <li onClick={() => paginate(currentPage + 100)}>+100</li>
        )}
        {currentPage >= lastPage ? (<li className='not_active'>⇢|</li>) : (
          <li onClick={() => paginate(lastPage)}>⇢|</li>
        )}
      </ul>
    </div>
  );
}
