// src/pages/appointments/AddAppointment.tsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, message, Space } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface Doctor {
  doctor_id: number;
  name: string;
  specialty?: string;
}

const AddAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsRes = await fetch('http://localhost:3001/api/doctors');
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        message.error('Failed to fetch doctors');
      }
    };

    fetchDoctors();
  }, []);

  // Pre-fill form with URL parameters
  useEffect(() => {
    const doctorId = searchParams.get('doctor_id');
    const date = searchParams.get('date');
    const timeSlot = searchParams.get('time_slot');

    if (doctorId || date || timeSlot) {
      form.setFieldsValue({
        doctor_id: doctorId ? parseInt(doctorId) : undefined,
        date: date ? dayjs(date) : undefined,
        time_slot: timeSlot || undefined
      });
    }
  }, [searchParams, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const appointmentData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        status: 'Pending',
        time_stamp: new Date().toISOString()
      };

      const response = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        message.success('Appointment created successfully!');
        navigate('/appointments');
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      message.error('Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  // Common time slots
  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Appointment
        </h1>
        <Button onClick={() => navigate('/appointments')}>
          Back to Appointments
        </Button>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="patient_name"
              label="Patient Name"
              rules={[{ required: true, message: 'Please enter patient name' }]}
            >
              <Input 
                placeholder="Enter patient full name"
                prefix={<UserOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="patient_contact"
              label="Patient Contact"
              rules={[{ required: true, message: 'Please enter patient contact' }]}
            >
              <Input 
                placeholder="Enter phone number or email"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="doctor_id"
              label="Doctor"
              rules={[{ required: true, message: 'Please select a doctor' }]}
            >
              <Select
                placeholder="Select doctor"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {doctors.map(doctor => (
                  <Option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.name} {doctor.specialty && `- ${doctor.specialty}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Appointment Date"
              rules={[{ required: true, message: 'Please select date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="time_slot"
              label="Time Slot"
              rules={[{ required: true, message: 'Please select time slot' }]}
            >
              <Select placeholder="Select time slot">
                {timeSlots.map(slot => (
                  <Option key={slot} value={slot}>{slot}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="patient_age"
              label="Patient Age"
              rules={[{ required: true, message: 'Please enter patient age' }]}
            >
              <Input 
                type="number"
                placeholder="Enter age"
                min={0}
                max={120}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="patient_note"
            label="Patient Notes"
          >
            <TextArea
              rows={3}
              placeholder="Enter any notes or symptoms..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Appointment
              </Button>
              <Button onClick={() => navigate('/appointments')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddAppointment;