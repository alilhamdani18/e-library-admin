import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { getAuth, signOut } from "firebase/auth";
import { routes } from "@/routes";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    colorize: "bg-gradient-to-br from-green-800 to-green-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
      signOut(auth)
        .then(() => {
          navigate("/sign-in");
        })
        .catch((error) => {
          console.error("Logout gagal:", error);
        });
  };
  
  const sidebarRoutes = routes.filter(route => route.layout === "dashboard");


  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 w-72 rounded-xl m-4 transition-transform duration-300 xl:translate-x-0 border border-green-100 overflow-y-auto`}
    >
      <div className={`relative`}>
        <Link
          to="/"
          className="flex flex-col items-center justify-center text-center"
        >
          <img
            src={brandImg}
            alt="Logo"
            className="h-28 w-28 object-contain"
          />
          <Typography
            variant="h6"
            color={sidenavType === "colorize" ? "white" : "green"}
          >
            {brandName}
          </Typography>
        </Link>

        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
       
      </div>
      <div className="m-4">

        {sidebarRoutes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-3 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "colorize" ? "white" : "green"} 
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color="green" 
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
              {/* <li className="mx-3.5 mt-4 mb-2">
                <Button
                  variant="text"
                  color="blue-gray"
                  onClick={handleLogout}
                  className="hidden items-center gap-1 px-4 xl:flex normal-case"
                >
                  <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                  Logout
                </Button>

              </li> */}
            <div>
            </div>
          </ul>
        ))}
        
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/e-library-icon.png",
  brandName: "E-Library Admin",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
