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
import { patientSignup, type PatientData } from "@/services/authServices"
import { getAllBranches } from "@/services/branchServices"
import { toMySQLDate } from "@/services/utils"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"




const bloodTypes = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
]


const PatientSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [nic, setNIC] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNo, setPhoneNo] = useState("")
  const [emergencyContactNo, setEmergencyContactNo] = useState("")
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [DOB, setDOB] = useState<string>("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        const mappedBranches = data.branches.map((b) => ({
          value: String(b.branch_id),
          label: b.name,
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

    const date_of_birth = toMySQLDate(DOB);
    const patientData: PatientData = {
      fullname,
      nic,
      username,
      email,
      password,
      phoneNo,
      emergencyContactNo,
      date_of_birth,
      gender,
      bloodType,
      branch: Number(selectedBranch),
      address,
    }

    if (
      fullname === "" ||
      nic === "" ||
      username === "" ||
      password === "" ||
      confirmPassword === "" ||
      DOB === "" ||
      emergencyContactNo === "" ||
      gender === "" ||
      bloodType === "" ||
      address === "" ||
      selectedBranch === ""
    ) {
      toast.error("Please fill all the required details");
      setLoading(false);
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false);
    } else {
      console.log("Submitting staff account:", patientData)
      await patientSignup(patientData)
        .then(() => {
          toast.success("Staff account created successfully")
          navigate("/sign-in");
        })
        .catch((error) => {
          toast.error(error)
        });
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <Card className="w-full max-w-[96vw] md:max-w-[80vw] md:max-w-2xl">
        <CardHeader>
          <CardTitle>Create a patient account</CardTitle>
          <CardDescription>
            Provide the required information to create a new patient account.<br />
            The account will be used to access the system and view medical histories.
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
                <Label htmlFor="nic">NIC</Label>
                <Input
                  id="nic"
                  type="tel"
                  placeholder="XXXX XXXX XXXX"
                  required
                  value={nic}
                  onChange={
                    (e) => setNIC(e.target.value)
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={
                    (e) => setEmail(e.target.value)
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
                <Label htmlFor="emergency_contact_no">Emergency Contact Number</Label>
                <Input
                  id="emergency_contact_no"
                  type="tel"
                  placeholder="+94 (XX) XXX XXXX"
                  required
                  value={emergencyContactNo}
                  onChange={
                    (e) => setEmergencyContactNo(e.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="DOB">Date Of Birth</Label>
                <Input
                  id="DOB"
                  type="tel"
                  placeholder="DD/MM/YYYY"
                  required
                  value={DOB}
                  onChange={(e) => {
                    // only allow numbers and "/"
                    const formatted = e.target.value.replace(/[^0-9/]/g, "");
                    setDOB(formatted);
                  }}
                  pattern="\d{2}/\d{2}/\d{4}"
                  title="Enter date in DD/MM/YYYY format"
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
                <Label htmlFor="bloodType">Blood Group</Label>
                <Select onValueChange={(value) => setBloodType(value)}>
                  <SelectTrigger id="bloodType" className="w-full">
                    <SelectValue placeholder="Blood Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <div className="py-3">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  required
                  value={address}
                  onChange={
                    (e) => setAddress(e.target.value)
                  }
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

export default PatientSignUp;