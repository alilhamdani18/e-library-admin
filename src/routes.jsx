import {
  HomeIcon,
  UserCircleIcon,
  BookOpenIcon ,
  DocumentArrowDownIcon ,
  ServerStackIcon,
  UsersIcon ,
  TagIcon 
} from "@heroicons/react/24/solid";
import { Home, Profile, Library, Users, LoanRequest, LoanHistory } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <BookOpenIcon  {...icon} />,
        name: "library",
        path: "/library",
        element: <Library />,
      },
     
      {
        icon: <UsersIcon  {...icon} />,
        name: "users",
        path: "/users",
        element: <Users />,
      },
     
      {
        icon: <DocumentArrowDownIcon  {...icon} />,
        name: "Loan Request",
        path: "/loan-request",
        element: <LoanRequest />,
      },
      {
        icon: <TagIcon   {...icon} />,
        name: "Loan History",
        path: "/loan-history",
        element: <LoanHistory />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "log out",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  }
  
];

export default routes;
