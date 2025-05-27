import React, { useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { BookOpenIcon, UserIcon } from "@heroicons/react/24/outline";

export function LoanRequest() {
  const [requests, setRequests] = useState([
    {
      id: "req1",
      user: "Aisyah Nur",
      bookTitle: "Filosofi Teras",
      date: "2025-05-16",
    },
    {
      id: "req2",
      user: "Ahmad Ridho",
      bookTitle: "Atomic Habits",
      date: "2025-05-15",
    },
    {
      id: "req3",
      user: "ALIL HD",
      bookTitle: "Belajar Cloud Computing",
      date: "2025-05-23",
    },
  ]);

  const handleTerima = (id) => {
    // Logika ketika permintaan diterima
    setRequests((prev) => prev.filter((r) => r.id !== id));
    console.log(`Request ${id} diterima`);
  };

  const handleTolak = (id) => {
    // Logika ketika permintaan ditolak
    setRequests((prev) => prev.filter((r) => r.id !== id));
    console.log(`Request ${id} ditolak`);
  };

  return (
    <div className="mx-auto my-10 max-w-screen-lg px-4">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Konfirmasi Peminjaman Buku
      </Typography>

      {requests.length === 0 ? (
        <Typography color="gray">
          Tidak ada permintaan peminjaman saat ini.
        </Typography>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardHeader
                floated={false}
                shadow={false}
                className="bg-blue-gray-50 px-6 py-4"
              >
                <Typography variant="h6" color="blue-gray">
                  Permintaan dari {req.user}
                </Typography>
              </CardHeader>
              <CardBody className="flex flex-col gap-2 px-6">
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  <Typography>{req.bookTitle}</Typography>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-green-500" />
                  <Typography>{req.user}</Typography>
                </div>
                <Typography className="text-sm text-gray-600">
                  Tanggal Permintaan: {req.date}
                </Typography>
              </CardBody>
              <CardFooter className="flex gap-2 px-6 pb-4">
                <Button color="green" onClick={() => handleTerima(req.id)}>
                  Terima
                </Button>
                <Button color="red" onClick={() => handleTolak(req.id)}>
                  Tolak
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
