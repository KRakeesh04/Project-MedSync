import { useEffect, useState } from 'react';
import { getDoctorsPatientsOverview } from '@/services/doctorServices';
import { formatDate } from '@/services/utils';
import { Link, useNavigate } from 'react-router-dom';

type DoctorCard = {
  doctor_id: number;
  name: string;
  speciality?: string | null;
  patientsCount: number;
  lastVisit?: string | null;
  lastPatientName?: string | null;
  lastPatientId?: number | null;
};

export default function DoctorsPatientsHistory() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDoctorsPatientsOverview();
        setDoctors(data.doctors.map((d: any) => ({
          doctor_id: d.doctor_id,
          name: d.name,
          speciality: d.speciality ?? null,
          patientsCount: Number(d.patientsCount) || 0,
          lastVisit: d.lastVisit ?? null,
          lastPatientName: d.lastPatientName ?? null,
          lastPatientId: d.lastPatientId ?? null,
        })));
      } catch (err: any) {
        const msg = typeof err === 'string' ? err : (err?.message || 'Failed to load doctors data');

        if (String(msg).includes('Please provide a valid doctor ID')) {
          // console.warn('Backend returned missing doctor id message; showing empty list instead.', err);
          setDoctors([]);
          setError(null);
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">All Doctors </h2>
        <p className="text-sm text-muted-foreground">Overview of all doctors and their patients</p>
        <p className="text-sm text-muted-foreground">{doctors.length} items</p>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : doctors.length === 0 ? (
          <p>No doctors available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {doctors.map((doc) => (
              <div key={doc.doctor_id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
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
                  <div>
                    <div>Last visit: {formatDate(String(doc.lastVisit)) ?? '—'}</div>
                    {doc.lastPatientName && (
                      <div className="text-sm">
                        Last patient: {doc.lastPatientId ? (
                          <button
                            onClick={() => navigate('/patients/full', { state: { patientId: doc.lastPatientId } })}
                            className="text-primary underline cursor-pointer"
                          >
                            {doc.lastPatientName}
                          </button>
                        ) : (
                          <span>{doc.lastPatientName}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-primary underline">
                    <Link to={`/current-patients`}>
                      View Patients
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}