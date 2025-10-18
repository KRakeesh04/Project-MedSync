import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getAllDoctorsForAppointments, getAvailableSlots, type Doctor, type AvailableSlot } from '@/services/appointmentServices';
import { toast } from 'sonner';
import { CheckCircle, Calendar, Clock, User, MapPin } from 'lucide-react';

export default function DoctorTimeSlots() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctorsForAppointments();
      setDoctors(data);
      if (data.length > 0) {
        setSelectedDoctor(data[0].doctor_id.toString());
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor) return;
    
    setLoading(true);
    try {
      const data = await getAvailableSlots(Number(selectedDoctor), selectedDate);
      setAvailableSlots(data);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch available slots');
      console.error('Error fetching available slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleBookAppointment = (slot: AvailableSlot) => {
    console.log('Booking slot:', slot);
    
    // Ensure all data is properly formatted for the URL
    const queryParams = new URLSearchParams({
      doctor_id: slot.doctor_id.toString(),
      date: slot.date, // Use the date exactly as it comes from the API
      time_slot: slot.time_slot
    });
    
    console.log('Navigating with params:', {
      doctor_id: slot.doctor_id.toString(),
      date: slot.date,
      time_slot: slot.time_slot
    });
    
    navigate(`/appointments/add?${queryParams.toString()}`);
  };

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCurrentDoctor = () => {
    return doctors.find(doctor => doctor.doctor_id.toString() === selectedDoctor);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Time Slots</h1>
          <p className="text-muted-foreground">
            Browse and book available appointment slots
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/appointments')}>
          View All Appointments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Available Slots</CardTitle>
          <CardDescription>
            Select a doctor and date to view available time slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="space-y-3 flex-1">
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.doctor_id} value={doctor.doctor_id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{doctor.name}</span>
                        {doctor.specialties && (
                          <span className="text-sm text-muted-foreground">{doctor.specialties}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {getCurrentDoctor() && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{getCurrentDoctor()?.name}</h3>
                  {getCurrentDoctor()?.specialties && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{getCurrentDoctor()?.specialties}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading available slots...</p>
            </div>
          ) : availableSlots.length > 0 ? (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  Available slots for {formatDisplayDate(selectedDate)}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDisplayDate(selectedDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>{availableSlots.length} available time slots</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSlots.map((slot, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold">{slot.doctor_name}</span>
                            {slot.specialty && (
                              <p className="text-sm text-muted-foreground mt-1">{slot.specialty}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Available
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium text-lg">{slot.time_slot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDisplayDate(slot.date)}</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleBookAppointment(slot)}
                          className="w-full"
                          size="lg"
                        >
                          Book This Slot
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No available slots</h3>
              <p className="text-muted-foreground mb-4">
                No available time slots found for the selected criteria
              </p>
              <p className="text-sm text-muted-foreground">
                Try selecting a different doctor or date
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}