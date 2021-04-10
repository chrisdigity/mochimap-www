import "moment-timezone";
import moment from "moment";
import Link from "next/link";
import Searchpage from "./searchpage";
import { useState, useEffect } from "react";
import { useWindowSize } from "@react-hook/window-size/throttled";

export async function getStaticProps(context) {
  try {
    const res = await fetch(`https://api.mochimap.com/transaction/search`);
    const res2 = await fetch(`https://api.mochimap.com/block/search`);
    const data1 = await res.json();
    const data2 = await res2.json();
    return {
      props: { data1, data2 },
    };
  } catch (error) {
    return {
      props: { data1: {}, data2: {} },
    };
  }
}

const Explorer = ({ data1, data2 }) => {
  const [width] = useWindowSize();
  const [blockData, setBlockData] = useState([]);
  const [transData, setTransData] = useState([]);
  useEffect(() => {
    if (data1?.results) {
      setTransData(data1?.results);
    }
    if (data1?.results) {
      setBlockData(data2?.results);
    }
  }, []);

  const pad_with_zeroes = (number, length) => {
    if (Number(number) > 0) {
      return number;
    }
    var my_string = "" + number;
    while (my_string.length < length) {
      my_string = "0" + my_string;
    }

    return my_string;
  };

  return (
    <div className="home">
      <div className="search_sect">
        <Searchpage />
      </div>
      <div className="brief_list">
        <div className="brief_list_header">
          <div className="left_tag">
            {width > 500 ? (
              <p>Latest block activities</p>
            ) : (
              <p>Block activities</p>
            )}
          </div>
          <div className="present_height">
            <img src="./icons/block5.svg" alt="block" />
            {width > 500 && <p> Height:</p>}
            {blockData?.length > 0 && <p>{blockData[0].bnum}</p>}
          </div>
        </div>

        <div className="brief_list_inn">
          <div className="blocks">
            <div className="block_header">
              <div className="header_sect1">
                <p>Recent Blocks</p>
                <p>most recently added blocks</p>
              </div>
              <div className="view_all">
                <Link scroll href="/explorer/blocks/search?page=1">
                  View all&nbsp;&nbsp;⇢
                </Link>
              </div>
            </div>
            <ul className="blocks_list">
              <li className="height">Height</li>
              {width > 385 && <li className="time">Time</li>}
              {width > 500 && <li className="size">Size</li>}
              <li className="amount">Amount</li>
            </ul>
            {blockData?.slice(0, 8).map((item, index) => {
              return (
                <ul className="blocks_list" key={index}>
                  <li className="height">{item.bnum}</li>
                  {width > 385 && (
                    <li className="time">
                      {moment()
                        .add(-item.time0 / 3600, "ms")
                        .fromNow()}
                    </li>
                  )}
                  {width > 500 && <li className="size">{item.size}</li>}
                  <li className="amount">
                    {item.amount > 10000000000
                      ? item.amount
                      : pad_with_zeroes(item.amount, 10)}
                  </li>
                </ul>
              );
            })}
          </div>
          <div className="transactions">
            <div className="trans_header">
              <div className="header_sect1">
                <p>Latest Transactions</p>
                <p>most transactions done</p>
              </div>
              <div className="view_all">
                <Link scroll href="/explorer/transactions/search?page=1">
                  View all&nbsp;&nbsp;⇢
                </Link>
              </div>
            </div>
            <ul className="trans_list">
              <li className="height">Transaction Id</li>
              <li className="time">Send Total</li>
            </ul>
            {transData.slice(0, 8).map((item, index) => {
              return (
                <ul className="trans_list" key={index}>
                  <li className="height">
                    <p>{item.txid}</p>
                  </li>
                  <li className="time">
                    {item.sendtotal > 10000000
                      ? item.sendtotal
                      : pad_with_zeroes(item.sendtotal, 8)}
                  </li>
                </ul>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
