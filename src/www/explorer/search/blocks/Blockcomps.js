import "moment-timezone";
import moment from "moment";
import Link from "next/link";
import { useWindowSize } from "@react-hook/window-size/throttled";

const Blockcomps = ({ blockData }) => {
  const [width] = useWindowSize();
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

  const pad_with_ox = (toPad) => {
    return "0x" + toPad.replace(/^0+/, "");
  };

  return (
    <>
      <div className="eb_header">
        <div className="eb_h1">
          {width > 500 ? (
            <p>
              Explorer <span>⇢ </span> Block history
            </p>
          ) : (
            <p>Block history</p>
          )}
        </div>
        <div>❒</div>
      </div>
      <ul className="eb_list">
        <li className=""></li>
        <li>
          <p>Block id</p>
        </li>
        {width > 500 && (
          <li>
            <p>Tx count</p>
          </li>
        )}
        {width > 570 && (
          <li className="height">
            <p>Height</p>
          </li>
        )}
        <li className="time">
          <p>Time</p>
        </li>
        {width > 730 && (
          <li className="size">
            <p>Block size</p>
          </li>
        )}
        {width > 1125 && (
          <li className="difficulty">
            <p>Difficulty</p>
          </li>
        )}
        {width > 570 && (
          <li className="amount">
            <p>Amount</p>
          </li>
        )}
      </ul>
      {blockData?.map((item, index) => {
        return (
          <ul className="eb_list eb_list_main" key={index}>
            <li className="">
              <div className="miner_img">
                <div
                  className="m_img"
                  style={{ backgroundImage: `url(${item.img?.thumb})` }}
                ></div>
              </div>
            </li>
            <Link scroll href={`/explorer/block/${item.bnum}`}>
              <li className="block_id">
                <p>{pad_with_ox(item._id)}</p>
              </li>
            </Link>
            {width > 500 && (
              <li>
                <p>{item.tcount}</p>
              </li>
            )}
            {width > 570 && (
              <li className="height">
                <p>{item.bnum}</p>
              </li>
            )}

            <li className="time">
              <p>
                {moment()
                  .add(-item.stime / 3600, "ms")
                  .fromNow()}
              </p>
            </li>
            {width > 730 && (
              <li className="size">
                <p>{item.size}</p>
              </li>
            )}
            {width > 1125 && (
              <li className="difficulty">
                <p>{item.difficulty}</p>
              </li>
            )}
            {width > 570 && (
              <li className="amount">
                <p>
                  {item.amount > 10000000000
                    ? item.amount
                    : pad_with_zeroes(item.amount, 10)}
                </p>
              </li>
            )}
          </ul>
        );
      })}
    </>
  );
};

export default Blockcomps;
