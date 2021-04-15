import Blockcomps from "./Blockcomps";
import Pagination from "./Pagination";

export async function getServerSideProps(context) {
  try {
    const res = await fetch(
      `https://api.mochimap.com/block/search?page=${context.query.page}`
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

const Blocks = ({ data, presentPage }) => {
  return (
    <div className="eb">
      <div className="eb_inn">
        <Blockcomps blockData={data?.results} />
        <Pagination currentPage={presentPage} pages={data?.pages} />
      </div>
    </div>
  );
};

export default Blocks;
