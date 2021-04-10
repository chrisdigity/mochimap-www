import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export async function getServerSideProps(context) {
  try {
    const res = await fetch(
      `https://api.mochimap.com/transaction/${context.params.tx}`
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

const Transaction = ({ data }) => {
  const router = useRouter();
  const [notFound, setNotFound] = useState(false);
  const [transData, setTransData] = useState(null);

  useEffect(() => {
    if (data?._id) {
      setTransData(data);
    } else {
      setNotFound(true);
    }
  }, [router.query.tx]);

  return !router.query.tx ? null : (
    <div className="tr_det">
      <div className="tr_det_inn">
        <div className="trdet_head">
          {transData && <p>Transaction details </p>}
        </div>
        {transData && (
          <div className="trdet_main">
            <ul className="trdet">
              <li>
                <p>Transaction id</p>
                <p>{transData?.txid}</p>
              </li>
              <li>
                <p>Send total</p>
                <p>{transData?.sendtotal}</p>
              </li>
              <li>
                <p>Transaction fee</p>
                <p>${transData?.txfee}</p>
              </li>
              <li>
                <p>Change total</p>
                <p>{transData?.changetotal}</p>
              </li>
              <Link
                href={`/explorer/transaction/tag/${transData?.srctag}?page=1`}
              >
                <li className="tr_tag">
                  <p>Src tag</p>
                  <p>{transData?.srctag}</p>
                </li>
              </Link>
              <li>
                <p>Src Address</p>
                <p>{transData?.srcaddr}</p>
              </li>
              <Link
                href={`/explorer/transaction/tag/${transData?.dsttag}?page=1`}
              >
                <li className="tr_tag">
                  <p>Dst tag</p>
                  <p>{transData?.dsttag}</p>
                </li>
              </Link>
              <li>
                <p>Dst Address</p>
                <p>{transData?.dstaddr}</p>
              </li>
              <Link
                href={`/explorer/transaction/tag/${transData?.chgtag}?page=1`}
              >
                <li className="tr_tag">
                  <p>Chg tag</p>
                  <p>{transData?.chgtag}</p>
                </li>
              </Link>
              <li>
                <p>Chg Address</p>
                <p>{transData?.chgaddr}</p>
              </li>
              <li>
                <p>Transaction Signature</p>
                <p>{transData?.txsig}</p>
              </li>
            </ul>
          </div>
        )}
        {notFound && (
          <div className="go_back">
            <h1>Transaction not found</h1>
            <p onClick={() => router.back()}>Go back</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
