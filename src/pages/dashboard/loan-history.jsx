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
import { loanServices } from "@/services/loanServices";
import getDateString from "@/utils/getDate";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";
import Alert from "../../components/Alert";




export function LoanHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loanHistory, setLoanHistory] = useState([]);
  const [rawLoanHistory, setRawLoanHistory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(loanHistory.length / rowsPerPage);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openModal, setOpenModal] = useState(false);


  const transformLoanData = (data) => {
    return data.map((loan) => {
      const approvedSeconds = loan.approvedDate?._seconds;
      const returnSeconds = loan.returnDate?._seconds;

      let finalReturnDate;
      let calculatedDueDate; 
      let calculatedReturnDate; 
      let loanReturnStatus = ""; 

      if (returnSeconds) {
        finalReturnDate = new Date(returnSeconds * 1000);
        calculatedReturnDate = finalReturnDate;
      } else if (approvedSeconds && loan.loanDuration) {
        finalReturnDate = new Date(approvedSeconds * 1000);
        finalReturnDate.setDate(finalReturnDate.getDate() + loan.loanDuration);
      }

      if (loan.dueDate?._seconds) {
          calculatedDueDate = new Date(loan.dueDate._seconds * 1000);
      } else if (typeof loan.dueDate === 'string' && loan.dueDate !== '-') {
          calculatedDueDate = new Date(loan.dueDate); 
      }

      if (calculatedReturnDate) calculatedReturnDate.setHours(0, 0, 0, 0);
      if (calculatedDueDate) calculatedDueDate.setHours(0, 0, 0, 0);


      // Logika untuk menentukan status Telat/Tepat Waktu
      if (loan.status === "returned" && calculatedReturnDate && calculatedDueDate) {
        if (calculatedReturnDate > calculatedDueDate) {
          loanReturnStatus = "Telat";
        } else {
          loanReturnStatus = "Tepat Waktu";
        }
      }

      if (returnSeconds) {
        finalReturnDate = new Date(returnSeconds * 1000);
      } else if (approvedSeconds && loan.loanDuration) {
        finalReturnDate = new Date(approvedSeconds * 1000);
        finalReturnDate.setDate(finalReturnDate.getDate() + loan.loanDuration);
      }

      return {
        id: loan.id,
        cover: loan.book?.coverUrl || "/img/default-cover.jpeg",
        img: loan.user?.profileImageUrl || "/img/default-avatar.jpeg",
        author: loan.book?.author || "Unknown Author",
        user: loan.user?.name || "Unknown User",
        email: loan.user?.email || "No Email",
        title: loan.book?.title || "Unknown Book",
        status: loan.status,
        loanDuration: loan.loanDuration,
        approvedDate: getDateString(loan.approvedDate),
        dueDate: getDateString(loan.dueDate),
        returnDate: finalReturnDate
          ? getDateString({ _seconds: finalReturnDate.getTime() / 1000 })
          : "-",
        loanReturnStatus: loanReturnStatus, 
      };
     
    });
  };


  useEffect(() => {
    fetchLoanHistory();
  }, []);

  const fetchLoanHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loanServices.getAllLoans();
      setRawLoanHistory(data); 
      console.log("Raw Loan Data:", data);
      
      
      setLoanHistory(transformLoanData(data));

     
    } catch (err) {
      setError("Gagal memuat data Loans");
      console.error("Error fetching loans:", err);
      
      // Fallback ke dummy data untuk testing
      console.log("Using dummy data as fallback", rawLoanHistory);
      setLoanHistory();
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loan) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User belum login");

      const uid = user.uid;
      console.log("UID:", uid);

      const returnDate = new Date();

      console.log("Approved Date:", loan.approvedDate);
      console.log("Return Date (sekarang):", returnDate);

      const loanRef = doc(db, "loans", loan.id);
      await updateDoc(loanRef, {
        returnDate: returnDate,
        returnedBy: uid,
      });
      

      // Kirim ke backend untuk memproses pengembalian
      await loanServices.returnLoan(loan.id, uid);
      handleCloseModal();
      
      fetchLoanHistory();
      return true;

    } catch (error) {
      console.error("Gagal mengembalikan buku:", error);
    }
  };

  

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const currentData = loanHistory.slice(
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

  const confirmReturn = async (id) => {
    const result = await Alert.confirm(
    'Konfirmasi Pengembalian',
    'Apakah Anda yakin ingin menerima pengembalian buku ini?',
    'Terima',
    'Batal'
  );

  if (result.isConfirmed) {
    const success = await handleReturn(id);
    if (success) {
      await Alert.success('Pengembalian Diterima!', 'Pengembalian berhasil diproses.');
    } else {
      await Alert.error('Gagal!', 'Terjadi kesalahan saat memproses Pengembalian.');
    }
  }
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
          {loading ? (
            <div className="p-6 text-center text-blue-gray-500">
              Memuat data pinjaman...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : loanHistory.length === 0 ? (
            <div className="p-6 text-center text-blue-gray-500">
              Tidak ada data peminjaman
            </div>
          ) : (
            <table className="w-full min-w-[700px] table-auto text-left">
              <thead>
                <tr>
                  {[
                    "Judul Buku",
                    "Pengguna",
                    "Status",
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
                {currentData.map((loan, index) => {
                  // ✅ Destructuring dengan safety check
                  const {
                    id,
                    cover = "/img/default-avatar.jpeg",
                    author = "Unknown Author",
                    user = "Unknown User",
                    email = "No Email",
                    title = "Unknown Book",
                    status,
                    // approvedDate = "-",
                    // returnDate = "-",
                  } = loan || {};

                  const className = `py-3 px-5 ${
                    index === currentData.length - 1
                      ? ""
                      : "border-b border-blue-gray-100"
                  }`;

                  return (
                    <tr
                      key={id || `loan-${(currentPage - 1) * rowsPerPage + index}`}
                      className="hover:bg-blue-gray-50 transition-colors"
                    >
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={cover}
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
                              {title}
                            </Typography>
                            <Typography className="text-xs text-blue-gray-400">
                              {author}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
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
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status == "approved" ? "green" : "orange"}
                          value={status == "approved" ? "Dipinjam" : "Dikembalikan"}
                          className="py-0.5 px-3 text-xs font-medium w-fit"
                        />
                      </td>
                      {/* <td className={className}>
                        <Typography className="text-sm">
                          {approvedDate}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm">
                          {returnDate}
                        </Typography>
                      </td> */}
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
                })}
              </tbody>
            </table>
          )}
        </CardBody>

        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-blue-gray-100">
          <div className="text-sm text-blue-gray-600 select-none">
            Total Data: {loanHistory.length}
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
              {currentPage} / {totalPages || 1}
            </Typography>
            <Button
              size="sm"
              variant="outlined"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal Detail */}
      <Dialog open={openModal} handler={handleCloseModal} size="xs">
        <Card className="p-6">
          <Typography variant="h5" className="mb-4 font-bold">
            Detail Peminjaman
          </Typography>
          {selectedBook && (
            <>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedBook.cover}
                  alt={selectedBook.title}
                  className="h-24 rounded-md shadow-lg shadow-blue-gray-500/25"
                />

                <div>
                  <Typography className="font-bold text-blue-gray-800">
                    {selectedBook.title}
                  </Typography>
                  <Typography className="text-sm text-blue-gray-500">
                    {selectedBook.author}
                  </Typography>
                </div>
              </div>
              <div className="text-sm text-blue-gray-700 space-y-2 mb-6">
                <div>
                  <strong>Status :</strong>{" "}
                  <Chip
                    variant="gradient"
                    color={selectedBook.status == "approved" ? "green" : "orange"}
                    value={selectedBook.status == "approved" ? "Dipinjam" : "Dikembalikan"}
                    className="py-0.5 px-3 text-xs font-medium w-fit inline-block"
                  />
                </div>
                {/* Menampilkan status Telat/Tepat Waktu jika buku sudah dikembalikan */}
                {selectedBook.status === "returned" && selectedBook.loanReturnStatus && (
                  <div>
                    <strong>Status Pengembalian :</strong>{" "}
                    <Chip
                      variant="gradient"
                      color={selectedBook.loanReturnStatus === "Telat" ? "red" : "blue"}
                      value={selectedBook.loanReturnStatus}
                      className="py-0.5 px-3 text-xs font-medium w-fit inline-block"
                    />
                  </div>
                )}
                <div>
                  <strong>Durasi Pinjaman : </strong>{" "}
                  {selectedBook.loanDuration} hari
                </div>
                <div>
                  <strong>Tanggal Pinjam : </strong>
                  {selectedBook.approvedDate}
                </div>
                <div>
                  <strong>Jatuh Tempo : </strong>
                  {selectedBook.dueDate}
                </div>
                <div>
                  <strong>
                    {selectedBook.status === "returned"
                      ? "Tanggal Dikembalikan : "
                      : "Prediksi Tanggal Kembali : "}
                  </strong>{" "}
                  {selectedBook.status === "returned"
                    ? selectedBook.returnDate
                    : selectedBook.dueDate}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 mb-4">
                <Avatar
                  src={selectedBook.img}
                  alt={selectedBook.user}
                  size="sm"
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
              <div className="flex justify-end gap-2">
                {selectedBook.status == "approved" && (
                  <Button color="orange" onClick={() => {
                    document.activeElement?.blur();
                    handleCloseModal();
                    setTimeout(() => confirmReturn(selectedBook), 300);
                  }}
                  >
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