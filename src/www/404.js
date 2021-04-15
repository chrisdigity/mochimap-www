import Link from "next/link";

const Errorpage = () => {
  return (
    <div className="error_pg">
      <div className="error_pg_inn">
        <h1>404</h1>
        <p>Oops... Page not found !!</p>
        <div className="err_links">
          <Link href="/">Go back home</Link> |{" "}
          <Link href="/explorer/">Go to explorer</Link>
        </div>
      </div>
    </div>
  );
};

export default Errorpage;
