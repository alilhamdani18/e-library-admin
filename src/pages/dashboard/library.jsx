import React, { useState, useEffect } from "react";
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
import { bookService } from "../../services/bookServices"; // Import service yang sudah dibuat

export function Library() {
  // State untuk data buku dari API
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    stock: "", // Tambah ISBN sesuai API
  });

  // Data buku yang sedang diedit / dihapus
  const [selectedBook, setSelectedBook] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Fetch data buku saat component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fungsi untuk mengambil data buku dari API
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
      console.log("Type of books:", typeof data, Array.isArray(data)); // apakah array?
      console.log("Books data:", data);
    } catch (err) {
      setError('Gagal memuat data buku');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate categories dari data buku yang ada
  const categories = ["Semua", ...new Set(books.map((book) => book.category).filter(Boolean))];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
    if (file) {
      setFormData({ ...formData, file });
    }
  };


  // Fungsi tambah buku - menggunakan API
  const handleAddBook = async () => {
    try {
      setLoading(true);

      const bookData = {
        title: formData.title,
        author: formData.author,
        stock: parseInt(formData.stock),
        description: formData.description,
        category: formData.category,
        year: parseInt(formData.year),
        pages: parseInt(formData.pages),
        file: formData.cover, // ⬅️ file dikirim di field 'file', bukan 'cover'
      };

      await bookService.createBook(bookData);

      // Reset form
      setFormData({
        title: "",
        author: "",
        year: "",
        category: "",
        description: "",
        cover: null, // harus sesuai field
        pages: "",
        stock: "",
      });

      setOpenAddModal(false);
      await fetchBooks(); // Refresh data
      alert("Buku berhasil ditambahkan!");
    } catch (error) {
      console.error('Error adding book:', error);
      alert("Gagal menambahkan buku. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };


  // Fungsi saat klik tombol Edit → buka modal edit dan isi form dengan data buku
  const handleEdit = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        year: book.publicationYear?.toString() || "",
        category: book.category || "",
        description: book.description || "",
        file: null,
        pages: book.pages?.toString() || "",
        stock: book.stock || "",
      });
      setSelectedBook(book);
      setOpenEditModal(true);
    }
  };

  // Fungsi simpan perubahan edit buku - menggunakan API
  const handleSaveEdit = async () => {
    if (!selectedBook) return;
    
    try {
      setLoading(true);
      
      // Siapkan data untuk update
      const bookData = {
        title: formData.title,
        author: formData.author,
        stock: formData.stock,
        description: formData.description,
        category: formData.category,
        publicationYear: parseInt(formData.year),
        pages: parseInt(formData.pages) || undefined,
      };

      await bookService.updateBook(selectedBook.id, bookData);
      
      // Reset form
      setFormData({
        title: "",
        author: "",
        year: "",
        category: "",
        description: "",
        file: null,
        pages: "",
        stock: "",
      });
      
      setOpenEditModal(false);
      setSelectedBook(null);
      await fetchBooks(); // Refresh data
      alert("Perubahan buku berhasil disimpan!");
      
    } catch (error) {
      console.error('Error updating book:', error);
      alert("Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi saat klik tombol Hapus → buka modal konfirmasi hapus
  const handleDelete = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setOpenDeleteModal(true);
    }
  };

  // Fungsi konfirmasi hapus buku - menggunakan API
  const confirmDelete = async () => {
    if (!selectedBook) return;
    
    try {
      setLoading(true);
      await bookService.deleteBook(selectedBook.id);
      
      setOpenDeleteModal(false);
      setSelectedBook(null);
      await fetchBooks(); // Refresh data
      alert("Buku berhasil dihapus!");
      
    } catch (error) {
      console.error('Error deleting book:', error);
      alert("Gagal menghapus buku. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchCategory = selectedCategory === "Semua" || book.category === selectedCategory;
    const matchSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  // Loading state
  if (loading && books.length === 0) {
    return (
      <Card className="mt-8 mb-6 border border-blue-gray-100 shadow-lg">
        <CardBody className="p-6 text-center">
          <Typography variant="h6" color="blue-gray">
            Memuat data buku...
          </Typography>
        </CardBody>
      </Card>
    );
  }

  // Error state
  // if (error) {
  //   return (
  //     <Card className="mt-8 mb-6 border border-red-100 shadow-lg">
  //       <CardBody className="p-6 text-center">
  //         <Typography variant="h6" color="red">
  //           {error}
  //         </Typography>
  //         <Button color="blue" onClick={fetchBooks} className="mt-4">
  //           Coba Lagi
  //         </Button>
  //       </CardBody>
  //     </Card>
  //   );
  // }

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
                Pustaka Buku Perpustakaan Himpelmanawaka ({books.length} buku)
              </Typography>
            </div>
            <Button
              color="green"
              onClick={() => setOpenAddModal(true)}
              className="flex items-center gap-2"
              disabled={loading}
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

          {currentBooks.length === 0 ? (
            <div className="text-center py-8">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Tidak ada buku ditemukan
              </Typography>
              <Typography variant="small" color="gray">
                {searchTerm || selectedCategory !== "Semua" 
                  ? "Coba ubah filter atau kata kunci pencarian"
                  : "Belum ada buku yang tersedia"}
              </Typography>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {currentBooks.map((book) => (
                <Card
                  key={book.id}
                  className="border border-gray-200 shadow-md overflow-hidden flex flex-row sm:flex-col h-full"
                >
                  {/* Card Header */}
                  <CardHeader
                    floated={false}
                    color="gray"
                    className="h-56 flex-shrink-0"
                  >
                    <img
                      src={book.coverUrl || "/img/default-book.jpg"}
                      alt={book.title}
                      className="w-36 h-full sm:w-full object-cover"
                    />
                  </CardHeader>

                  {/* Card Body + Footer */}
                  <div className="mt-2 flex flex-col justify-between flex-1">
                    <CardBody className="py-1 px-4 flex-1">
                      <Typography variant="h6" color="blue-gray" className="">
                        {book.title}
                      </Typography>
                      <Typography variant="small" className="text-green-500 mb-2">
                        {book.author} &middot; {book.publicationYear || book.year}
                      </Typography>
                      <Typography variant="" className="text-gray-600 text-sm mb-2 line-clamp-3">
                        {book.description}
                      </Typography>
                      <Typography variant="small" className="text-gray-600 font-bold">
                        Jumlah Halaman: {book.pages}
                      </Typography>
                      <Typography variant="small" className="text-gray-600 mb-2 font-bold">
                        Stok Tersedia: {book.availableStock || 0}
                      </Typography>
                      <Typography variant="small" className="text-yellow-800 font-semibold mb-1">
                        Rating: {book.rating || "0"} / 5
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-red-400 font-medium flex items-center gap-1"
                      >
                        <HeartIcon className="h-4 w-4" /> {book.likes || 0} suka
                      </Typography>
                    </CardBody>

                    <CardFooter className="flex gap-2 px-4 pb-4">
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => handleEdit(book.id)}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(book.id)}
                        disabled={loading}
                      >
                        Hapus
                      </Button>
                    </CardFooter>
                  </div>
                </Card>

              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <Button
                size="sm"
                variant="outlined"
                color="green"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Prev
              </Button>

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
      <Dialog open={openAddModal} handler={() => setOpenAddModal(!openAddModal)} size="md">
        <DialogHeader className="justify-center">Tambah Buku Baru</DialogHeader>
        <DialogBody divider className="max-h-[80vh] overflow-y-auto">
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
              <Input 
                label="Judul *" 
                name="title" 
                value={formData.title}
                onChange={handleInputChange} 
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Penulis *" 
                  name="author" 
                  value={formData.author}
                  onChange={handleInputChange} 
                  required
                />
                <Input 
                  label="Tahun Terbit" 
                  name="year" 
                  value={formData.year}
                  onChange={handleInputChange} 
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Kategori" 
                  name="category" 
                  value={formData.category}
                  onChange={handleInputChange} 
                />
                <Input 
                  label="Jumlah Halaman" 
                  name="pages" 
                  value={formData.pages}
                  onChange={handleInputChange} 
                  type="number"
                />
              </div>
              <Input 
                label="Stock" 
                name="stock" 
                value={formData.stock}
                onChange={handleInputChange} 
              />
              <Textarea 
                label="Deskripsi" 
                name="description" 
                value={formData.description}
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="gray" 
            onClick={() => setOpenAddModal(false)} 
            className="mr-1"
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            color="green" 
            onClick={handleAddBook}
            disabled={loading || !formData.title || !formData.author}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Edit Buku */}
      <Dialog open={openEditModal} handler={() => setOpenEditModal(!openEditModal)} size="md">
        <DialogHeader className="justify-center">Edit Buku</DialogHeader>
        <DialogBody divider className="max-h-[80vh] overflow-y-auto">
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
                accept="image/*"
                className="hidden"
                value={formData.file}
                onChange={handleFileChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
              <Input 
                label="Judul" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Penulis *" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleInputChange} 
                  required
                />
                <Input 
                  label="Tahun Terbit" 
                  name="year" 
                  value={formData.year} 
                  onChange={handleInputChange} 
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Kategori" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                />
                <Input 
                  label="Jumlah Halaman" 
                  name="pages" 
                  value={formData.pages} 
                  onChange={handleInputChange} 
                  type="number"
                />
              </div>
              <Input 
                label="ISBN" 
                name="isbn" 
                value={formData.isbn} 
                onChange={handleInputChange} 
              />
              <Textarea 
                label="Deskripsi" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="gray" 
            onClick={() => setOpenEditModal(false)} 
            className="mr-1"
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            color="blue" 
            onClick={handleSaveEdit}
            disabled={loading || !formData.title || !formData.author}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Hapus Buku */}
      <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(!openDeleteModal)} size="sm">
        <DialogHeader>Konfirmasi Hapus</DialogHeader>
        <DialogBody divider>
          <Typography>
            Apakah Anda yakin ingin menghapus buku{" "}
            <strong>{selectedBook?.title}</strong>?
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="text" 
            color="gray" 
            onClick={() => setOpenDeleteModal(false)} 
            className="mr-1"
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            color="red" 
            onClick={confirmDelete}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Library;