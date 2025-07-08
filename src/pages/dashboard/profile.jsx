import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { librarianServices } from "@/services/librarianServices";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Alert from "@/components/Alert";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [originalPhotoFile, setOriginalPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [librarianId, setLibrarianId] = useState(null); 

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User belum login");

      const uid = user.uid;
      setLibrarianId(uid);
      const data = await librarianServices.getLibrarianProfile(uid);
      setProfileData(data);
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
      Alert.error('Gagal!', 'Gagal mengambil data profil.');
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
      setOriginalPhotoFile(file);
      setProfileData({ ...profileData, profileImageUrl: tempURL });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!librarianId) {
      Alert.error('Oops...', 'ID Librarian tidak ditemukan.');
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        name: profileData.name || '',
        email: profileData.email,
        phone: profileData.phone || '',
        address: profileData.address || '',
        role: profileData.role || '',
      };

      if (originalPhotoFile) {
        dataToSend.profilePhotoFile = originalPhotoFile;
      }

      await librarianServices.updateLibrarianProfile(librarianId, dataToSend); 
      
      await fetchProfile(); 

      setIsEditing(false);
      setOriginalPhotoFile(null); 
      Alert.success('Berhasil!', 'Profil berhasil diperbarui!');
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
      Alert.error('Oops...', 'Gagal memperbarui profil!');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Kata sandi baru tidak cocok.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setPasswordError("User belum login.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.success('Berhasil!', 'Kata sandi berhasil diubah!');
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordError("");
    } catch (error) {
      console.error("Error changing password:", error);
      let errorMessage = "Gagal mengubah kata sandi.";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Kata sandi saat ini salah.";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Silakan login kembali untuk mengubah kata sandi Anda.";
      } else {
        errorMessage = `Gagal mengubah kata sandi: ${error.message}`;
      }
      setPasswordError(errorMessage); 
      Alert.error('Oops...', errorMessage); 
    }
  };

  if (loading || !profileData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Typography variant="h5" color="green">Memuat data profil...</Typography>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-4xl p-0 shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <CardHeader
          floated={false}
          className="h-56 bg-gradient-to-br from-green-600 to-light-green-400 flex justify-center items-center rounded-b-3xl overflow-hidden shadow-lg"
        >
          <div className="flex flex-col items-center absolute">
            <Avatar
              src={profileData.profileImageUrl || "/img/icon-app.png"} 
              alt="Profile Picture"
              size="xxl"
              variant="circular"
              className="border-6 border-white shadow-xl ring-4 ring-green-200 transition-all duration-300 hover:scale-105"
            />
            {isEditing && (
              <div className="mt-5">
                <label htmlFor="photo-upload" className="cursor-pointer bg-white text-sm text-green-600 font-medium py-2 px-5 border border-green-500 rounded-full shadow-md hover:bg-green-50 transition duration-300 transform hover:scale-105 flex items-center gap-2">
                  <i className="fa-solid fa-camera"></i> Upload Foto Baru
                  <input
                    id="photo-upload"
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

        <CardBody className="px-4 pb-8 pt-16">
          {!isEditing ? (
            <div className="md:text-left">
              <Typography variant="h3" color="green-gray" className="mb-2 font-bold leading-tight">
                {profileData.name || ""}
              </Typography>
              <Typography color="green" className="mb-8 text-lg font-semibold uppercase">
                {profileData.role || ""}
              </Typography>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-envelope text-xl text-green-500 pt-1"></i>
                  <div>
                    <Typography variant="small" color="gray" className="font-semibold">Email</Typography>
                    <Typography variant="lead" color="green-gray" className="font-normal">{profileData.email || ""}</Typography>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-phone text-xl text-green-500 pt-1"></i>
                  <div>
                    <Typography variant="small" color="gray" className="font-semibold">Telepon</Typography>
                    <Typography variant="lead" color="green-gray" className="font-normal">{profileData.phone || ""}</Typography>
                  </div>
                </div>

                {profileData.address && (
                    <div className="flex items-start gap-4">
                        <i className="fa-solid fa-map-marker-alt text-xl text-green-500 pt-1"></i>
                        <div>
                            <Typography variant="small" color="gray" className="font-semibold">Alamat</Typography>
                            <Typography variant="lead" color="green-gray" className="font-normal">{profileData.address || ""}</Typography>
                        </div>
                    </div>
                )}
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button onClick={() => setIsEditing(true)} color="green" className="flex items-center gap-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <i className="fa-solid fa-edit"></i> Edit Profil
                </Button>
                <Button onClick={() => setShowPasswordDialog(true)} color="red" variant="outlined" className="flex items-center gap-2 px-6 py-3 rounded-lg border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300">
                  <i className="fa-solid fa-lock"></i> Ubah Kata Sandi
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <Input
                label="Nama Lengkap"
                name="name"
                value={profileData.name || ""}
                onChange={handleChange}
                size="lg"
                className="md:col-span-1"
              />
              <Input
                label="Email"
                name="email"
                value={profileData.email || ""}
                onChange={handleChange}
                size="lg"
                disabled
                className="md:col-span-1"
              />
              <Input
                label="Telepon"
                name="phone"
                value={profileData.phone || ""}
                onChange={handleChange}
                size="lg"
                className="md:col-span-1"
              />
              <Input
                label="Alamat"
                name="address"
                value={profileData.address || ""}
                onChange={handleChange}
                size="lg"
                className="md:col-span-1"
              />
              <Input
                label="Jabatan"
                name="role"
                value={profileData.role || ""}
                onChange={handleChange}
                disabled
                size="lg"
                className="md:col-span-1"
              />

              <div className="flex gap-4 mt-6 col-span-full justify-end">
                <Button 
                  type="submit" 
                  color="green" 
                  className="flex flex-wrap gap-2 items-center justify-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Menyimpan..." : <><i className="fa-solid fa-save"></i>Simpan Perubahan</>}
                </Button>
                <Button
                  color="gray"
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    setOriginalPhotoFile(null);
                    fetchProfile();
                  }}
                  className="flex flex-wrap gap-2 items-center justify-center px-6 py-3 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-50 transition-all duration-300"
                  disabled={loading}
                >
                  <i className="fa-solid fa-times"></i> Batal
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>

      {/* Dialog Ubah Kata Sandi */}
      <Dialog open={showPasswordDialog} handler={setShowPasswordDialog} size="xs">
        <DialogHeader className="text-green-700 font-bold">Ubah Kata Sandi</DialogHeader>
        <DialogBody divider className="space-y-4">
          <Input
            label="Kata Sandi Saat Ini"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            size="lg"
          />
          <Input
            label="Kata Sandi Baru"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size="lg"
          />
          <Input
            label="Konfirmasi Kata Sandi Baru"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            size="lg"
          />
          {passwordError && (
            <Typography color="red" className="text-sm">
              {passwordError}
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setShowPasswordDialog(false);
              setCurrentPassword("");
              setNewPassword("");
              setConfirmNewPassword("");
              setPasswordError("");
            }}
          >
            Batal
          </Button>
          <Button variant="gradient" color="green" onClick={handleChangePassword}>
            Ubah
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Profile;