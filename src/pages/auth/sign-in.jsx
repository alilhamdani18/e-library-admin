import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../configs/firebase"; // sesuaikan path-nya
import logo from "/img/e-library-icon.png";
import Alert from "../../components/Alert";

export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "librarians", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "librarian") {
        const userData = userSnap.data();

        Alert.success('Login Berhasil!', 'Selamat datang kembali!');

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500); // agar SweetAlert sempat tampil

      } else {
        setError("Akun ini tidak memiliki akses sebagai pustakawan.");
      }

    } catch (err) {
      console.error(err);
      setError("Email atau password salah.");
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
            <Link to="#" className="text-blue-500 hover:underline">
              Forgot password?
            </Link>
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
    </section>
  );
}

export default SignIn;
