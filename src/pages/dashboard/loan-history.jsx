import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
} from "@material-tailwind/react";

const dummyData = [
  {
    img: "/img/team-2.jpeg",
    user: "Ahmad Nur",
    email: "ahmad@mail.com",
    title: "Pemrograman Java",
    status: true,
    borrowedDate: "18/05/2025",
    returnedDate: "25/05/2025",
  },
  {
    img: "/img/team-1.jpeg",
    user: "Siti Rahma",
    email: "siti@mail.com",
    title: "Flutter untuk Pemula",
    status: false,
    borrowedDate: "10/05/2025",
    returnedDate: "17/05/2025",
  },
];

export function LoanHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [data, setData] = useState(dummyData);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [currentPage, totalPages]);

  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const handleOpenModal = (book, index) => {
    setSelectedBook({ ...book, index });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setOpenModal(false);
  };

  const handleReturn = () => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID");

    const updatedData = [...data];
    const bookIndex = selectedBook.index;
    updatedData[bookIndex].returnedDate = formattedDate;
    updatedData[bookIndex].status = false;

    setData(updatedData);
    handleCloseModal();
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader variant="gradient" color="green" className="mb-6 p-6">
          <Typography variant="h5" color="white" className="font-bold">
            Riwayat Peminjaman
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[700px] table-auto text-left">
            <thead>
              <tr>
                {[
                  "Pengguna",
                  "Judul Buku",
                  "Status",
                  "Tgl Pinjam",
                  "Tgl Dikembalikan",
                  "Aksi",
                ].map((el) => (
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
                (
                  { img, user, email, title, status, borrowedDate, returnedDate },
                  index
                ) => {
                  const className = `py-3 px-5 ${
                    index === currentData.length - 1
                      ? ""
                      : "border-b border-blue-gray-100"
                  }`;

                  return (
                    <tr
                      key={`${user}-${(currentPage - 1) * rowsPerPage + index}`}
                      className="hover:bg-blue-gray-50 transition-colors"
                    >
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={img}
                            alt={user}
                            size="sm"
                            variant="rounded"
                          />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {user}
                            </Typography>
                            <Typography className="text-xs text-blue-gray-400">
                              {email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm text-blue-gray-700">
                          {title}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status ? "green" : "blue"}
                          value={status ? "Dipinjam" : "Dikembalikan"}
                          className="py-0.5 px-3 text-xs font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-sm">
                          {borrowedDate}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm">
                          {returnedDate}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Button
                          size="sm"
                          color="blue"
                          variant="gradient"
                          onClick={() =>
                            handleOpenModal(
                              {
                                img,
                                user,
                                email,
                                title,
                                status,
                                borrowedDate,
                                returnedDate,
                              },
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

        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-blue-gray-100">
          <div className="text-sm text-blue-gray-600 select-none">
            Total Data: {data.length}
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

      {/* Modal Detail */}
      <Dialog open={openModal} handler={handleCloseModal}>
        <Card className="p-6">
          <Typography variant="h5" className="mb-4 font-bold">
            Detail Peminjaman
          </Typography>
          {selectedBook && (
            <>
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  src={selectedBook.img}
                  alt={selectedBook.user}
                  size="lg"
                />
                <div>
                  <Typography className="font-bold text-blue-gray-800">
                    {selectedBook.user}
                  </Typography>
                  <Typography className="text-sm text-blue-gray-500">
                    {selectedBook.email}
                  </Typography>
                </div>
              </div>
              <div className="text-sm text-blue-gray-700 space-y-2 mb-6">
                <div>
                  <strong>Buku:</strong> {selectedBook.title}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <Chip
                    variant="gradient"
                    color={selectedBook.status ? "green" : "blue"}
                    value={selectedBook.status ? "Dipinjam" : "Dikembalikan"}
                    className="py-0.5 px-3 text-xs font-medium w-fit inline-block"
                  />
                </div>
                <div>
                  <strong>Tanggal Pinjam:</strong> {selectedBook.borrowedDate}
                </div>
                <div>
                  <strong>Tanggal Dikembalikan:</strong>{" "}
                  {selectedBook.returnedDate}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {selectedBook.status && (
                  <Button color="orange" onClick={handleReturn}>
                    Tandai Dikembalikan
                  </Button>
                )}
                <Button variant="gradient" color="red" onClick={handleCloseModal}>
                  Tutup
                </Button>
              </div>
            </>
          )}
        </Card>
      </Dialog>
    </div>
  );
}

export default LoanHistory;
