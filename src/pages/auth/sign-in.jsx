import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/img/e-library-icon.png";

export function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Di sini bisa tambahkan logika autentikasi kalau sudah ada
    navigate("/dashboard");
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
          <div>
            <Typography variant="small" color="blue-gray" className="font-medium mb-1">
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="you@example.com"
              type="email"
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
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="transition-all duration-300 !border-t-blue-gray-200 focus:!border-t-blue-600 focus:ring-2 focus:ring-blue-100"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
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
