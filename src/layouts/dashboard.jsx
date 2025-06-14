import { Routes, Route } from "react-router-dom";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";


export function Dashboard() {

  return (
    <div className="min-h-screen bg-green-50">
      <Sidenav
        routes={routes}
        // brandImg={
        //   sidenavType === "colorize" ? "/img/e-library-icon.png" : "/img/e-library-icon.png"
        // }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
