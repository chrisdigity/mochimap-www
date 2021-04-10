import Transcomps from "./TransactionComponent";
import Pagination from "./Pagination";

export async function getServerSideProps(context) {
  try {
    const res = await fetch(
      `https://api.mochimap.com/transaction/search?page=${context.query.page}`
    );
    const data = await res.json();
    const presentPage = context.query.page;
    return {
      props: { data, presentPage },
    };
  } catch (error) {
    return {
      props: { data: {} },
    };
  }
}

const Transactions = ({ data, presentPage }) => {
  return (
    <div className="et">
      <div className="et_inn">
        <Transcomps transData={data?.results} />
        <Pagination currentPage={presentPage} pages={data?.pages} />
      </div>
    </div>
  );
};

export default Transactions;
