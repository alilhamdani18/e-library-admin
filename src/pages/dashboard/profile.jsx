import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { librarianServices } from "@/services/librarianServices";
import { getAuth } from "firebase/auth";
export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [originalPhoto, setOriginalPhoto] = useState(null); // untuk upload file asli
  const [loading, setLoading] = useState(true);

  // Ambil data pustakawan dari API saat komponen dimuat
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User belum login");

      const uid = user.uid; 

      const data = await librarianServices.getLibrarianProfile(uid);
      console.log(data);
      setProfileData(data);
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempURL = URL.createObjectURL(file);
      setOriginalPhoto(file);
      setProfileData({ ...profileData, photo: tempURL }); // preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedData = { ...profileData };

      // Jika ada file baru, upload dulu dan dapatkan URL-nya
      if (originalPhoto) {
        const formData = new FormData();
        formData.append("photo", originalPhoto);
        const response = await librarianServices.uploadPhoto(formData); // pastikan method ini ada
        updatedData.photo = response.url; // Sesuaikan key-nya
      }

      await librarianServices.updateProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
    }
  };

  if (loading || !profileData) {
    return <div className="text-center mt-10">Memuat data profil...</div>;
  }

  const maskedPassword = "•".repeat(16);

  return (
    <div className="flex justify-center mt-6 px-4">
      <Card className="w-full max-w-5xl p-4 shadow-lg rounded-xl">
        <CardHeader
          floated={false}
          className="h-52 mb-4 bg-gradient-to-tr from-green-600 to-teal-500 flex justify-center items-center relative"
        >
          <div className="flex flex-col items-center">
            <Avatar
              src={profileData.profileImageUrl}
              alt="Profile Picture"
              size="xxl"
              variant="circular"
              className="border-4 border-white shadow-lg"
            />
            {isEditing && (
              <div className="mt-4 flex flex-col items-center">
                <label className="cursor-pointer bg-white text-sm text-blue-600 font-medium py-2 px-4 border border-blue-500 rounded-lg shadow hover:bg-blue-50 transition duration-300">
                  Upload Foto Baru
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            )}
          </div>
        </CardHeader>

        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!isEditing ? (
            <>
              <div>
                <Typography variant="h5" color="blue-gray">
                  {profileData.name}
                </Typography>
                <Typography color="gray" className="mb-2">
                  {profileData.role}
                </Typography>
                <Typography color="blue-gray">
                  {profileData.bio}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1">
                  Email: {profileData.email}
                </Typography>
                <Typography variant="small" color="blue-gray">
                  Telepon: {profileData.phone}
                </Typography>
                <Typography variant="small" color="blue-gray" className="mt-4">
                  {" "}
                  <span className="font-mono tracking-widest">
                    {maskedPassword}
                  </span>
                </Typography>
                <div className="mt-6">
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
              </div>
            </>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Input
                label="Nama Lengkap"
                name="name"
                value={profileData.name}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
              />
              <Input
                label="Telepon"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
              />
              <Input
                label="Jabatan"
                name="role"
                value={profileData.role}
                onChange={handleChange}
              />
              <div className="col-span-1 md:col-span-2">
                <Input
                  label="Bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Input
                  label="Password (Hashed)"
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleChange}
                  className="font-mono"
                />
              </div>
              {/* Tambahan opsional untuk konfirmasi password bisa ditambahkan validasi nanti */}
              <div className="flex gap-3 mt-4">
                <Button type="submit" color="blue">
                  Simpan
                </Button>
                <Button color="gray" onClick={() => setIsEditing(false)}>
                  Batal
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Profile;
