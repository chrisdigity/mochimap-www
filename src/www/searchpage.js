import { useState, useEffect } from "react";
import { useWindowSize } from "@react-hook/window-size/throttled";

const Explorer = () => {
  const [width] = useWindowSize();
  const [currentSect, setCurrentSect] = useState(0);
  const placeHolders = [
    "Type Block Number or Select Filter",
    "Search Ledger",
    "Search the network",
    "Type transaction id",
  ];

  return (
    <div className="explorer">
      <div className="explorer_inner">
        <div className="explorer_header">
          {width > 500 ? "Explore the Mochimo Blockchain" : "Mochimo Explorer"}
        </div>
        <div className="explorer_filter">
          <ul className="explorer_options">
            {["Block", "Ledger", "Network", "Transaction"].map((item, index) =>
              index == currentSect ? (
                <li
                  style={{
                    color: "#fff",
                    letterSpacinr: "0.03rem",
                    borderBottom: "3px solid #2b0fff",
                  }}
                >
                  {item}
                </li>
              ) : (
                <li onClick={() => setCurrentSect(index)}>{item}</li>
              )
            )}
          </ul>
        </div>
        <div className="explorer_search">
          <input type="text" placeholder={placeHolders[currentSect]} />
          <div className="search_button">
            Search
            {width > 500 && <i class="fa fa-search"></i>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
