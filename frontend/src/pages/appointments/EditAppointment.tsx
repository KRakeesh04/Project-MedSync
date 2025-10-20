import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllDoctorsForAppointments, updateAppointment, type Doctor, type Appointment } from '@/services/appointmentServices';
import { toast } from 'sonner';
import { User, Phone, Calendar, Clock, Stethoscope } from 'lucide-react';

interface EditAppointmentProps {
  isOpen: boolean;
  selectedAppointment: Appointment | null;
  onFinished: () => void;
  onClose: () => void;
}

export default function EditAppointment({ isOpen, selectedAppointment, onFinished, onClose }: EditAppointmentProps) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_contact: '',
    patient_age: '',
    doctor_id: '',
    date: '',
    time_slot: '',
    patient_note: '',
    status: 'Pending'
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

  const statusOptions = [
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled'
  ];

  const fetchDoctors = async () => {
    try {
      const data = await getAllDoctorsForAppointments();
      setDoctors(data);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedAppointment) {
      setFormData({
        patient_name: selectedAppointment.patient_name || '',
        patient_contact: '', // Contact is not stored in appointment, would need separate API
        patient_age: '0', // Age is not stored in appointment, would need separate API
        doctor_id: selectedAppointment.doctor_id.toString(),
        date: selectedAppointment.date,
        time_slot: selectedAppointment.time_slot,
        patient_note: selectedAppointment.patient_note || '',
        status: selectedAppointment.status || 'Pending'
      });
    }
  }, [selectedAppointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAppointment) {
      toast.error('No appointment selected');
      return;
    }

    // Validate before setting loading state
    if (!formData.patient_name.trim() || 
        !formData.doctor_id || 
        !formData.date || 
        !formData.time_slot) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await updateAppointment(selectedAppointment.appointment_id, {
        patient_name: formData.patient_name.trim(),
        doctor_id: Number(formData.doctor_id),
        date: formData.date,
        time_slot: formData.time_slot,
        patient_note: formData.patient_note.trim(),
        status: formData.status
      });
      
      toast.success('Appointment updated successfully');
      onFinished();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update appointment');
      console.error('Error updating appointment:', error);
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
    return doctor ? `${doctor.name} ${doctor.specialties ? `- ${doctor.specialties}` : ''}` : '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Appointment #{selectedAppointment?.appointment_id}
          </DialogTitle>
          <DialogDescription>
            Update the appointment details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="edit-patient_name">Patient Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-patient_name"
                  placeholder="Enter patient full name"
                  className="pl-10"
                  value={formData.patient_name}
                  onChange={(e) => handleInputChange('patient_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-doctor_id">Doctor *</Label>
              <div className="relative">
                <Select 
                  value={formData.doctor_id} 
                  onValueChange={(value) => handleInputChange('doctor_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor">
                      {formData.doctor_id ? getSelectedDoctorName() : "Select doctor"}
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
              <Label htmlFor="edit-date">Appointment Date *</Label>
              <div className="relative">
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="edit-time_slot">Time Slot *</Label>
              <div className="relative">
                <Select 
                  value={formData.time_slot} 
                  onValueChange={(value) => handleInputChange('time_slot', value)}
                >
                  <SelectTrigger>
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

            <div className="space-y-3">
              <Label htmlFor="edit-status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="edit-patient_note">Patient Notes</Label>
            <Textarea
              id="edit-patient_note"
              placeholder="Enter any notes, symptoms, or special requirements..."
              value={formData.patient_note}
              onChange={(e) => handleInputChange('patient_note', e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}