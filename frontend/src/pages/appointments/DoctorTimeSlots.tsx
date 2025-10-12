// src/pages/appointments/DoctorTimeSlots.tsx
import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, List, Tag, Avatar, Button, Space, message } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

interface Doctor {
  doctor_id: number;
  name: string;
  specialty?: string;
}

interface AvailableSlot {
  doctor_id: number;
  date: string;
  time_slot: string;
  doctor_name: string;
  specialty?: string;
}

const DoctorTimeSlots: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch doctors from backend
  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/doctors');
      const data = await response.json();
      setDoctors(data);
      if (data.length > 0) {
        setSelectedDoctor(data[0].doctor_id);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      message.error('Failed to fetch doctors');
    }
  };

  // Fetch available slots from backend
  const fetchAvailableSlots = async () => {
    if (!selectedDoctor) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/available-slots?doctor_id=${selectedDoctor}&date=${selectedDate}`
      );
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      message.error('Failed to fetch available slots');
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
    // Navigate to add appointment page with pre-filled data
    const queryParams = new URLSearchParams({
      doctor_id: slot.doctor_id.toString(),
      date: slot.date,
      time_slot: slot.time_slot
    });
    window.location.href = `/appointments/add?${queryParams.toString()}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Available Time Slots
      </h1>

      <Card>
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            placeholder="Select Doctor"
            style={{ width: 250 }}
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            loading={loading}
          >
            {doctors.map(doctor => (
              <Option key={doctor.doctor_id} value={doctor.doctor_id}>
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {doctor.name} {doctor.specialty && `- ${doctor.specialty}`}
                </Space>
              </Option>
            ))}
          </Select>
          
          <DatePicker
            value={dayjs(selectedDate)}
            onChange={(date) => setSelectedDate(date?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'))}
            style={{ width: 200 }}
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableSlots.map((slot, index) => (
            <Card
              key={index}
              size="small"
              className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <div>
                      <div className="font-semibold text-sm">{slot.doctor_name}</div>
                      {slot.specialty && (
                        <div className="text-xs text-gray-500">{slot.specialty}</div>
                      )}
                    </div>
                  </div>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Available
                  </Tag>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <ClockCircleOutlined />
                  <span className="font-medium">{slot.time_slot}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {dayjs(slot.date).format('MMMM D, YYYY')}
                </div>
                
                <Button 
                  type="primary" 
                  size="small" 
                  block
                  onClick={() => handleBookAppointment(slot)}
                >
                  Book Appointment
                </Button>
              </div>
            </Card>
          ))}
          
          {availableSlots.length === 0 && !loading && (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No available slots for selected date and doctor
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DoctorTimeSlots;