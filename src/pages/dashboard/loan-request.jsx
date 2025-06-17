import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { BookOpenIcon, UserIcon } from "@heroicons/react/24/outline";
import { loanServices } from "@/services/loanServices"; // pastikan path-nya benar
import getDateString from "@/utils/getDate";
import { getAuth } from "firebase/auth";
import Alert from "../../components/Alert";



export function LoanRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoadingId, setButtonLoadingId] = useState(null);


  const fetchRequests = async () => {
    try {
      
      const data = await loanServices.getAllRequest();
      setRequests(data);
      // console.log("Requests data:", data);
    } catch (error) {
      console.error("Gagal memuat data permintaan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleTerima = async (id) => {
    setButtonLoadingId(id);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User belum login");

      const uid = user.uid; 
      console.log(uid);
      
      await loanServices.approveLoan(id, uid);
      setRequests((prev) => {
        prev.filter((r) => r.id !== id);
      });
      
      console.log(`Request ${id} diterima`);
      return true;
    } catch (error) {
      console.error("Gagal menerima permintaan:", error);
    } finally {
      setButtonLoadingId(null);
    }
  };

  const handleTolak = async (id, reason) => {
    setButtonLoadingId(id);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User belum login");

      const uid = user.uid;
      await loanServices.rejectLoan(id, uid, reason); // pastikan service mendukung alasan
      setRequests((prev) => prev.filter((r) => r.id !== id));
      return true; // success
    } catch (error) {
      console.error("Gagal menolak permintaan:", error);
      return false; // failed
    } finally {
      setButtonLoadingId(null);
    }
  };


  const confirmTerima = async (id) => {
    const result = await Alert.confirm(
      'Terima Permintaan',
      'Apakah Anda yakin ingin menerima permintaan ini?',
      'Terima',
      'Batal'
    )
    if(result.isConfirmed) {
      const success = await handleTerima(id);
      if(success) {
        Alert.success('Permintaan Diterima!', 'Permintaan berhasil diproses.');
      } else {
        Alert.error('Gagal!', 'Terjadi kesalahan saat memproses permintaan.');
      }
    }
  };
  const confirmReject = async (id) => {
    const result = await Alert.confirmWithTextarea(
      'Tolak Permintaan',
      'Apakah Anda yakin ingin menolak permintaan ini?',
      'Tolak',
      'Batal'
    )
    if(result.isConfirmed) {
      const success = await handleTolak(id);
      if(success) {
        Alert.success('Permintaan Ditolak!', 'Permintaan berhasil diproses.');
      } else {
        Alert.error('Gagal!', 'Terjadi kesalahan saat memproses permintaan.');
      }
    }
  };



  return (
    <div className="mx-auto my-10 max-w-screen-lg px-4">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Konfirmasi Peminjaman Buku
      </Typography>
      {loading ? (
        <Typography color="gray">Memuat data...</Typography>
      ) : requests?.length === 0 ? (
        <Typography color="gray">
          Tidak ada permintaan peminjaman saat ini.
        </Typography>
      ) : (
        <div className="flex flex-col gap-4">
          {requests?.map((req) => (
            <Card key={req.id}>
              <CardHeader
                floated={false}
                shadow={false}
                className="bg-blue-gray-50 px-6 py-4"
              >
                <Typography variant="h6" color="blue-gray">
                  Permintaan dari {req.user?.name || "Pengguna"}
                </Typography>
              </CardHeader>
              <CardBody className="flex flex-col gap-2 px-6">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  <Typography>
                    {req.book?.title || "Judul tidak tersedia"}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-green-500" />
                  <Typography>
                    {req.user?.name || "Nama tidak tersedia"}
                  </Typography>
                </div>
                <Typography className="text-sm text-gray-600">
                  Tanggal Permintaan: {getDateString(req.requestDate)}
                </Typography>
              </CardBody>
              <CardFooter className="flex gap-2 px-6 pb-4">
                <Button
                  color="green"
                  onClick={() => confirmTerima(req.id)}
                  disabled={buttonLoadingId === req.id}
                >
                  {buttonLoadingId === req.id ? "Memproses..." : "Terima"}
                </Button>
                <Button
                  color="red"
                  onClick={() => confirmReject(req.id)}
                  disabled={buttonLoadingId === req.id}
                >
                  {buttonLoadingId === req.id ? "Memproses..." : "Tolak"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}

export default LoanRequest;
