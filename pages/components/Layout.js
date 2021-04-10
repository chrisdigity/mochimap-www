import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="container">
      <Header headerTitle={"Mochimap - Blockchain Explorer"} />
      <Navbar />
      <main className="main">
        <div id="display"></div>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
