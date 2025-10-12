// src/pages/appointments/AllAppointments.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Input, Select, Card, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

interface Appointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  patient_note: string;
  date: string;
  time_slot: string;
  status: string;
  time_stamp: string;
  patient_name?: string;
  doctor_name?: string;
}

const AllAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'appointment_id',
      key: 'appointment_id',
      width: 80,
    },
    {
      title: 'Patient',
      dataIndex: 'patient_name',
      key: 'patient_name',
      render: (text: string, record: Appointment) => text || `Patient ${record.patient_id}`,
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
      render: (text: string, record: Appointment) => text || `Doctor ${record.doctor_id}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Time Slot',
      dataIndex: 'time_slot',
      key: 'time_slot',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = 
          status === 'Confirmed' ? 'green' :
          status === 'Pending' ? 'orange' :
          status === 'Completed' ? 'blue' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Notes',
      dataIndex: 'patient_note',
      key: 'patient_note',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Appointment) => (
        <Popconfirm
          title="Delete Appointment"
          description="Are you sure you want to delete this appointment?"
          onConfirm={() => handleDelete(record.appointment_id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setAppointments(prev => prev.filter(appointment => appointment.appointment_id !== id));
        message.success('Appointment deleted successfully');
      } else {
        message.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      message.error('Failed to delete appointment');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const patientName = appointment.patient_name || `Patient ${appointment.patient_id}`;
    const doctorName = appointment.doctor_name || `Doctor ${appointment.doctor_id}`;
    
    const matchesSearch = patientName.toLowerCase().includes(searchText.toLowerCase()) ||
                         doctorName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        All Appointments
      </h1>

      <Card>
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search patients or doctors..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">All Status</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAppointments}
          rowKey="appointment_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} appointments`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default AllAppointments;