import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctorService } from '@/services/doctorService';

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
  type Branch = {
    branch_id: number | string;
    name: string;
    location: string;
  };

  type Specialty = {
    speciality_id: number;
    speciality_name: string;
    description: string;
  };

  const [branches, setBranches] = useState<Branch[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);

  useEffect(() => {
  const fetchBranches = async () => {
    try {
      console.log('Fetching branches...');
      const response = await fetch('http://localhost:8000/branches');
      console.log('Branches response status:', response.status);
      const data = await response.json();
      console.log('Branches data:', data);
      if (data.success) {
        setBranches(data.data);
        console.log('Set branches:', data.data);
      }
    } catch (error) {
      console.log('Could not fetch branches:', error);
    }
  };

  const fetchSpecialties = async () => {
    try {
      console.log('Fetching specialties...');
      const response = await fetch('http://localhost:8000/specialities');
      console.log('Specialties response status:', response.status);
      const data = await response.json();
      console.log('Specialties data:', data);
      if (data.success) {
        setSpecialties(data.data);
        console.log('Set specialties:', data.data);
      }
    } catch (error) {
      console.log('Could not fetch specialties:', error);
    }
  };

  fetchBranches();
  fetchSpecialties();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await doctorService.addDoctor({
        ...formData,
        specialties: selectedSpecialties
      });
      alert('Doctor added successfully!');
      navigate('/doctors');
    } catch (error) {
      alert('Failed to add doctor: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Add Doctor | Medsync " />
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Doctor Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fee">Fee per Patient (Rs.)</Label>
              <Input
                id="fee"
                type="number"
                value={formData.fee_per_patient}
                onChange={(e) => setFormData({...formData, fee_per_patient: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="salary">Basic Monthly Salary (Rs.)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.basic_monthly_salary}
                onChange={(e) => setFormData({...formData, basic_monthly_salary: e.target.value})}
                required
              />
            </div>

             
            <div>
            <Label htmlFor="branch">Branch</Label>
            <Select onValueChange={(value) => setFormData({...formData, branch_id: value})}>
                <SelectTrigger>
                <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                {branches.map((branch) => (
                    <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                    {branch.name} - {branch.location}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
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
            
            <div className="flex gap-4">
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
