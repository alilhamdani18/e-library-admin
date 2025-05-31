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
import { authorsTableData } from "@/data";

export function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const rowsPerPage = 10;

  const filteredData = authorsTableData.filter(({ name, email, address, status }) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      name.toLowerCase().includes(lowerSearch) ||
      email.toLowerCase().includes(lowerSearch) ||
      address.toLowerCase().includes(lowerSearch) ||
      status.toLowerCase().includes(lowerSearch);

    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filteredData, currentPage, totalPages]);

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

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
            label="Cari Nama, Email, Alamat, atau Status"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full mb-2"
            color="green"
          />
          <Select
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
          </Select>
        </div>

        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[700px] table-auto text-left">
            <thead>
              <tr>
                {["Nama", "Alamat", "Phone", "Status Anggota", "Since"].map((el) => (
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
              {currentData.map(
                ({ img, name, email, status, address, phone, date }, index) => {
                  const className = `py-3 px-5 ${
                    index === currentData.length - 1
                      ? ""
                      : "border-b border-blue-gray-100"
                  }`;

                  return (
                    <tr
                      key={`${name}-${(currentPage - 1) * rowsPerPage + index}`}
                      className="hover:bg-blue-gray-50 transition-colors"
                    >
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={img}
                            alt={name}
                            size="sm"
                            variant="rounded"
                          />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            <Typography className="text-xs text-blue-gray-400">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {address}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {phone}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status === "active" ? "green" : "blue"}
                          value={status === "active" ? "Active" : "Purna"}
                          className="py-0.5 px-3 text-xs font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {date}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
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
