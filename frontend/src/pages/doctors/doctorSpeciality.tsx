import React, { useState, useEffect } from "react";
import { Eye, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

import { getDoctorsWithSpecialities, getAllDoctorNames, assignSpecialityToDoctor } from '@/services/doctorServices';
import { getAllSpecialities } from '@/services/specialityServices';
import { hasAnyRole } from '@/services/roleGuard';
import { Role } from '@/services/utils';

type DoctorSpecialtyHistory = {
  name: string;
  added_at: string;
};

type Doctor = {
  doctor_id: number;
  name: string;
  specialties: DoctorSpecialtyHistory[];
  branch: string | null;
  added_at: string | null;
};

const DoctorSpeciality: React.FC = () => {
  const canManage = hasAnyRole([Role.BRANCH_MANAGER, Role.SUPER_ADMIN]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [assignOpen, setAssignOpen] = useState<boolean>(false);
  const [availableSpecialities, setAvailableSpecialities] = useState<{ speciality_id: number; speciality_name: string }[]>([]);
  const [selectedAssignSpeciality, setSelectedAssignSpeciality] = useState<number | null>(null);
  const [assignGlobalOpen, setAssignGlobalOpen] = useState<boolean>(false);
  const [availableDoctorNames, setAvailableDoctorNames] = useState<{ doctor_id: number; name: string }[]>([]);
  const [selectedAssignDoctorId, setSelectedAssignDoctorId] = useState<number | null>(null);

  // Unique specialties and branches for dropdowns
  const specialties = Array.from(
    new Set(doctors.flatMap((d) => d.specialties.map((s) => s.name)))
  );
  const branches = Array.from(new Set(doctors.map((d) => d.branch ?? "Unknown")));

  useEffect(() => {
    let filtered = doctors;

    // Filter by name
    if (searchName.trim()) {
      filtered = filtered.filter((d) =>
        d.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "All") {
      filtered = filtered.filter((d) =>
        d.specialties.some((s) => s.name === selectedSpecialty)
      );
    }

    // Filter by branch
    if (selectedBranch !== "All") {
      filtered = filtered.filter((d) => d.branch === selectedBranch);
    }

    setFilteredDoctors(filtered);
  }, [searchName, selectedSpecialty, selectedBranch, doctors]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDoctorsWithSpecialities();
        setDoctors(
          data.doctors.map((d) => ({
            doctor_id: d.doctor_id,
            name: d.name,
            specialties: d.specialties.map((s) => ({ name: s.name, added_at: s.added_at })),
            branch: d.branch ?? null,
            added_at: d.added_at ?? null,
          }))
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        console.error('Failed to fetch doctors with specialities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // fetch speciality options
    const fetchSpecialities = async () => {
      try {
        const res = await getAllSpecialities();
        setAvailableSpecialities(res.specialities || []);
      } catch (err) {
        console.error('Failed to load specialities for assign dialog', err);
      }
    };
    fetchSpecialities();
    // fetch doctor names for global assign
    const fetchDoctorNames = async () => {
      try {
        const res = await getAllDoctorNames();
        setAvailableDoctorNames(res.doctors || []);
      } catch (err) {
        console.error('Failed to load doctor names for assign dialog', err);
      }
    };
    fetchDoctorNames();
  }, []);

  const handleAssign = async () => {
    if (!selectedDoctor || !selectedAssignSpeciality) return;
    try {
      await assignSpecialityToDoctor(selectedDoctor.doctor_id, selectedAssignSpeciality);
      // refresh doctors
      const data = await getDoctorsWithSpecialities();
      setDoctors(
        data.doctors.map((d) => ({
          doctor_id: d.doctor_id,
          name: d.name,
          specialties: d.specialties.map((s) => ({ name: s.name, added_at: s.added_at })),
          branch: d.branch ?? null,
          added_at: d.added_at ?? null,
        }))
      );
      setAssignOpen(false);
      setSelectedAssignSpeciality(null);
    } catch (err) {
      console.error('Failed to assign speciality:', err);
      alert(String(err));
    }
  };

  const handleGlobalAssign = async () => {
    if (!selectedAssignDoctorId || !selectedAssignSpeciality) return;
    try {
      await assignSpecialityToDoctor(selectedAssignDoctorId, selectedAssignSpeciality);
      // refresh doctors
      const data = await getDoctorsWithSpecialities();
      setDoctors(
        data.doctors.map((d) => ({
          doctor_id: d.doctor_id,
          name: d.name,
          specialties: d.specialties.map((s) => ({ name: s.name, added_at: s.added_at })),
          branch: d.branch ?? null,
          added_at: d.added_at ?? null,
        }))
      );
      setAssignGlobalOpen(false);
      setSelectedAssignDoctorId(null);
      setSelectedAssignSpeciality(null);
    } catch (err) {
      console.error('Failed to assign speciality:', err);
      alert(String(err));
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex-1 text-center">
        <h2 className="text-lg font-medium">All Doctors</h2>
        <div className="text-sm text-muted-foreground mt-2">{doctors.length} items</div>
      </div>
      <div className="grid gap-4 grid-cols-6 mb-4">
        <div className="flex justify-between place-items-center mb-4 place-self-end col-span-5">
          {canManage && (
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setAssignGlobalOpen(true)}>Assign New</Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Doctor name search */}
          <input
            type="text"
            placeholder="Search doctor by name..."
            className="rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          {/* Specialty dropdown */}
          <Select
            value={selectedSpecialty}
            onValueChange={setSelectedSpecialty}
          >
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="Select Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Specialties</SelectItem>
              {specialties.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Branch dropdown */}
          <Select
            value={selectedBranch}
            onValueChange={setSelectedBranch}
          >
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Branches</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Doctor cards */}
      {
        (() => {
          if (loading) return <div>Loading doctors...</div>;
          if (error) return <div className="text-red-600">Error: {error}</div>;
          if (filteredDoctors.length === 0) {
            return (
              <div className="p-6 bg-muted rounded text-center">
                {doctors.length === 0 ? 'No doctors available.' : 'No results found for the current filters.'}
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map((doctor) => (
                <article
                  key={doctor.doctor_id}
                  className={`bg-card p-4 rounded-lg shadow-sm border border-border flex flex-col justify-between ${canManage ? 'hover:shadow-md hover:translate-y-[-2px] transition-all cursor-pointer' : ''}`}
                  onClick={canManage ? () => setSelectedDoctor(doctor) : undefined}
                >
                  <div>
                    <h3 className="text-base font-semibold">{doctor.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {doctor.specialties.map((s) => (
                        <span
                          key={s.name}
                          className="bg-teal-200 dark:bg-teal-700 text-teal-800 dark:text-teal-200 px-2 py-0.5 rounded text-sm"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <div>#{doctor.doctor_id}</div>
                    {canManage && (
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doctor); setAssignOpen(true); }}>
                          <Pen />
                        </Button>
                        <Button size="icon" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doctor); }}>
                          <Eye />
                        </Button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          );
        })()
      }

      {/* Doctor Details Popup */}
      {canManage && selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedDoctor.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-2">
              <p><strong>Branch:</strong> {selectedDoctor.branch ?? '—'}</p>
              <p>
                <strong>Added On:</strong>{' '}
                {selectedDoctor.added_at ? new Date(selectedDoctor.added_at).toLocaleDateString() : '—'}
              </p>
              <p><strong>Specialties:</strong></p>
              <ul className="list-disc pl-5">
                {selectedDoctor.specialties.map((s) => (
                  <li key={s.name}>
                    {s.name} — Added on {s.added_at ? new Date(s.added_at).toLocaleDateString() : '—'}
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={() => setSelectedDoctor(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Speciality Dialog */}
      {canManage && selectedDoctor && assignOpen && (
        <Dialog open={assignOpen} onOpenChange={() => setAssignOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Speciality to {selectedDoctor.name}</DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <Label className="mb-2">Select Speciality</Label>
              <Select
                value={selectedAssignSpeciality ? String(selectedAssignSpeciality) : ''}
                onValueChange={(val) => setSelectedAssignSpeciality(val ? Number(val) : null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- select --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- select --</SelectItem>
                  {availableSpecialities.map((s) => (
                    <SelectItem key={s.speciality_id} value={String(s.speciality_id)}>{s.speciality_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setAssignOpen(false)}>Cancel</Button>
              <Button onClick={handleAssign} disabled={!selectedAssignSpeciality}>Assign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Global Assign Dialog */}
      {canManage && assignGlobalOpen && (
        <Dialog open={assignGlobalOpen} onOpenChange={() => setAssignGlobalOpen(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Speciality to Doctor</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-3">
              <div>
                <Label className="block text-sm mb-1">Select Doctor</Label>
                <Select
                  value={selectedAssignDoctorId ? String(selectedAssignDoctorId) : ''}
                  onValueChange={(val) => setSelectedAssignDoctorId(val ? Number(val) : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDoctorNames.map(d => (
                      <SelectItem key={d.doctor_id} value={String(d.doctor_id)}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block text-sm mb-1">Select Speciality</Label>
                <Select
                  value={selectedAssignSpeciality ? String(selectedAssignSpeciality) : ''}
                  onValueChange={(val) => setSelectedAssignSpeciality(val ? Number(val) : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select speciality" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpecialities.map(s => (
                      <SelectItem key={s.speciality_id} value={String(s.speciality_id)}>{s.speciality_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setAssignGlobalOpen(false)}>Cancel</Button>
              <Button onClick={handleGlobalAssign} disabled={!selectedAssignDoctorId || !selectedAssignSpeciality}>Assign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DoctorSpeciality;
