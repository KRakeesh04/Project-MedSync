import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSpecialityNames } from '@/services/specialityServices';
import { addDoctor } from '@/services/doctorServices';
import { getAllBranches } from '@/services/branchServices';
import { toast } from 'sonner';

export default function AddDoctor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fee_per_patient: '',
    basic_monthly_salary: '',
    gender: '',
    branch_id: '',
    specialties: [] as number[],
  });

  type Specialty = {
    speciality_id: number;
    speciality_name: string;
    description?: string;
  };

  const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);

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

    const fetchSpecialties = async () => {
      try {
        const data = await getSpecialityNames();
        if (data.speciality_count > 0) {
          // data.specialities contains only id and name; keep compatibility with existing UI
          setSpecialties(data.specialities as Specialty[]);
        } else {
          toast.warning("No specialties found. Please add specialties first.");
        }
      } catch (error) {
        toast.error("Failed to load specialties");
      }
    };

    fetchBranches();
    fetchSpecialties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoctor({
        ...formData,
        specialties: selectedSpecialties
      });
      toast.success('Doctor added successfully');
      navigate('/doctors');
    } catch (error: any) {
      toast.error(error || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 place-items-center md:pt-10">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
          <CardDescription>
            Add a new doctor to the system. <br />
            It'll create default user credentials for the doctor.<br />
            (e.g., John Doe → username: john_doe, password: john_doe_password)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className='flex flex-col gap-3'>
              <Label htmlFor="name">Doctor Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6 sm:grid-cols-1">
              <div className='flex flex-col gap-3 w-full'>
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col gap-3 w-full'>
                <Label htmlFor="branch">Branch</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, branch_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.label} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col gap-3 w-full'>
                <Label htmlFor="fee">Fee per Patient (Rs.)</Label>
                <Input
                  id="fee"
                  type="number"
                  value={formData.fee_per_patient}
                  step={100}
                  min={0}
                  onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                  onChange={(e) => {
                    const val = e.target.value;

                    if (val === '' || Number(val) >= 0) {
                      setFormData({ ...formData, fee_per_patient: val });
                    }
                  }}
                  required
                />
              </div>

              <div className='flex flex-col gap-3 w-full'>
                <Label htmlFor="salary">Basic Monthly Salary (Rs.)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.basic_monthly_salary}
                  step={1000}
                  min={0}
                  onChange={(e) => setFormData({ ...formData, basic_monthly_salary: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="specialties">Specialties</Label>
              {specialties.length === 0 ? (
                <p className="text-sm text-gray-500">Loading specialties... ({specialties.length} found)</p>
              ) : (
                <div className="border rounded-md p-3 space-y-2 max-h-40 overflow-y-auto">
                  {specialties.map((specialty) => (
                    <div key={specialty.speciality_id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`specialty-${specialty.speciality_id}`}
                        checked={selectedSpecialties.includes(specialty.speciality_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSpecialties([...selectedSpecialties, specialty.speciality_id]);
                          } else {
                            setSelectedSpecialties(selectedSpecialties.filter(id => id !== specialty.speciality_id));
                          }
                        }}
                        className="rounded"
                      />
                      <Label
                        htmlFor={`specialty-${specialty.speciality_id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {specialty.speciality_name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Selected: {selectedSpecialties.length} specialties | Available: {specialties.length} specialties
              </p>
            </div>

            <div className="flex gap-4 place-content-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Doctor'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/doctors')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
