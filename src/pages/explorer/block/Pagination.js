const Pagination = ({ itemsPerPage, itemTotal, currentPage, paginate }) => {
  const pgNumbers = [];

  for (let i = 1; i <= Math.ceil(itemTotal / itemsPerPage); i++) {
    pgNumbers.push(i);
  }

  return (
    <div className="more_result">
      <ul>
        {Number(currentPage) == 1 ? (
          <li className="not_active">⇠</li>
        ) : (
          <li onClick={() => paginate(Number(currentPage) - 1)}>⇠</li>
        )}

        {pgNumbers.map((num) =>
          Number(currentPage) == num ? (
            <li key={num} className="pres_pg" onClick={() => paginate(num)}>
              {num}
            </li>
          ) : (
            <li key={num} onClick={() => paginate(num)}>
              {num}
            </li>
          )
        )}

        {Number(currentPage) == pgNumbers[pgNumbers.length - 1] ? (
          <li className="not_active">⇢</li>
        ) : (
          <li onClick={() => paginate(Number(currentPage) + 1)}>⇢</li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
