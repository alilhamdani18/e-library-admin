import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import logo from "/img/e-library-icon.png"; // Pastikan kamu punya logo di public atau src

export function SignIn() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-white">
      <Card className="w-full max-w-md shadow-2xl p-6 rounded-xl">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-32 h-32 " />
          <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
            Sign In
          </Typography>
          <Typography color="gray" className="text-center text-sm mb-6">
            Enter your email and password to access the dashboard.
          </Typography>
        </div>

        <form className="space-y-6">
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-medium mb-1"
            >
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="you@example.com"
              className="!border-t-blue-gray-200 focus:!border-t-blue-500"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-medium mb-1"
            >
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-blue-500"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="font-medium"
                >
                  Remember me
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="text-sm text-blue-500 hover:underline cursor-pointer">
              <a href="#">Forgot Password?</a>
            </Typography>
          </div>

          <Button fullWidth className="bg-blue-600 hover:bg-blue-700 transition-colors">
            Sign In
          </Button>
  
        </form>
      </Card>
    </section>
  );
}

export default SignIn;
