import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
} from "@material-tailwind/react";
import { authorsTableData } from "@/data";

export function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(authorsTableData.length / rowsPerPage);

  // Reset halaman jika data berubah dan halaman saat ini tidak valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1); // kalau totalPages 0, set ke 1
    }
  }, [currentPage, totalPages]);

  const currentData = authorsTableData.slice(
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
        <CardHeader variant="gradient" color="green" className="mb-6 p-6">
          <Typography variant="h5" color="white" className="font-bold">
            Daftar Pengguna
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[700px] table-auto text-left">
            <thead>
              <tr>
                {["Nama", "Alamat", "Status", "Since", "Aksi"].map((el) => (
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
                ({ img, name, email, job, online, date }, index) => {
                  const className = `py-3 px-5 ${
                    index === currentData.length - 1
                      ? ""
                      : "border-b border-blue-gray-100"
                  }`;

                  return (
                    <tr
                      key={`${name}-${(currentPage - 1) * rowsPerPage + index}`} // unique key
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
                          {job[0]}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-400">
                          {job[1]}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={online ? "green" : "red"}
                          value={online ? "Online" : "Offline"}
                          className="py-0.5 px-3 text-xs font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {date}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Button
                          size="sm"
                          color="blue"
                          variant="gradient"
                          className="mr-2"
                        >
                          Edit
                        </Button>
                        <Button size="sm" color="red" variant="gradient">
                          Hapus
                        </Button>
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
            Total Data: {authorsTableData.length}
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
