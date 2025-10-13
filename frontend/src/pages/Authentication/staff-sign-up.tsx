import { SelectComboBox } from "@/components/select-combo-box"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { staffSignup, type StaffData } from "@/services/authServices"
import { getAllBranches } from "@/services/branchServices"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"

export const Roles = [
  {
    value: "Nurse",
    label: "Nurse",
  },
  {
    value: "Billing_Staff",
    label: "Billing Staff",
  },
  {
    value: "Receptionist",
    label: "Receptionist",
  },
  {
    value: "Admin_Staff",
    label: "Admin Staff",
  },
  {
    value: "Doctor",
    label: "Doctor",
  },
  {
    value: "Insurance_Agent",
    label: "Insurance Agent",
  },
  {
    value: "Branch_Manager",
    label: "Branch Manager",
  },
  {
    value: "Super_Admin",
    label: "Super Admin",
  },
  {
    value: "Patient",
    label: "Patient",
  },
]

export const StaffRoles = [
  {
    value: "Nurse",
    label: "Nurse",
  },
  {
    value: "Billing_Staff",
    label: "Billing Staff",
  },
  {
    value: "Receptionist",
    label: "Receptionist",
  },
  {
    value: "Admin_Staff",
    label: "Admin Staff",
  },
  {
    value: "Doctor",
    label: "Doctor",
  },
  {
    value: "Insurance_Agent",
    label: "Insurance Agent",
  },
  {
    value: "Branch_Manager",
    label: "Branch Manager",
  },
  {
    value: "Super_Admin",
    label: "Super Admin",
  },
]


const StaffSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNo, setPhoneNo] = useState("")
  const [gender, setGender] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        const mappedBranches = data.branches.map((b) => ({
          value: String(b.branch_id),   // backend ID → value
          label: b.name,         // backend name → label
        }));
        setBranches(mappedBranches);
      } catch (err) {
        toast.error("Failed to load branches");
      }
    };

    fetchBranches();
  }, []);


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true);

    const staffData: StaffData = {
      fullname,
      username,
      email,
      password,
      phoneNo,
      gender,
      role: selectedRole,
      branch: Number(selectedBranch),
    }

    if (
      fullname === "" ||
      username === "" ||
      password === "" ||
      confirmPassword === "" ||
      email === "" ||
      phoneNo === "" ||
      gender === "" ||
      selectedRole === "" ||
      selectedBranch === ""
    ) {
      toast.error("Please fill all the required details");
      setLoading(false);
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false);
    } else {
      console.log("Submitting staff account:", staffData)
      try {
        const message = await staffSignup(staffData);
        toast.success(message);
        navigate("/staff/sign-in");
      } catch (error: any) {
        toast.error(error || "Failed to create staff account");
      } finally {
        setLoading(false);
      }
    }
  }



  return (
    <div className="flex items-center justify-center min-h-dvh">
      <Card className="w-full max-w-[96vw] md:max-w-[80vw] md:max-w-2xl">
        <CardHeader>
          <CardTitle>Create a staff account</CardTitle>
          <CardDescription>
            Provide the required information to create a new staff account.<br />
            The account will be used to access the system based on their role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid md:grid-cols-2 gap-3 w-full sm:grid-cols-1">

              <div className="grid gap-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  type="text"
                  required
                  value={fullname}
                  onChange={
                    (e) => setFullname(e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={
                    (e) => setUsername(e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={
                    (e) => setPassword(e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                </div>
                <Input
                  id="confirm_password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={
                    (e) => setConfirmPassword(e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Phone Number</Label>
                <Input
                  id="phone_no"
                  type="tel"
                  placeholder="+94 (XX) XXX XXXX"
                  required
                  value={phoneNo}
                  onChange={
                    (e) => setPhoneNo(e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={
                    (e) => setEmail(e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setGender(value)}>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <SelectComboBox
                  options={StaffRoles}
                  value={selectedRole}
                  onChange={setSelectedRole}
                  placeholder="Select role..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                <SelectComboBox
                  options={branches}
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  placeholder="Select branch..."
                />
              </div>

            </div>
          </form>
        </CardContent>
        <CardFooter className="self-center flex md:flex-row flex-col-reverse gap-5 pt-[20px]">

          <Button
            type="submit"
            className="md:w-[50%]"
            variant={"outline"}
            disabled={loading}
          >
            <Link to="/staff/sign-in" >
              Sign in
            </Link>
          </Button>

          <Button
            type="submit"
            className="md:w-[50%]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>

        </CardFooter>
      </Card>
    </div>
  )
}

export default StaffSignUp;