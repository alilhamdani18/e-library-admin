import { Routes, Route } from "react-router-dom";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController} from "@/context";


export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-green-50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "colorize" ? "/img/e-library-icon.png" : "/img/e-library-icon.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          
        >
       
        </IconButton>
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
