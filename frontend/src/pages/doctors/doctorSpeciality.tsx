import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DoctorSpecialtyHistory = {
  name: string;
  added_at: string;
};

type Doctor = {
  doctor_id: number;
  name: string;
  specialties: DoctorSpecialtyHistory[];
  branch: string;
  added_at: string;
};

const sampleDoctors: Doctor[] = [
  {
    doctor_id: 1,
    name: "Dr. John Doe",
    specialties: [
      { name: "Cardiology", added_at: "2025-05-10" },
      { name: "Neurology", added_at: "2025-08-01" },
    ],
    branch: "Colombo Central",
    added_at: "2025-05-10",
  },
  {
    doctor_id: 2,
    name: "Dr. Jane Roe",
    specialties: [
      { name: "Pediatrics", added_at: "2025-06-12" },
      { name: "Dermatology", added_at: "2025-07-01" },
    ],
    branch: "Kandy Main",
    added_at: "2025-06-12",
  },
  {
    doctor_id: 3,
    name: "Dr. Sam Smith",
    specialties: [
      { name: "Cardiology", added_at: "2025-06-15" },
      { name: "Dermatology", added_at: "2025-08-20" },
    ],
    branch: "Galle Clinic",
    added_at: "2025-06-15",
  },
];

const DoctorSpeciality: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(sampleDoctors);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(sampleDoctors);
  const [searchName, setSearchName] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedBranch, setSelectedBranch] = useState<string>("All");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Unique specialties and branches for dropdowns
  const specialties = Array.from(
    new Set(doctors.flatMap((d) => d.specialties.map((s) => s.name)))
  );
  const branches = Array.from(new Set(doctors.map((d) => d.branch)));

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

  return (
    <div className="space-y-6 p-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-medium">Doctors</h2>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <article
            key={doctor.doctor_id}
            className="bg-card p-4 rounded-lg shadow-sm border border-border flex flex-col justify-between hover:shadow-md hover:translate-y-[-2px] transition-all cursor-pointer"
            onClick={() => setSelectedDoctor(doctor)}
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
              <Button size="icon" variant="outline" onClick={() => setSelectedDoctor(doctor)}>
                <Eye />
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Doctor Details Popup */}
      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedDoctor.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-2">
              <p><strong>Branch:</strong> {selectedDoctor.branch}</p>
              <p><strong>Added On:</strong> {new Date(selectedDoctor.added_at).toLocaleDateString()}</p>
              <p><strong>Specialties:</strong></p>
              <ul className="list-disc pl-5">
                {selectedDoctor.specialties.map((s) => (
                  <li key={s.name}>
                    {s.name} — Added on {new Date(s.added_at).toLocaleDateString()}
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
    </div>
  );
};

export default DoctorSpeciality;
