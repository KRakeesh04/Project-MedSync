import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, BarChart3, Users, DollarSign, Stethoscope, Shield, Calendar } from 'lucide-react';
import { 
  getBranchAppointmentSummary,
  getDoctorRevenueReport,
  getPatientsOutstandingBalances,
  getTreatmentsByCategory,
  getInsuranceVsOutOfPocket,
  getAllBranches,
  getAllDoctors,
  getAllSpecialities,
  getAllInsuranceTypes,
  type ReportFilters 
} from '../services/reportsServices.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Helper function to get first day of current month in YYYY-MM-DD format
const getFirstDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('branch-appointments');
  const [loading, setLoading] = useState(false);
  const [dropdownsLoading, setDropdownsLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilters>({
    start_date: getFirstDayOfMonth(),
    end_date: getCurrentDate(),
    branch_id: -1,
    doctor_id: -1,
    speciality_id: -1,
    insurance_id: -1,
  });

  const [reportData, setReportData] = useState<any[]>([]);
  const [branches, setBranches] = useState<{id: number, name: string}[]>([{ id: -1, name: 'All Branches' }]);
  const [doctors, setDoctors] = useState<{id: number, name: string}[]>([{ id: -1, name: 'All Doctors' }]);
  const [specialities, setSpecialities] = useState<{id: number, name: string}[]>([{ id: -1, name: 'All Specialities' }]);
  const [insuranceTypes, setInsuranceTypes] = useState<{id: number, name: string}[]>([{ id: -1, name: 'All Types' }]);

  const handleFilterChange = (key: keyof ReportFilters, value: string | number) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let data: any[] = [];
      
      switch (activeTab) {
        case 'branch-appointments':
          data = await getBranchAppointmentSummary(filters);
          break;
        case 'doctor-revenue':
          data = await getDoctorRevenueReport(filters);
          break;
        case 'outstanding-balances':
          data = await getPatientsOutstandingBalances(filters);
          break;
        case 'treatments-category':
          data = await getTreatmentsByCategory(filters);
          break;
        case 'insurance-outofpocket':
          data = await getInsuranceVsOutOfPocket(filters);
          break;
        default:
          data = [];
      }
      
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    setDropdownsLoading(true);
    try {
      const [branchesData, doctorsData, specialitiesData, insuranceData] = await Promise.all([
        getAllBranches(),
        getAllDoctors(),
        getAllSpecialities(),
        getAllInsuranceTypes()
      ]);

      console.log('Dropdown data:', { branchesData, doctorsData, specialitiesData, insuranceData });

      setBranches(prev => [...prev, ...branchesData]);
      setDoctors(prev => [...prev, ...doctorsData]);
      setSpecialities(prev => [...prev, ...specialitiesData]);
      setInsuranceTypes(prev => [...prev, ...insuranceData]);
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    } finally {
      setDropdownsLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [activeTab]);

  const renderReportTable = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading report data...</p>
        </div>
      );
    }

    if (reportData.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No data found for the selected filters.</p>
        </div>
      );
    }

    const headers = Object.keys(reportData[0]);
    
    return (
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {headers.map(header => (
                  <th key={header} className="p-4 text-left font-medium capitalize whitespace-nowrap">
                    {header.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                  {headers.map(header => (
                    <td key={header} className="p-4 whitespace-nowrap">
                      {typeof row[header] === 'number' && 
                       (header.includes('amount') || header.includes('revenue') || header.includes('fee') || header.includes('balance'))
                        ? `$${row[header].toFixed(2)}`
                        : typeof row[header] === 'number'
                        ? row[header]
                        : row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getReportTitle = (tab: string) => {
    const titles: { [key: string]: string } = {
      'branch-appointments': 'Branch-wise Appointment Summary',
      'doctor-revenue': 'Doctor Revenue Report',
      'outstanding-balances': 'Patients with Outstanding Balances',
      'treatments-category': 'Treatments by Category',
      'insurance-outofpocket': 'Insurance vs Out-of-Pocket Payments'
    };
    return titles[tab] || 'Report';
  };

  const getReportDescription = (tab: string) => {
    const descriptions: { [key: string]: string } = {
      'branch-appointments': 'Daily appointment breakdown by branch and status',
      'doctor-revenue': 'Revenue analysis by doctor including completed appointments',
      'outstanding-balances': 'Patients with outstanding payment balances and unpaid invoices',
      'treatments-category': 'Treatment statistics by medical speciality',
      'insurance-outofpocket': 'Insurance coverage vs out-of-pocket payments analysis'
    };
    return descriptions[tab] || 'Report data';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive reports for business intelligence and analysis
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={filters.branch_id.toString()}
                onValueChange={(value) => handleFilterChange('branch_id', parseInt(value))}
                disabled={dropdownsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={dropdownsLoading ? "Loading..." : "Select branch"} />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchReportData} className="w-full" disabled={loading}>
                {loading ? 'Loading...' : 'Apply Filters'}
              </Button>
            </div>
          </div>

          {/* Additional filters based on active tab */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {activeTab === 'doctor-revenue' && (
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select
                  value={filters.doctor_id.toString()}
                  onValueChange={(value) => handleFilterChange('doctor_id', parseInt(value))}
                  disabled={dropdownsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={dropdownsLoading ? "Loading..." : "Select doctor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === 'treatments-category' && (
              <div className="space-y-2">
                <Label htmlFor="speciality">Speciality</Label>
                <Select
                  value={filters.speciality_id.toString()}
                  onValueChange={(value) => handleFilterChange('speciality_id', parseInt(value))}
                  disabled={dropdownsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={dropdownsLoading ? "Loading..." : "Select speciality"} />
                  </SelectTrigger>
                  <SelectContent>
                    {specialities.map((speciality) => (
                      <SelectItem key={speciality.id} value={speciality.id.toString()}>
                        {speciality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === 'insurance-outofpocket' && (
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Type</Label>
                <Select
                  value={filters.insurance_id.toString()}
                  onValueChange={(value) => handleFilterChange('insurance_id', parseInt(value))}
                  disabled={dropdownsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={dropdownsLoading ? "Loading..." : "Select insurance type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceTypes.map((insurance) => (
                      <SelectItem key={insurance.id} value={insurance.id.toString()}>
                        {insurance.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="branch-appointments" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="doctor-revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger value="outstanding-balances" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Balances</span>
          </TabsTrigger>
          <TabsTrigger value="treatments-category" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Treatments</span>
          </TabsTrigger>
          <TabsTrigger value="insurance-outofpocket" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Insurance</span>
          </TabsTrigger>
        </TabsList>

        {['branch-appointments', 'doctor-revenue', 'outstanding-balances', 'treatments-category', 'insurance-outofpocket'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{getReportTitle(tab)}</CardTitle>
                <CardDescription>
                  {getReportDescription(tab)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderReportTable()}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}