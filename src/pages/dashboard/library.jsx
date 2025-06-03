import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Textarea,
  Typography,
  Input,
  Select,
  Option,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, HeartIcon, DocumentArrowUpIcon } from "@heroicons/react/24/solid";
import { projectsData } from "@/data";

export function Library() {
  const categories = ["Semua", ...new Set(projectsData.map((book) => book.category))];
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);

  // State untuk edit dan hapus modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Data form tambah & edit
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    category: "",
    description: "",
    file: null,
    pages: "",
  });

  // Data buku yang sedang diedit / dihapus
  const [selectedBookTitle, setSelectedBookTitle] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleAddBook = () => {
    alert("Buku berhasil ditambahkan (simulasi)");
    setOpenAddModal(false);
    setFormData({
      title: "",
      author: "",
      year: "",
      category: "",
      description: "",
      file: null,
      pages: "",
    });
  };

  // Fungsi saat klik tombol Edit → buka modal edit dan isi form dengan data buku
  const handleEdit = (title) => {
    const book = projectsData.find((b) => b.title === title);
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        year: book.year,
        category: book.category,
        description: book.description,
        file: null,
        pages: book.pages || "",
      });
      setSelectedBookTitle(title);
      setOpenEditModal(true);
    }
  };

  // Fungsi simpan perubahan edit buku (simulasi)
  const handleSaveEdit = () => {
    alert(`Perubahan buku "${formData.title}" berhasil disimpan (simulasi)`);
    setOpenEditModal(false);
    setFormData({
      title: "",
      author: "",
      year: "",
      category: "",
      description: "",
      file: null,
      pages: "",
    });
    setSelectedBookTitle(null);
  };

  // Fungsi saat klik tombol Hapus → buka modal konfirmasi hapus
  const handleDelete = (title) => {
    setSelectedBookTitle(title);
    setOpenDeleteModal(true);
  };

  // Fungsi konfirmasi hapus buku (simulasi)
  const confirmDelete = () => {
    alert(`Buku "${selectedBookTitle}" berhasil dihapus (simulasi)`);
    setOpenDeleteModal(false);
    setSelectedBookTitle(null);
  };

  const filteredBooks = projectsData.filter((book) => {
    const matchCategory = selectedCategory === "Semua" || book.category === selectedCategory;
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Card className="mt-8 mb-6 border border-blue-gray-100 shadow-lg">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Typography variant="h4" color="blue-gray" className="mb-2">
                Pustaka
              </Typography>
              <Typography variant="small" className="font-normal text-blue-gray-500">
                Pustaka Buku Perpustakaan Himpelmanawaka
              </Typography>
            </div>
            <Button
              color="green"
              onClick={() => setOpenAddModal(true)}
              className="flex items-center gap-2"
            >
              <DocumentArrowUpIcon className="h-4 w-4" /> Tambah Buku
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-8">
            <div className="w-full md:w-1/2">
              <Input
                label="Cari buku..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                color="green"
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select
                label="Filter berdasarkan kategori"
                value={selectedCategory}
                onChange={(val) => setSelectedCategory(val)}
                color="green"
              >
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {currentBooks.map(
              ({ title, img, author, year, description,pages, rating, likes }) => (
                <Card
                  key={title}
                  className="border border-gray-200 shadow-md rounded-lg overflow-hidden flex flex-col justify-between"
                >
                  <CardHeader floated={false} color="gray" className="h-48">
                    <img src={img} alt={title} className="h-full w-full object-cover" />
                  </CardHeader>

                  <CardBody className="py-1 px-4 flex-1">
                    <Typography variant="h6" color="blue-gray" className="mb-1">
                      {title}
                    </Typography>
                    <Typography variant="small" className="text-indigo-500 mb-1">
                      {author} &middot; {year}
                    </Typography>
                    <Typography variant="small" className="text-gray-600 mb-2 line-clamp-3">
                     {description}
                    </Typography>
                    <Typography variant="small" className="text-gray-600 mb-2 line-clamp-3">
                       Jumlah Halaman : {pages}
                    </Typography>
                    <Typography variant="small" className="text-yellow-800 font-semibold mb-1">
                      Rating: {rating} / 5
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-red-400 font-medium flex items-center gap-1"
                    >
                      <HeartIcon className="h-4 w-4" /> {likes} suka
                    </Typography>
                  </CardBody>

                  <CardFooter className="flex gap-2 px-4 pb-4">
                    <Button size="md" color="blue" onClick={() => handleEdit(title)}>
                      Edit
                    </Button>
                    <Button size="md" color="red" onClick={() => handleDelete(title)}>
                      Hapus
                    </Button>
                  </CardFooter>
                </Card>
              )
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {/* Tombol Previous */}
              <Button
                size="sm"
                variant="outlined"
                color="green"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Prev
              </Button>

              {/* Nomor Halaman */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "filled" : "outlined"}
                  color="green"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[36px]"
                >
                  {page}
                </Button>
              ))}

              {/* Tombol Next */}
              <Button
                size="sm"
                variant="outlined"
                color="green"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}

        </CardBody>
      </Card>

      {/* Modal Tambah Buku */}
      <Dialog open={openAddModal} handler={() => setOpenAddModal(!openAddModal)} size="xl">
        <DialogHeader className="justify-center">Tambah Buku Baru</DialogHeader>
        <DialogBody divider>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upload Cover */}
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl p-6 text-center cursor-pointer h-full"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <img src="/img/upload-icon.png" alt="Upload Icon" className="w-12 h-12 mb-2 opacity-80" />
              <p className="text-blue-600 font-medium">
                {formData.file ? formData.file.name : "Drag & Drop atau Klik untuk Upload Cover"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Supports: JPG, JPEG, PNG</p>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Form Input */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
              <Input label="Judul" name="title" onChange={handleInputChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Penulis" name="author" onChange={handleInputChange} />
                <Input label="Tahun Terbit" name="year" onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Kategori" name="category" onChange={handleInputChange} />
                <Input label="Jumlah Halaman" name="pages" onChange={handleInputChange} />
              </div>
              <Textarea label="Deskripsi" name="description" onChange={handleInputChange} />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenAddModal(false)} className="mr-1">
            Batal
          </Button>
          <Button color="green" onClick={handleAddBook}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Edit Buku */}
      <Dialog open={openEditModal} handler={() => setOpenEditModal(!openEditModal)} size="xl">
        <DialogHeader className="justify-center">Edit Buku</DialogHeader>
        <DialogBody divider>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl p-6 text-center cursor-pointer h-full"
              onClick={() => document.getElementById("file-upload-edit").click()}
            >
              <img src="/img/upload-icon.png" alt="Upload Icon" className="w-12 h-12 mb-2 opacity-80" />
              <p className="text-blue-600 font-medium">
                {formData.file ? formData.file.name : "Drag & Drop atau Klik untuk Upload Cover"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Supports: JPG, JPEG, PNG</p>
              <input
                id="file-upload-edit"
                type="file"
                // value={formData.img}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
              <Input label="Judul" name="title" value={formData.title} onChange={handleInputChange} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Penulis" name="author" value={formData.author} onChange={handleInputChange} />
                <Input label="Tahun Terbit" name="year" value={formData.year} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Kategori" name="category" value={formData.category} onChange={handleInputChange} />
                <Input label="Jumlah Halaman" name="pages" value={formData.pages} onChange={handleInputChange} />
              </div>
              <Textarea label="Deskripsi" name="description" value={formData.description} onChange={handleInputChange} />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenEditModal(false)} className="mr-1">
            Batal
          </Button>
          <Button color="blue" onClick={handleSaveEdit}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Hapus Buku */}
      <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(!openDeleteModal)} size="sm">
        <DialogHeader>Konfirmasi Hapus</DialogHeader>
        <DialogBody divider>
          <Typography>
            Apakah Anda yakin ingin menghapus buku{" "}
            <strong>{selectedBookTitle}</strong>?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenDeleteModal(false)} className="mr-1">
            Batal
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Hapus
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Library;
