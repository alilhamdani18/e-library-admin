import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../configs/firebase";
import logo from "/img/e-library-icon.png";
import Alert from "../../components/Alert";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleOpenForgotPassword = () => {
    setShowForgotPasswordDialog(true);
    setForgotPasswordEmail(email);
    setForgotPasswordMessage("");
    setForgotPasswordError("");
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPasswordDialog(false);
    setForgotPasswordEmail("");
    setForgotPasswordMessage("");
    setForgotPasswordError("");
  };

  const handleSendPasswordReset = async () => {
    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");
    setForgotPasswordError("");

    if (!forgotPasswordEmail) {
      setForgotPasswordError("Silakan masukkan alamat email.");
      setForgotPasswordLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail.trim());
      setForgotPasswordMessage("Tautan reset kata sandi telah dikirim ke email Anda. Silakan periksa inbox dan folder spam Anda.");
    } catch (err) {
      let errorMessage = "Gagal mengirim tautan reset kata sandi.";

      switch (err.code) {
        case "auth/invalid-email":
          errorMessage = "Alamat email tidak valid.";
          break;
        case "auth/user-not-found":
          errorMessage = "Tidak ada pengguna dengan alamat email ini.";
          break;
        case "auth/missing-email":
          errorMessage = "Alamat email tidak boleh kosong.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Terlalu banyak percobaan. Silakan coba lagi nanti.";
          break;
        default:
          errorMessage = `Terjadi kesalahan: ${err.message}`;
          break;
      }
      setForgotPasswordError(errorMessage);
      Alert.error('Gagal!', errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      const userRef = doc(db, "librarians", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "librarian") {
        Alert.success('Login Berhasil!', 'Selamat datang kembali!');

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        Alert.error('Akses Ditolak', 'Akun ini tidak memiliki akses sebagai pustakawan.');
        await auth.signOut(); // Penting: Logout jika bukan pustakawan
      }

    } catch (err) {
      Alert.error('Login Gagal', 'Email atau password salah.');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-200 to-emerald-100 px-4">
      <Card className="w-full max-w-md shadow-xl p-8 rounded-2xl backdrop-blur-md bg-white/90">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-4 drop-shadow-md" />
          <Typography variant="h4" color="blue-gray" className="font-bold">
            Welcome Back
          </Typography>
          <Typography color="gray" className="text-center text-sm mb-6">
            Sign in to the Librarian Admin Panel
          </Typography>
        </div>

        <form className="space-y-6" onSubmit={handleSignIn}>
          {error && (
            <Typography color="red" className="text-sm text-center">
              {error}
            </Typography>
          )}
          <div>
            <Typography variant="small" color="blue-gray" className="font-medium mb-1">
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-300 !border-t-blue-gray-200 focus:!border-t-blue-600 focus:ring-2 focus:ring-blue-100"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="font-medium mb-1">
              Password
            </Typography>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 transition-all duration-300 !border-t-blue-gray-200 focus:!border-t-blue-600 focus:ring-2 focus:ring-blue-100"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-blue-gray-400"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Checkbox
              label={
                <Typography variant="small" color="gray" className="font-medium">
                  Remember me
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Button
              variant="text"
              color="blue"
              onClick={handleOpenForgotPassword}
              className="p-0 text-sm normal-case"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            fullWidth
            className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition-all duration-300 shadow-md"
          >
            Sign In
          </Button>
        </form>
      </Card>

      <Dialog open={showForgotPasswordDialog} handler={handleCloseForgotPassword} size="xs">
        <DialogHeader className="text-blue-gray-800">Lupa Kata Sandi</DialogHeader>
        <DialogBody divider className="space-y-4">
          <Typography color="gray" className="mb-4">
            Masukkan alamat email Anda yang terdaftar, dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
          </Typography>
          <Input
            label="Email"
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
            size="lg"
            disabled={forgotPasswordLoading}
          />
          {forgotPasswordMessage && (
            <Typography color="green" className="text-sm">
              {forgotPasswordMessage}
            </Typography>
          )}
          {forgotPasswordError && (
            <Typography color="red" className="text-sm">
              {forgotPasswordError}
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button
            variant="text"
            color="red"
            onClick={handleCloseForgotPassword}
            disabled={forgotPasswordLoading}
          >
            Batal
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleSendPasswordReset}
            disabled={forgotPasswordLoading}
          >
            {forgotPasswordLoading ? "Mengirim..." : "Reset Kata Sandi"}
          </Button>
        </DialogFooter>
      </Dialog>
    </section>
  );
}

export default SignIn;