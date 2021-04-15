import Link from "next/link";
import { useWindowSize } from "@react-hook/window-size/throttled";

const Pagination = ({ pages, currentPage }) => {
  const [width] = useWindowSize();

  const currentNum = Number(currentPage);
  const pgNumbers =
    currentPage == 1
      ? [
          currentNum,
          currentNum + 1,
          currentNum + 2,
          currentNum + 3,
          currentNum + 4,
          currentNum + 5,
        ]
      : currentPage < pages - 5
      ? [
          currentNum - 1,
          currentNum,
          currentNum + 1,
          currentNum + 2,
          currentNum + 3,
          currentNum + 4,
        ]
      : currentPage < pages - 4
      ? [
          currentNum,
          currentNum + 1,
          currentNum + 2,
          currentNum + 3,
          currentNum + 4,
          currentNum + 5,
        ]
      : currentPage < pages - 3
      ? [
          currentNum - 1,
          currentNum,
          currentNum + 1,
          currentNum + 2,
          currentNum + 3,
          currentNum + 4,
        ]
      : currentPage < pages - 2
      ? [
          currentNum - 2,
          currentNum - 1,
          currentNum,
          currentNum + 1,
          currentNum + 2,
          currentNum + 3,
        ]
      : currentPage < pages - 1
      ? [
          currentNum - 3,
          currentNum - 2,
          currentNum - 1,
          currentNum,
          currentNum + 1,
          currentNum + 2,
        ]
      : currentPage < pages
      ? [
          currentNum - 4,
          currentNum - 3,
          currentNum - 2,
          currentNum - 1,
          currentNum,
          currentNum + 1,
        ]
      : [
          currentNum - 5,
          currentNum - 4,
          currentNum - 3,
          currentNum - 2,
          currentNum - 1,
          currentNum,
        ];

  return (
    <div className="more_result">
      <ul>
        {currentNum == 1 ? (
          <li className="not_active">⇠</li>
        ) : (
          <Link href={`/explorer/blocks/search?page=${currentNum - 1}`}>
            <li>⇠</li>
          </Link>
        )}
        {currentNum > 10 && (
          <Link href={`/explorer/blocks/search?page=${currentNum - 10}`}>
            <li>+10</li>
          </Link>
        )}
        {currentNum > 100 && width > 500 && (
          <Link href={`/explorer/blocks/search?page=${currentNum - 100}`}>
            <li>+100</li>
          </Link>
        )}

        {pgNumbers?.map((num) =>
          currentNum == num ? (
            <Link href={`/explorer/blocks/search?page=${num}`}>
              <li key={num} className="pres_pg">
                {num}
              </li>
            </Link>
          ) : (
            <Link href={`/explorer/blocks/search?page=${num}`}>
              <li key={num}>{num}</li>
            </Link>
          )
        )}

        {currentNum < pages - 10 && (
          <Link href={`/explorer/blocks/search?page=${currentNum + 10}`}>
            <li>+10</li>
          </Link>
        )}
        {currentNum < pages - 100 && width > 500 && (
          <Link href={`/explorer/blocks/search?page=${currentNum + 100}`}>
            <li>+100</li>
          </Link>
        )}

        {currentNum == pages ? (
          <li className="not_active">⇢</li>
        ) : (
          <Link href={`/explorer/blocks/search?page=${currentNum + 1}`}>
            <li>⇢</li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
