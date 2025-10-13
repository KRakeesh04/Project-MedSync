import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specialityService } from '@/services/SpecialityService';

export default function AddSpeciality() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    speciality_id: '',
    speciality_name: '',
    description: '',
  });


  type Specialty = {
    speciality_id: number;
    speciality_name: string;
    description: string;
  };

  // const [branches, setBranches] = useState<Branch[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null); 
  useEffect(() => {
  const fetchSpecialities = async () => {
    try {
      const response = await specialityService.getAllSpecialities();
      setSpecialties(response);
    } catch (error) {
      console.log('Could not fetch specialities:', error);
    }
  };

  
  fetchSpecialities();
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await specialityService.addSpeciality({
        ...formData
      });
      alert('Speciality added successfully!');
      navigate('/speciality');
    } catch (error) {
      alert('Failed to add speciality: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Add Speciality | Medsync " />
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Speciality Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Speciality Name</Label>
              <Input
                id="name"
                value={formData.speciality_name}
                onChange={(e) => setFormData({...formData, speciality_name: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Speciality'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/specialities')} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}