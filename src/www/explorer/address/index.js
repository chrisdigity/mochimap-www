import Transcomps from "./Transcomps";
import Pagination from "./Pagination";

export async function getServerSideProps(context) {
  try {
    const res = await fetch(
      `https://api.mochimap.com/balance/tag/${context.params.tag}`
    );
    const res2 = await fetch(
      `https://api.mochimap.com/transaction/search?tag=${context.params.tag}`
    );
    const data = await res.json();
    const data2 = await res2.json();
    const presentTag = context.params.tag;
    const presentPage = context.query.page;
    return {
      props: { data, data2, presentPage, presentTag },
    };
  } catch (error) {
    return {
      props: { data: {} },
    };
  }
}

const Transactions = ({ data, data2, presentPage, presentTag }) => {
  return (
    <div className="tag_address">
      <div className="tag_address_inn">
        <div className="tag_addr_head">
          <p>Tagged address</p>
        </div>
        <ul className="tag_det">
          <li>
            <div>
              <span>Address</span>
            </div>
            <div>
              <p>{data?.address}</p>
            </div>
          </li>
          <li>
            <div>
              <span>Tag</span>
            </div>
            <div>
              <p>{data?.tag}</p>
            </div>
          </li>
          <li>
            <div>
              <span>Balance</span>
            </div>
            <div>
              <p>{data?.balance}</p>
            </div>
          </li>
        </ul>

        <div className="tag_addr_tr_head">
          <p>Tagged address transactions</p>
        </div>

        <Transcomps transData={data2?.results} />
        <Pagination
          presentTag={presentTag}
          currentPage={presentPage}
          pages={data2?.pages}
        />
      </div>
    </div>
  );
};

export default Transactions;
