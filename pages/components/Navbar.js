import Link from "next/link";
import { useRouter } from "next/router";
import { useWindowSize } from "@react-hook/window-size/throttled";

const Navbar = () => {
  const location = useRouter();
  const [width] = useWindowSize();

  return (
    <div className="navbar">
      <div className="logo">Mochimap</div>

      <div className="navbar_small no_small_nav">
        <ul className="navlinks">
          {["haiku", "explorer", "services", "what is Mochimo?"].map(
            (item, index) => {
              if (location?.pathname === `/${item}`) {
                return index !== 3 ? (
                  <li
                    key={index}
                    className={`nav_${item.toLowerCase()} nav_selected`}
                  >
                    {item}
                  </li>
                ) : (
                  <li key={index} className={`nav_about`}>
                    {item}
                  </li>
                );
              } else {
                return index !== 3 ? (
                  location.pathname?.includes("/explorer/") && index == 1 ? (
                    <Link href={`/${item.toLowerCase()}`}>
                      <li className={`nav_${item.toLowerCase()} nav_selected`}>
                        {item}
                      </li>
                    </Link>
                  ) : (
                    <Link href={`/${item.toLowerCase()}`}>
                      <li key={index} className={`nav_${item.toLowerCase()}`}>
                        {item}
                      </li>
                    </Link>
                  )
                ) : location?.pathname === `/about` ? (
                  <li key={index} className={`nav_about nav_selected`}>
                    {item}
                  </li>
                ) : (
                  <Link href={`/about` + ""}>
                    <li key={index} className={`nav_about`}>
                      {item}
                    </li>
                  </Link>
                );
              }
            }
          )}
        </ul>
      </div>

      <div className="rgtSect">
        <ul className="navlinks">
          {["haiku", "explorer", "services", "what is Mochimo?"].map(
            (item, index) => {
              if (location?.pathname === `/${item}`) {
                return index !== 3 ? (
                  <li
                    key={index}
                    className={`nav_${item.toLowerCase()} nav_selected`}
                  >
                    {item}
                  </li>
                ) : (
                  <li key={index} className={`nav_about`}>
                    {item}
                  </li>
                );
              } else {
                return index !== 3 ? (
                  location?.pathname.includes("/explorer/") && index == 1 ? (
                    <Link href={`/${item.toLowerCase()}`}>
                      <li className={`nav_${item.toLowerCase()} nav_selected`}>
                        {item}
                      </li>
                    </Link>
                  ) : (
                    <Link href={`/${item.toLowerCase()}`}>
                      <li key={index} className={`nav_${item.toLowerCase()}`}>
                        {item}
                      </li>
                    </Link>
                  )
                ) : location?.pathname === `/about` ? (
                  <li key={index} className={`nav_about nav_selected`}>
                    {item}
                  </li>
                ) : (
                  <Link href={`/about` + ""}>
                    <li key={index} className={`nav_about`}>
                      {item}
                    </li>
                  </Link>
                );
              }
            }
          )}
        </ul>
        <div className="menu_butt">
          <div className="mbutt"></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
