import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
  Progress,
  Button,
} from "@material-tailwind/react";
import {
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

import { StatisticsCard } from "@/widgets/cards";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { librarianServices } from "@/services/librarianServices";
import { loanServices } from "@/services/loanServices";
// projectsTableData is commented out in your original code, keep it if needed.
// import { projectsTableData } from "@/data";

export function Home() {
  const [stats, setStats] = useState(null);
  const [activeLoans, setActiveLoans] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await librarianServices.getDashboardStats();
        setStats(response);
        console.log("Dashboard Stats:", response); // Added label for clarity
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false); // Set loading to false after stats fetch
      }
    };

    fetchStats();
  }, []);

  // Fetch active loans
  useEffect(() => {
    const fetchActiveLoans = async () => {
      try {
        const response = await loanServices.getAllLoans();
        const filteredLoans = response.filter((loan) => loan.status == "approved");

        console.log("Filtered Active Loans:", filteredLoans); // Added label for clarity

        setActiveLoans(filteredLoans);
      } catch (error) {
        console.error("Gagal mengambil data Active Loans:", error);
      }
     
    };
    fetchActiveLoans();
  }, []);

  const cardData = [
    {
      color: "green",
      title: "Total Buku",
      value: stats?.totalBooks || 0,
      icon: "book",
      unitLabel: "Buku",
    },
    {
      color: "teal",
      title: "Stok Buku Fisik",
      value: stats?.totalPhysicalBooks || 0,
      icon: "book-open",
      unitLabel: "Buku",
    },
    {
      color: "lime",
      title: "Stok Buku Online",
      value: stats?.totalOnlineBooks || 0,
      icon: "book-open",
      unitLabel: "Buku",
    },
    {
      color: "indigo",
      title: "Buku Fisik Tersedia",
      value: stats?.availablePhysicalBooks || 0,
      icon: "book-open",
      unitLabel: "Buku",
    },
    {
      color: "red",
      title: "Total Pengguna",
      value: stats?.totalUsers || 0,
      icon: "user-group",
      unitLabel: "Pengguna",
    },
    {
      color: "blue",
      title: "Pinjaman Aktif",
      value: stats?.activeLoans || 0,
      icon: "clock",
      unitLabel: "Pinjaman", 
    },
    {
      color: "orange",
      title: "Status Pending",
      value: stats?.pendingLoans || 0,
      icon: "clock",
      unitLabel: "Pinjaman", 
    },
  ];

  const iconMap = {
    book: BookOpenIcon,
    "book-open": BookOpenIcon,
    "user-group": UserGroupIcon,
    clock: ClockIcon,
  };

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-6 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <Typography>Memuat statistik...</Typography>
        ) : (
          cardData.map(({ color, title, value, icon, unitLabel }) => ( 
            <StatisticsCard
              key={title}
              color={color}
              title={title}
              unitLabel={unitLabel} 
              value={value.toString()} 
              icon={React.createElement(iconMap[icon], {
                className: "w-6 h-6 text-white",
              })}
              footer={

                title 
              }
            />
          ))
        )}
      </div>

   
    </div>
  );
}

export default Home;