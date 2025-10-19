import { useState } from 'react';
import PageTitle from "@/components/PageTitle";

type DoctorCard = {
  id: number;
  name: string;
  speciality?: string;
  patientsCount: number;
  lastVisit?: string;
};

export default function DoctorsPatientsHistory() {
  // Sample static data — replace with backend call later
  const [doctors] = useState<DoctorCard[]>([
    { id: 1, name: 'Dr. Aisha Fernando', speciality: 'General Physician', patientsCount: 124, lastVisit: '2025-10-18' },
    { id: 2, name: 'Dr. Nimal Perera', speciality: 'Pediatrics', patientsCount: 78, lastVisit: '2025-10-19' },
    { id: 3, name: 'Dr. Sunil Jayawardena', speciality: 'Cardiology', patientsCount: 52, lastVisit: '2025-10-15' },
    { id: 4, name: 'Dr. Maya Senanayake', speciality: 'Dermatology', patientsCount: 33, lastVisit: '2025-10-17' },
  ]);

  return (
    <div className="space-y-6">
      <PageTitle title="Doctors — Patients Overview" />

      <div>
        <h2 className="text-lg font-medium">All Doctors ({doctors.length})</h2>

        {doctors.length === 0 ? (
          <p>No doctors available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {doctors.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-semibold">{doc.name}</h3>
                    {doc.speciality && <p className="text-sm text-muted-foreground">{doc.speciality}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{doc.patientsCount}</div>
                    <div className="text-xs text-muted-foreground">patients</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <div>Last visit: {doc.lastVisit ?? '—'}</div>
                  <button
                    onClick={() => console.log('Open patients for', doc.id)}
                    className="px-3 py-1 rounded bg-primary text-white text-sm"
                  >
                    View Patients
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}