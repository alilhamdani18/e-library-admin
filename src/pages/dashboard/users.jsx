// src/pages/Users.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { userService } from "@/services/userServices";
import { DeviceTabletIcon } from "@heroicons/react/24/solid";
import getDateString from "@/utils/getDate";

export function Users() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const rowsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAllUsers();
      const transformedData = data.map(users => ({
        profileImageUrl: users.profileImageUrl || "/img/icon-app.png",
        name: users.name || "No Name",
        email: users.email || "No Email",
        address: users.address || "No Address",
        
        phone: users.phone || "No Phone",
        createdAt: getDateString(users.createdAt),
      }));
      setUsers(transformedData);

      console.log("Type of users:", typeof data, Array.isArray(data));
      console.log("Users data:", data);
    } catch (err) {
      setError("Gagal memuat data users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
    // Filter & pencarian
  const filteredData = users.filter(({ name, email, address, phone }) => {
    const lower = searchTerm.toLowerCase();
    const matchesSearch =
      name.toLowerCase().includes(lower) ||
      email.toLowerCase().includes(lower) ||
      address.toLowerCase().includes(lower) ||
      phone.toLowerCase().includes(lower);
   

   

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);



  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filteredData, totalPages, currentPage]);

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // Loading state
  if (loading && users.length === 0) {
    return (
      <Card className="mt-8 mb-6 border border-blue-gray-100 shadow-lg">
        <CardBody className="p-6 text-center">
          <Typography variant="h6" color="blue-gray">
            Memuat data users...
          </Typography>
        </CardBody>
      </Card>
    );
  }
  
    // Error state
    if (error) {
      return (
        <Card className="mt-8 mb-6 border border-red-100 shadow-lg">
          <CardBody className="p-6 text-center">
            <Typography variant="h6" color="red">
              {error}
            </Typography>
            <Button color="blue" onClick={fetchUsers} className="mt-4">
              Coba Lagi
            </Button>
          </CardBody>
        </Card>
      );
    }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader variant="gradient" color="green" className="mb-0 p-6">
          <Typography variant="h5" color="white" className="font-bold">
            Daftar Pengguna
          </Typography>
        </CardHeader>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-4 px-6 py-4 bg-gray-50 border-b">
          <Input
            label="Cari Nama, Email, atau Alamat"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full mb-2"
            color="green"
          />
          {/* <Select
            label="Filter Status"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            className="w-full"
            color="green"
          >
            <Option value="all">Semua</Option>
            <Option value="active">Active</Option>
            <Option value="purna">Purna</Option>
          </Select> */}
        </div>

        {/* Body dengan handling loading/error */}
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          {loading ? (
            <div className="p-6 text-center text-blue-gray-500">
              Memuat data pengguna...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : (
            <table className="w-full min-w-[700px] table-auto text-left">
              <thead>
                <tr>
                  {["Nama", "Alamat", "Phone", "Terdaftar"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-100 py-3 px-5"
                    >
                      <Typography
                        variant="small"
                        className="text-xs font-bold uppercase text-blue-gray-500"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map(({ profileImageUrl, name, email, address, phone, createdAt }, idx) => {
                  const className = `py-3 px-5 ${
                    idx === currentData.length - 1 ? "" : "border-b border-blue-gray-100"
                  }`;

                  return (
                    <tr
                      key={`${name}-${(currentPage - 1) * rowsPerPage + idx}`}
                      className="hover:bg-blue-gray-50 transition-colors"
                    >
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={profileImageUrl} alt={name} className="max-w-[50px]" size="lg" variant="rounded" />
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {name}
                            </Typography>
                            <Typography className="text-xs text-blue-gray-400">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm text-blue-grey-800">
                          {address}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm text-blue-grey-800">
                          {phone}
                        </Typography>
                      </td>
                      {/* <td className={className}>
                          <Chip
                            variant="gradient"
                            color={status === "active" ? "green" : "blue"}
                            value={status === "active" ? "Active" : "Purna"}
                            className="py-0.5 px-3 text-xs font-medium w-fit text-center"
                          />
                        </td> */}
                      <td className={className}>
                        <Typography className="text-sm text-blue-grey-800">
                          {createdAt}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          )}
        </CardBody>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-blue-gray-100">
          <div className="text-sm text-blue-gray-600 select-none">
            Total Data: {filteredData.length}
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <Button
              size="sm"
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Prev
            </Button>
            <Typography className="text-sm font-semibold text-blue-gray-700">
              {currentPage} / {totalPages}
            </Typography>
            <Button
              size="sm"
              variant="outlined"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Users;
