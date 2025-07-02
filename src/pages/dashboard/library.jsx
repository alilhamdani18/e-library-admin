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
  IconButton,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  CloudArrowDownIcon,
} from "@heroicons/react/24/solid";
import { bookService } from "../../services/bookServices";
import Alert from "../../components/Alert";

export function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    category: "",
    otherCategory: "",
    description: "",
    cover: null,
    bookFile: null,
    pages: "",
    stock: "",
  });

  const [selectedBook, setSelectedBook] = useState(null);

  const currentPage = 1;
  const itemsPerPage = 12;

  const predefinedCategories = ["Novel", "Islamic", "Pendidikan", "Kitab", "Motivation", "Others"];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError("Gagal memuat data buku");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Semua", ...new Set(books.map((book) => book.category).filter(Boolean)), ...predefinedCategories];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (name === "category" && value !== "Others") {
      setFormData((prev) => ({ ...prev, otherCategory: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  const handleAddBook = async () => {
    try {
      setLoading(true);

      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("author", formData.author);
      dataToSend.append("year", formData.year);
      dataToSend.append("description", formData.description);
      dataToSend.append("pages", formData.pages);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("category", formData.category === "Others" ? formData.otherCategory : formData.category);

      if (formData.cover) {
        dataToSend.append("cover", formData.cover);
      }
      if (formData.bookFile) {
        dataToSend.append("bookFile", formData.bookFile);
      }

      await bookService.createBook(dataToSend);

      setFormData({
        title: "",
        author: "",
        year: "",
        category: "",
        otherCategory: "",
        description: "",
        cover: null,
        bookFile: null,
        pages: "",
        stock: "",
      });

      setOpenAddModal(false);
      await fetchBooks();
      Alert.success("Buku berhasil ditambahkan", "");
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.error("Gagal menambahkan buku. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      const isOtherCategory = predefinedCategories.includes(book.category) ? book.category : "Others";
      setFormData({
        title: book.title || "",
        author: book.author || "",
        year: book.year?.toString() || "",
        category: isOtherCategory,
        otherCategory: isOtherCategory === "Others" ? book.category : "",
        description: book.description || "",
        cover: null, 
        bookFile: null,
        pages: book.pages?.toString() || "",
        stock: book.stock?.toString() || "",
      });
      setSelectedBook(book);
      setOpenEditModal(true); 
    } else {
      console.warn(`Book with ID ${bookId} not found for editing.`);
    }
  };


  const handleSaveEdit = async () => {
    if (!selectedBook) return;

    try {
      setLoading(true);

      const dataToSend = new FormData();
      if (formData.title !== selectedBook.title) dataToSend.append("title", formData.title);
      if (formData.author !== selectedBook.author) dataToSend.append("author", formData.author);
      // Gunakan Number() untuk memastikan perbandingan yang benar jika asalnya string
      if (Number(formData.year) !== selectedBook.year) dataToSend.append("year", formData.year);
      if (formData.description !== selectedBook.description) dataToSend.append("description", formData.description);
      if (Number(formData.pages) !== selectedBook.pages) dataToSend.append("pages", formData.pages);
      if (Number(formData.stock) !== selectedBook.stock) dataToSend.append("stock", formData.stock);

      const newCategory = formData.category === "Others" ? formData.otherCategory : formData.category;
      if (newCategory !== selectedBook.category) {
        dataToSend.append("category", newCategory);
      }

      if (formData.cover) {
        dataToSend.append("cover", formData.cover);
      }
      if (formData.bookFile) {
        dataToSend.append("bookFile", formData.bookFile);
      }
      
      await bookService.updateBook(selectedBook.id, dataToSend);

      setFormData({
        title: "",
        author: "",
        year: "",
        category: "",
        otherCategory: "",
        description: "",
        cover: null,
        bookFile: null,
        pages: "",
        stock: "",
      });

      setOpenEditModal(false);
      setSelectedBook(null); 
      await fetchBooks();
      Alert.success("Perubahan berhasil disimpan", "");
    } catch (error) {
      console.error("Error updating book:", error);
      Alert.error("Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setOpenDeleteModal(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBook) return;

    try {
      setLoading(true);
      await bookService.deleteBook(selectedBook.id);

      setOpenDeleteModal(false);
      setSelectedBook(null);
      await fetchBooks();
      Alert.success("Buku berhasil dihapus", "");
    } catch (error) {
      console.error("Error deleting book:", error);
      Alert.error("Gagal menghapus buku. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setOpenDetailModal(true);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchCategory = selectedCategory === "Semua" || book.category === selectedCategory;
    const matchSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

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
              onClick={() => {
                setOpenAddModal(true);
                setFormData({
                  title: "",
                  author: "",
                  year: "",
                  category: "",
                  otherCategory: "",
                  description: "",
                  cover: null,
                  bookFile: null,
                  pages: "",
                  stock: "",
                });
              }}
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
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {currentBooks.map((book) => (
                <Card
                  key={book.id}
                  className="border border-gray-200 shadow-md overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleViewDetails(book.id)}
                >
                  <CardHeader floated={false} color="gray" className="h-56 flex-shrink-0 relative">
                    <img
                      src={book.coverUrl || "/img/default-book.jpeg"}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </CardHeader>

                  <CardBody className="py-2 px-4 flex-1">
                    <Typography variant="h6" color="green" className="truncate">
                      {book.title}
                    </Typography>
                    <Typography variant="small" className="blue-grey italic truncate">
                      {book.author}
                    </Typography>
                    <Typography variant="small" className="text-blue-600 font-bold mt-1">
                      Stok: {book.stock || 0}
                    </Typography>
                  </CardBody>

                  <CardFooter className="flex justify-start gap-2 px-4 pb-4 pt-4">
                    <Button
                      size="sm"
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(book.id);
                      }}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(book.id);
                      }}
                      disabled={loading}
                    >
                      Hapus
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

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
      <Dialog open={openAddModal} handler={() => setOpenAddModal(!openAddModal)} size="lg">
        <DialogHeader className="justify-center">Tambah Buku Baru</DialogHeader>
        <DialogBody divider className="max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center p-2 border border-blue-gray-100 rounded-lg shadow-sm">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Upload Cover Buku
                </Typography>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl p-4 text-center cursor-pointer w-full h-36"
                  onClick={() => document.getElementById("cover-upload-add").click()}
                >
                  <img src="/img/upload-icon.png" alt="Upload Icon" className="w-10 h-10 mb-1 opacity-80" />
                  <p className="text-blue-600 font-medium text-xs">
                    {formData.cover ? formData.cover.name : "Klik untuk Upload Cover"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Supports: JPG, JPEG, PNG (Max 5MB)</p>
                  <input
                    id="cover-upload-add"
                    type="file"
                    name="cover"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center p-2 border border-blue-gray-100 rounded-lg shadow-sm">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Upload File Buku (PDF/EPUB)
                </Typography>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 bg-green-50 hover:bg-green-100 transition-colors rounded-xl p-4 text-center cursor-pointer w-full h-36"
                  onClick={() => document.getElementById("book-file-upload-add").click()}
                >
                  <img src="/img/pdf-icon.png" alt="PDF Icon" className="w-10 h-10 mb-1 opacity-80" />
                  <p className="text-green-600 font-medium text-xs">
                    {formData.bookFile ? formData.bookFile.name : "Klik untuk Upload File Buku"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Supports: PDF, EPUB (Max 10MB)</p>
                  <input
                    id="book-file-upload-add"
                    type="file"
                    name="bookFile"
                    accept=".pdf,.epub"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Judul"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Penulis"
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
              <Select
                label="Kategori"
                name="category"
                value={formData.category}
                onChange={(val) => handleSelectChange("category", val)}
                required
              >
                {predefinedCategories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
              {formData.category === "Others" && (
                <Input
                  label="Kategori Lainnya"
                  name="otherCategory"
                  value={formData.otherCategory}
                  onChange={handleInputChange}
                  required={formData.category === "Others"}
                />
              )}
              <Input
                label="Jumlah Halaman"
                name="pages"
                value={formData.pages}
                onChange={handleInputChange}
                type="number"
              />
              <Input
                label="Stock"
                name="stock"
                type="number"
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
            disabled={loading || !formData.title || !formData.author || !formData.category || (formData.category === "Others" && !formData.otherCategory)}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openEditModal} handler={() => setOpenEditModal(!openEditModal)} size="lg">
        <DialogHeader className="justify-center">Edit Buku</DialogHeader>
        <DialogBody divider className="max-h-[80vh] overflow-y-auto">
          {selectedBook && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center p-2 border border-blue-gray-100 rounded-lg shadow-sm">
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Edit Cover Buku
                  </Typography>
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl p-4 text-center cursor-pointer w-full h-36 relative"
                    onClick={() => document.getElementById("cover-upload-edit").click()}
                  >
                    {selectedBook.coverUrl && !formData.cover ? (
                      <img
                        src={selectedBook.coverUrl}
                        alt="Current Cover"
                        className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-70"
                      />
                    ) : (
                      <img src="/img/upload-icon.png" alt="Upload Icon" className="w-10 h-10 mb-1 opacity-80" />
                    )}
                    <div className="relative z-10 text-center">
                      <p className="text-blue-600 font-medium text-xs">
                        {formData.cover ? formData.cover.name : "Klik untuk Upload Cover Baru"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Supports: JPG, JPEG, PNG (Max 5MB)</p>
                    </div>
                    <input
                      id="cover-upload-edit"
                      type="file"
                      name="cover"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center p-2 border border-blue-gray-100 rounded-lg shadow-sm">
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    Edit File Buku (PDF/EPUB)
                  </Typography>
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 bg-green-50 hover:bg-green-100 transition-colors rounded-xl p-4 text-center cursor-pointer w-full h-36 relative"
                    onClick={() => document.getElementById("book-file-upload-edit").click()}
                  >
                    {selectedBook.bookFileUrl && !formData.bookFile ? (
                      <CloudArrowDownIcon className="w-10 h-10 mb-1 text-green-700 opacity-80" />
                    ) : (
                      <img src="/img/pdf-icon.png" alt="PDF Icon" className="w-10 h-10 mb-1 opacity-80" />
                    )}
                    <div className="relative z-10 text-center">
                      <p className="text-green-600 font-medium text-xs">
                        {formData.bookFile ? formData.bookFile.name : selectedBook.bookFileUrl ? `File saat ini: ${selectedBook.bookFileUrl.split('/').pop()}` : "Klik untuk Upload File Buku Baru"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Supports: PDF, EPUB (Max 10MB)</p>
                    </div>
                    <input
                      id="book-file-upload-edit"
                      type="file"
                      name="bookFile"
                      accept=".pdf,.epub"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  label="Judul"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Penulis"
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
                <Select
                  label="Kategori"
                  name="category"
                  value={formData.category}
                  onChange={(val) => handleSelectChange("category", val)}
                  required
                >
                  {predefinedCategories.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
                {formData.category === "Others" && (
                  <Input
                    label="Kategori Lainnya"
                    name="otherCategory"
                    value={formData.otherCategory}
                    onChange={handleInputChange}
                    required={formData.category === "Others"}
                  />
                )}
                <Input
                  label="Jumlah Halaman"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  type="number"
                />
                <Input
                  label="Stock"
                  name="stock"
                  type="number"
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
          )}
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
            disabled={loading || !formData.title || !formData.author || !formData.category || (formData.category === "Others" && !formData.otherCategory)}
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
          <Button color="red" onClick={confirmDelete} disabled={loading}>
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Detail Buku */}
      <Dialog open={openDetailModal} handler={() => setOpenDetailModal(!openDetailModal)} size="md">
        <DialogHeader className="justify-center">Detail Buku</DialogHeader>
        <DialogBody divider className="max-h-[80vh] overflow-y-auto">
          {selectedBook && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <img
                  src={selectedBook.coverUrl || "/img/default-book.jpeg"}
                  alt={selectedBook.title}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-2/3">
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {selectedBook.title}
                </Typography>
                <Typography variant="paragraph" color="gray" className="mb-1">
                  Penulis: {selectedBook.author}
                </Typography>
                <Typography variant="paragraph" color="gray" className="mb-1">
                  Tahun Terbit: {selectedBook.year}
                </Typography>
                <Typography variant="paragraph" color="gray" className="mb-1">
                  Kategori: {selectedBook.category}
                </Typography>
                <Typography variant="paragraph" color="gray" className="mb-1">
                  Jumlah Halaman: {selectedBook.pages || "N/A"}
                </Typography>
                <Typography variant="paragraph" color="gray" className="mb-1">
                  Stok Tersedia: {selectedBook.stock || 0}
                </Typography>
                <Typography variant="h6" color="blue-gray" className="mt-4 mb-2">
                  Deskripsi:
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="text-justify">
                  {selectedBook.description || "Tidak ada deskripsi."}
                </Typography>
                {selectedBook.bookFileUrl && (
                  <Button
                    color="green"
                    className="mt-4 flex items-center gap-2"
                    onClick={() => window.open(selectedBook.bookFileUrl, '_blank')}
                  >
                    <EyeIcon className="h-4 w-4" /> Baca Buku
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDetailModal(false)}
            className="mr-1"
          >
            Tutup
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Library;