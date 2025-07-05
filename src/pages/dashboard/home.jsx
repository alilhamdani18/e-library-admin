import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
  Progress,
  Button
} from "@material-tailwind/react";
import { BookOpenIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/solid";

import { StatisticsCard } from "@/widgets/cards";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { librarianServices } from "@/services/librarianServices";
import { loanServices } from "@/services/loanServices";
import { projectsTableData } from "@/data";

export function Home() {
  const [stats, setStats] = useState(null);
  const [activeLoans, setActiveLoans] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await librarianServices.getDashboardStats();
        setStats(response); 
        console.log(response)
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchActiveLoans = async () => {
      try {
        const response = await loanServices.getAllLoans();
        const filteredLoans = response.filter(loan => loan.status == 'approved');

        console.log(filteredLoans);
        
        setActiveLoans(filteredLoans); 
      } catch (error) {
        console.error("Gagal mengambil data Active Loans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveLoans();
  }, [])

  const cardData = [
    {
      color: "green",
      title: "Total Buku",
      value: stats?.totalBooks || 0,
      icon: "book",
    },
    {
      color: "teal",
      title: "Stok Buku Fisik",
      value: stats?.totalPhysicalBooks || 0,
      icon: "book-open",
    },
    {
      color: "lime",
      title: "Stok Buku Online",
      value: stats?.totalOnlineBooks || 0,
      icon: "book-open",
    },
    {
      color: "indigo",
      title: "Buku Fisik Tersedia",
      value: stats?.availablePhysicalBooks || 0,
      icon: "book-open",
    },
    {
      color: "red",
      title: "Total Pengguna",
      value: stats?.totalUsers || 0,
      icon: "user-group",
    },
    {
      color: "blue",
      title: "Pinjaman Aktif",
      value: stats?.activeLoans || 0,
      icon: "clock",
    },
    {
      color: "orange",
      title: "Status Pending",
      value: stats?.pendingLoans || 0,
      icon: "clock",
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
          cardData.map(({ color, title, value, icon }) => (
            <StatisticsCard
              key={title}
              color={color}
              title={title}
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

      {/* <div className="mb-4">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Active Loans
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-green-500" />
                <strong>{stats?.activeLoans} active</strong> this month
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["book title", "users", "tgl pinjam", "tgl dikembalikan", "action"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, title, author, members, loanDate, returnDate }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={title}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={title} size="sm" />
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                              >
                                {title}
                              </Typography>
                              <Typography
                                color="gray"
                                className="font-normal text-xs"
                              >
                                {author}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {loanDate}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {returnDate}%
                            </Typography>
                            <Progress
                              value={returnDate}
                              variant="gradient"
                              color={returnDate === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                        <td className={className}>
                          <Button
                            size="sm"
                            color="blue"
                            variant="gradient"
                            onClick={() =>
                              handleOpenModal(
                                loan,
                                (currentPage - 1) * rowsPerPage + index
                              )
                            }
                          >
                            Detail
                          </Button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div> */}
    </div>
  );
}

export default Home;
