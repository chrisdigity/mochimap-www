import Head from "next/head";
import { useRouter } from "next/router";

const Header = ({ headerTitle }) => {
  const location = useRouter();
  return (
    <Head>
      <title>{headerTitle}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="keywords" conetnt="mochimap website" />

      <meta name="theme-color" content="#141414" />
      <meta name="msapplication-navbutton-color" content="#141414" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#141414" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      ></meta>
      <script src="https://kit.fontawesome.com/a076d05399.js"></script>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js"></script>
      <script type="text/javascript" src="/static/Wave.js"></script>
      <script type="text/javascript" src="/static/libs/jquery.js"></script>
      {location.pathname.includes("/explorer/") ? (
        <script type="text/javascript" src="/static/Raw.js"></script>
      ) : null}
      <script type="text/javascript" src="/static/RawGeneral.js"></script>
    </Head>
  );
};

export default Header;
