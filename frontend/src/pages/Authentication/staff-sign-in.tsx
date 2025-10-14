import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signin } from "@/services/authServices"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

const StaffSignIn: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    if (username !== "" && password !== "") {
      await signin(username, password)
        .then(() => {
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error(error);
          setLoading(false);
        });
    } else if (username === "" || password === "") {
      toast.error("Please enter your username and password");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <Card className="w-full max-w-[96vw] md:max-w-[90vw] md:max-w-[450px]">
        <CardHeader>
          <CardTitle>Login to your staff account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              className="w-full"
            >
              <Link to="/staff/sign-up" >
                Sign Up
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            onClick={handleSignIn}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default StaffSignIn;