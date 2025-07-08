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
// import { routes } from "@/routes"; // routes akan diteruskan sebagai prop
import { useState, useEffect } from "react"; // Import useState dan useEffect
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../configs/firebase"; // Pastikan path ini benar untuk db

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

  // State untuk jumlah permintaan pinjaman
  const [loanRequestCount, setLoanRequestCount] = useState(0);

  // Efek untuk mengambil jumlah loan request secara real-time
  useEffect(() => {
    const q = query(collection(db, "loans"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoanRequestCount(snapshot.size);
    }, (error) => {
      console.error("Error listening to loan requests:", error);
      setLoanRequestCount(0); // Set ke 0 jika ada error
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

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
          className="flex flex-col items-center justify-center"
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
            {pages.map(({ icon, name, path }) => {
              const currentBadgeCount = (name === "Loan Request") ? loanRequestCount : 0;

              return (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color="green"
                        className="flex gap-4 px-4 capitalize"
                        fullWidth
                      >
                        {icon}
                        <Typography
                          color="inherit"
                          className="font-medium" 
                        >
                          {name}
                        </Typography>
                        {currentBadgeCount > 0 && ( 
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2.5 pt-1  rounded-2xl">
                            {currentBadgeCount}
                          </span>
                        )}
                      </Button>
                    )}
                  </NavLink>
                </li>
              );
            })}
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