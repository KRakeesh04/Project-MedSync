import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllDoctorsForAppointments, createAppointment, type Doctor } from '@/services/appointmentServices';
import { can } from '@/services/roleGuard';
import { toast } from 'sonner';
import { ArrowLeft, User, Phone, Calendar, Clock, Stethoscope } from 'lucide-react';

export default function AddAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isFromAvailableSlots, setIsFromAvailableSlots] = useState(false);
  const [authorized, setAuthorized] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_contact: '',
    patient_age: '',
    doctor_id: '',
    date: '',
    time_slot: '',
    patient_note: '',
  });

  // 30-minute time slots from 08:00 to 17:00
  const timeSlots = [
    '08:00 - 08:30', '08:30 - 09:00',
    '09:00 - 09:30', '09:30 - 10:00',
    '10:00 - 10:30', '10:30 - 11:00',
    '11:00 - 11:30', '11:30 - 12:00',
    '12:00 - 12:30', '12:30 - 13:00',
    '13:00 - 13:30', '13:30 - 14:00',
    '14:00 - 14:30', '14:30 - 15:00',
    '15:00 - 15:30', '15:30 - 16:00',
    '16:00 - 16:30', '16:30 - 17:00'
  ];

  // Function to find matching time slot
  const findMatchingTimeSlot = (timeFromURL: string) => {
    // Try exact match first
    const exactMatch = timeSlots.find(slot => slot === timeFromURL);
    if (exactMatch) return exactMatch;

    // Try flexible matching (remove spaces, dashes, etc.)
    const cleanURLTime = timeFromURL.toLowerCase().replace(/[\s\-:]/g, '');
    const flexibleMatch = timeSlots.find(slot => 
      slot.toLowerCase().replace(/[\s\-:]/g, '').includes(cleanURLTime) ||
      cleanURLTime.includes(slot.toLowerCase().replace(/[\s\-:]/g, ''))
    );
    
    return flexibleMatch || timeFromURL;
  };

  useEffect(() => {
    // Page-level authorization: only allow roles that can add appointments
    if (!can.addAppointment()) {
      toast.error('You do not have permission to create appointments');
      navigate('/appointments', { replace: true });
      return;
    }
    setAuthorized(true);

    const initializeData = async () => {
      try {
        // First fetch doctors
        const doctorsData = await getAllDoctorsForAppointments();
        setDoctors(doctorsData);
        
        // Then check for URL parameters
        const doctorId = searchParams.get('doctor_id');
        const date = searchParams.get('date');
        const timeSlot = searchParams.get('time_slot');

        console.log('URL Parameters received:', { 
          doctorId, 
          date, 
          timeSlot,
          allParams: Object.fromEntries(searchParams.entries())
        });

        if (doctorId && date && timeSlot) {
          setIsFromAvailableSlots(true);
          
          // Find matching time slot
          const matchedTimeSlot = findMatchingTimeSlot(timeSlot);
          
          console.log('Time slot matching result:', {
            fromURL: timeSlot,
            matched: matchedTimeSlot
          });

          // Set all form data at once
          setFormData({
            patient_name: '',
            patient_contact: '',
            patient_age: '',
            doctor_id: doctorId,
            date: date,
            time_slot: matchedTimeSlot,
            patient_note: '',
          });

          console.log('Form data after setting:', {
            doctor_id: doctorId,
            date: date,
            time_slot: matchedTimeSlot
          });
        }
      } catch (error: any) {
        toast.error(error?.message || 'Failed to fetch doctors');
        console.error('Error fetching doctors:', error);
      }
    };

    initializeData();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before setting loading state
    if (!formData.patient_name.trim() || 
        !formData.patient_contact.trim() || 
        !formData.patient_age || 
        !formData.doctor_id || 
        !formData.date || 
        !formData.time_slot) {
      toast.error('Please fill in all required fields');
      return;
    }

    const age = Number(formData.patient_age);
    if (isNaN(age) || age <= 0 || age > 120) {
      toast.error('Please enter a valid age (1-120)');
      return;
    }

    setLoading(true);

    try {
      await createAppointment({
        patient_name: formData.patient_name.trim(),
        patient_contact: formData.patient_contact.trim(),
        patient_age: age,
        doctor_id: Number(formData.doctor_id),
        date: formData.date,
        time_slot: formData.time_slot,
        patient_note: formData.patient_note.trim()
      });
      
      toast.success('Appointment created successfully');
      navigate('/appointments');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create appointment');
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedDoctorName = () => {
    if (!formData.doctor_id) return '';
    const doctor = doctors.find(d => d.doctor_id.toString() === formData.doctor_id);
    return doctor ? doctor.name : '';
  };

  if (!authorized) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Appointment</h1>
          <p className="text-muted-foreground">
            Schedule a new appointment for a patient
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/appointments')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Appointments
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            {isFromAvailableSlots 
              ? "Appointment details are pre-filled from available slots. You can modify them if needed."
              : "Enter the appointment information to schedule a new visit"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="patient_name">Patient Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="patient_name"
                    placeholder="Enter patient full name"
                    className="pl-10"
                    value={formData.patient_name}
                    onChange={(e) => handleInputChange('patient_name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="patient_contact">Patient Contact *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="patient_contact"
                    placeholder="Enter phone number or email"
                    className="pl-10"
                    value={formData.patient_contact}
                    onChange={(e) => handleInputChange('patient_contact', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="patient_age">Patient Age *</Label>
                <Input
                  id="patient_age"
                  type="number"
                  placeholder="Enter age"
                  min={1}
                  max={120}
                  value={formData.patient_age}
                  onChange={(e) => handleInputChange('patient_age', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="doctor_id">Doctor *</Label>
                <div className="relative">
                  <Select 
                    value={formData.doctor_id} 
                    onValueChange={(value) => handleInputChange('doctor_id', value)}
                  >
                    <SelectTrigger className={isFromAvailableSlots ? "bg-blue-50 border-blue-200" : ""}>
                      <SelectValue placeholder="Select doctor">
                        {getSelectedDoctorName() || "Select doctor"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.doctor_id} value={doctor.doctor_id.toString()}>
                          {doctor.name} {doctor.specialties && `- ${doctor.specialties}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Stethoscope className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="date">Appointment Date *</Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={isFromAvailableSlots ? "bg-blue-50 border-blue-200" : ""}
                    required
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="time_slot">Time Slot *</Label>
                <div className="relative">
                  <Select 
                    value={formData.time_slot} 
                    onValueChange={(value) => handleInputChange('time_slot', value)}
                  >
                    <SelectTrigger className={isFromAvailableSlots ? "bg-blue-50 border-blue-200" : ""}>
                      <SelectValue placeholder="Select time slot">
                        {formData.time_slot || "Select time slot"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Clock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="patient_note">Patient Notes</Label>
              <Textarea
                id="patient_note"
                placeholder="Enter any notes, symptoms, or special requirements..."
                value={formData.patient_note}
                onChange={(e) => handleInputChange('patient_note', e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating Appointment...' : 'Create Appointment'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/appointments')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}