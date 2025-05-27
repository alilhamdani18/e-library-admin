import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Textarea,
  Typography,
  Tooltip,
  Input,
  IconButton,
  Select,
  Option,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, HeartIcon, PlusIcon } from "@heroicons/react/24/solid";
import { projectsData } from "@/data";

export function Library() {
  const categories = ["Semua", ...new Set(projectsData.map((book) => book.category))];
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: "",
    category: "",
    description: "",
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleAddBook = () => {
    alert("Buku berhasil ditambahkan (simulasi)");
    setOpenModal(false);
    setFormData({ title: "", author: "", description: "", file: null });
  };

  const filteredBooks = projectsData.filter((book) => {
    const matchCategory = selectedCategory === "Semua" || book.category === selectedCategory;
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

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
            <Button color="green" onClick={() => setOpenModal(true)} className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" /> Tambah Buku
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-8">
            <div className="w-full md:w-1/2">
              <Input
                label="Cari buku..."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {filteredBooks.map(({ title, img, author, year, description, rating, likes, members }) => (
              <Card key={title} className="border border-gray-200 shadow-md rounded-lg overflow-hidden">
                <CardHeader floated={false} color="gray" className="h-48">
                  <img src={img} alt={title} className="h-full w-full object-cover" />
                </CardHeader>
                <CardBody className="py-2 px-4">
                  <Typography variant="h6" color="blue-gray" className="mb-1">
                    {title}
                  </Typography>
                  <Typography variant="small" className="text-indigo-500 mb-1">
                    {author} &middot; {year}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 mb-2">
                    {description}
                  </Typography>
                  <Typography variant="small" className="text-yellow-800 font-semibold mb-1">
                    Rating: {rating} / 5
                  </Typography>
                  <Typography variant="small" className="text-red-400 font-medium flex items-center gap-1">
                    <HeartIcon className="h-4 w-4" /> {likes} suka
                  </Typography>
                </CardBody>
                
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Modal Tambah Buku */}
      <Dialog open={openModal} handler={() => setOpenModal(!openModal)} size="md">
        <DialogHeader className="justify-center">Tambah Buku Baru</DialogHeader>
        <DialogBody divider className="flex flex-col gap-4">
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl p-6 text-center cursor-pointer"
            onClick={() => document.getElementById("file-upload").click()}
          >
            <img
              src="/img/upload-icon.png"
              alt="Upload Icon"
              className="w-12 h-12 mb-2 opacity-80"
            />
            <p className="text-blue-600 font-medium">
              {formData.file
                ? formData.file.name
                : "Drag & Drop atau Klik untuk Upload Cover"}
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
          
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-2"></div>
            <Input
              label="Judul"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <Input
              label="Penulis"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
            />
            
            
          </div>
          <div className="flex flex-row gap-2">
            <Input
              label="Tahun Terbit"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
            />
            <Input
              label="Kategori"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
            <Input
              label="Jumlah Halaman"
              name="pages"
              value={formData.author}
              onChange={handleInputChange}
            />
            
          </div>
          <div className="flex">
            <Textarea 
              label="Deskripsi" 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenModal(false)}
            className="mr-1"
          >
            Batal
          </Button>
          <Button color="green" onClick={handleAddBook}>
            Simpan
          </Button>
        </DialogFooter>
      </Dialog>

    </>
  );
}

export default Library;