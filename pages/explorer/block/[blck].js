import Link from "next/link";
import Pagination from "./Pagination";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export async function getServerSideProps(context) {
  try {
    const res = await fetch(
      `https://api.mochimap.com/block/${context.params.blck}`
    );
    const data = await res.json();
    return {
      props: { data },
    };
  } catch (error) {
    return {
      props: { data: {} },
    };
  }
}

const BlockDetails = ({ data }) => {
  const [blockData, setBlockData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (data?._id) {
      setBlockData(data);
    } else {
      setNotFound(true);
    }
  }, [router.query.blck]);

  const [currentPg, setCurrentPg] = useState(1);

  const transPerPage = 8;
  const lastTrans = currentPg * transPerPage;
  const firstTrans = lastTrans - transPerPage;
  const currentTrans = !blockData?._id
    ? []
    : blockData.txids.slice(firstTrans, lastTrans);

  const paginate = (num) => setCurrentPg(num);

  return !router.query.blck ? null : (
    <div className="b_det">
      <div className="b_det_inn">
        <div className="bdet_head">
          {blockData?._id && <p>Block details </p>}
        </div>
        {blockData?._id && (
          <div className="bdet_main">
            <ul className="bdet">
              <li>
                <p>Block number</p>
                <p>{blockData?.bnum}</p>
              </li>
              <li>
                <p>Hash</p>
                <p>{blockData?.bhash}</p>
              </li>
              <li>
                <p>Difficulty</p>
                <p>{blockData?.difficulty}</p>
              </li>
              <li>
                <p>Reward</p>
                <p>{blockData?.mreward}</p>
              </li>
              <li>
                <p>Size</p>
                <p>{blockData?.size}</p>
              </li>
              <li>
                <p>Amount</p>
                <p>{blockData?.amount}</p>
              </li>
              <li>
                <p>Transactions</p>
                <p>{blockData?.tcount}</p>
              </li>
              <li>
                <p>Mining fee</p>
                <p>${blockData?.mfee}</p>
              </li>
              <li>
                <p>Nonce</p>
                <p>{blockData?.nonce}</p>
              </li>
              <li>
                <p>Markle root</p>
                <p>{blockData?.mroot}</p>
              </li>
              <li>
                <p>Miner's address</p>
                <p>{blockData?.maddr}</p>
              </li>
            </ul>
            <ul className="bdet_trans">
              <div className="bdet_trans_head">
                <p>Block transactions </p>
              </div>
              <ul className="bdet_list_items">
                {currentTrans.map((item) => (
                  <Link href={`/explorer/transaction/${item}`}>
                    <li>
                      <p>
                        <span>ϟ</span>&nbsp;
                        {item}
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
              <Pagination
                paginate={paginate}
                currentPage={currentPg}
                itemsPerPage={transPerPage}
                itemTotal={blockData?.txids.length}
              />
            </ul>
          </div>
        )}
        {notFound && (
          <div className="go_back">
            <h1>Block not found</h1>
            <p onClick={() => router.back()}>Go back</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockDetails;
