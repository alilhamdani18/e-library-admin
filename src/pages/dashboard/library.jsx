import React, { useState, useEffect, useCallback } from "react"; 
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
  Progress
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  DocumentArrowUpIcon,
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
  const [uploadProgress, setUploadProgress] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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

  const predefinedCategories = ["Novel", "Islamic", "Pendidikan", "Kitab", "Motivation"]; 

  const handleUploadProgress = (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setUploadProgress(percentCompleted);
  };

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let fetchedBooks = [];
      let totalItems = 0;
      let totalPages = 0;

      if (selectedCategory === 'Semua') {
        const response = await bookService.getAllBooks(
          currentPage,
          12,
          '', 
          searchTerm
        );
        fetchedBooks = response.data;
        totalItems = response.pagination.totalItems;
        totalPages = response.pagination.totalPages;

      } else if (selectedCategory === 'Others') {
        const response = await bookService.getAllBooks(
          1,
          1000000, 
          '', 
          searchTerm
        );

        const filteredForOthers = response.data.filter(book => 
          !predefinedCategories.includes(book.category)
        );

        const startIndex = (currentPage - 1) * 12;
        const endIndex = startIndex + 12;
        fetchedBooks = filteredForOthers.slice(startIndex, endIndex);

        totalItems = filteredForOthers.length;
        totalPages = Math.ceil(totalItems / 12); 

      } else {
        const response = await bookService.getAllBooks(
          currentPage,
          12,
          selectedCategory, 
          searchTerm
        );
        fetchedBooks = response.data;
        totalItems = response.pagination.totalItems;
        totalPages = response.pagination.totalPages;
      }

      setBooks(fetchedBooks);
      setTotalPages(totalPages);
      setTotalItems(totalItems);

    } catch (err) {
      setError('Gagal mengambil buku: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchTerm]); 

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const categories = ["Semua", ...predefinedCategories, "Others"].filter(
    (value, index, self) => self.indexOf(value) === index
  );

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
      setUploadProgress(0); 

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

      await bookService.createBook(dataToSend, handleUploadProgress);

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
      setCurrentPage(1); 
      await fetchBooks();
      Alert.success("Buku berhasil ditambahkan", "");
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.error("Gagal menambahkan buku. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setUploadProgress(0); 
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
      setUploadProgress(0); 

      const dataToSend = new FormData();
      if (formData.title !== selectedBook.title) dataToSend.append("title", formData.title);
      if (formData.author !== selectedBook.author) dataToSend.append("author", formData.author);
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

      await bookService.updateBook(selectedBook.id, dataToSend, handleUploadProgress);

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
      setUploadProgress(0); 
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
      if (books.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1); 
      } else {
        await fetchBooks();
      }
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

  

  if (loading && books.length === 0 && totalItems === 0) {
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
                Pustaka ({totalItems} buku) 
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
              <DocumentArrowUpIcon className="h-4 w-4" /> Tambah
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-8">
            <div className="w-full md:w-1/2">
              <Input
                label="Cari buku..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); 
                }}
                color="green"
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select
                label="Filter berdasarkan kategori"
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1); 
                }}
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

          {books.length === 0 && !loading ? (
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
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {books.map((book) => ( // Render langsung dari state 'books'
                <Card
                  key={book.id}
                  className="border border-gray-200 shadow-md overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleViewDetails(book.id)}
                >
                  <CardHeader floated={false} color="gray" className="h-60 flex-shrink-0 relative">
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
                      Tersedia: {book.stock || 0}
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
                onClick={() => handlePageChange(currentPage - 1)} 
              >
                {/* <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />  */}
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "filled" : "outlined"}
                  color="green"
                  onClick={() => handlePageChange(page)} 
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
                onClick={() => handlePageChange(currentPage + 1)} 
              >
                Next 
                {/* <ArrowRightIcon strokeWidth={2} className="h-4 w-4" /> */}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal Tambah Buku */}
      <Dialog open={openAddModal} handler={() => setOpenAddModal(!openAddModal)} size="lg">
        <DialogHeader className="justify-center">Tambah Buku Baru</DialogHeader>
        <DialogBody divider className="max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center p-2 border border-blue-gray-100 rounded-lg shadow-sm">
                <Typography variant="h6" color="blue-gray" className="mb-2 text-sm">
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
                <Typography variant="h6" color="blue-gray" className="mb-2 text-sm">
                  Upload File Buku (PDF/EPUB)
                </Typography>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 bg-green-50 hover:bg-green-100 transition-colors rounded-xl p-4 text-center cursor-pointer w-full h-36"
                  onClick={() => document.getElementById("book-file-upload-add").click()}
                >
                  <img src="/img/upload-icon.png" alt="Upload Icon" className="w-10 h-10 mb-1 opacity-80" />

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
            {loading && uploadProgress > 0 && (
                <div className="w-full mt-4 col-span-full"> 
                  <Typography variant="small" color="blue-gray" className="mb-2">
                    Memproses: {uploadProgress}%
                  </Typography>
                  <Progress value={uploadProgress} color="blue" />
                </div>
              )}

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
            {loading && uploadProgress > 0 ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Edit Buku */}
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

              {loading && uploadProgress > 0 && (
                <div className="w-full mt-4 col-span-full"> 
                  <Typography variant="small" color="blue-gray" className="mb-2">
                    Memproses : {uploadProgress}%
                  </Typography>
                  <Progress value={uploadProgress} color="blue" />
                </div>
              )}

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
            {loading && uploadProgress > 0 ? "Mengunggah..." : "Simpan Perubahan"}
          
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
            {loading && uploadProgress > 0 ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Detail Buku */}
      <Dialog open={openDetailModal} handler={() => setOpenDetailModal(!openDetailModal)} size="md">
        <DialogHeader className="justify-center">Detail Buku</DialogHeader>
        <DialogBody divider className="max-h-[70vh] overflow-y-auto">
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
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          {selectedBook?.bookFileUrl && (
            <Button
              color="green"
              onClick={() => window.open(selectedBook.bookFileUrl, '_blank')}
              className="mr-1"
            >
              Baca Buku
            </Button>
          )}
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDetailModal(false)}
          >
            Tutup
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}