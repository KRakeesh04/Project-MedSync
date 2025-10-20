import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getFullPatientDetails } from '@/services/patientServices';
import { formatDate, toDisplayDate } from '@/services/utils';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PatientFullDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [searchId, setSearchId] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);

  useEffect(() => {
    const statePatientId = (location as any)?.state?.patientId;
    const targetId = id ?? statePatientId;
    if (!targetId) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getFullPatientDetails(Number(targetId));
        if (res && res.patient && Array.isArray(res.patient)) {
          res.patient = res.patient[0] ?? null;
        }
        setData(res);
        setSearched(true);
      } catch (err: any) {
        setError(err?.message || String(err));
        setData(null);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    setLoading(true);
    setError(null);
    setSearched(false);
    try {
      const res = await getFullPatientDetails(Number(searchId));
      if (res && res.patient && Array.isArray(res.patient)) {
        res.patient = res.patient[0] ?? null;
      }
      setData(res);
      setSearched(true);
    } catch (err: any) {
      setError(err?.message || String(err));
      setData(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="space-y-6">
        <PageTitle title="Patient Details" />
        <form onSubmit={onSearch} className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Enter patient ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className='px-3 py-2 border rounded w-48'
          />
          <Button variant={"default"} >Search</Button>
        </form>

        {loading && <div>Loading patient details...</div>}
        {error && searched && <div className="text-red-600">{error}</div>}
        {!loading && searched && !data && !error && <div>No data</div>}

        {!loading && data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* left column: personal info */}
            <div className="md:col-span-1">
              <section className="p-4 border rounded text-left">
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <div className="space-y-1">
                  <div><span className="font-medium">ID:</span> {data.patient.patient_id}</div>
                  <div><span className="font-medium">Name:</span> {data.patient.name}</div>
                  <div><span className="font-medium">Gender:</span> {data.patient.gender}</div>
                  <div><span className="font-medium">DOB:</span> {toDisplayDate(data.patient.date_of_birth)}</div>
                  <div><span className="font-medium">NIC:</span> {data.patient.nic}</div>
                  <div><span className="font-medium">Contact:</span> {data.patient.emergency_contact_no}</div>
                  <div><span className="font-medium">Address:</span> {data.patient.address}</div>
                  <div><span className="font-medium">Blood type:</span> {data.patient.blood_type}</div>
                </div>
              </section>
            </div>

            {/* right column: appointments, meds, history (span 2 columns on md) */}
            <div className="md:col-span-2 space-y-4">
              <section className="p-4 border rounded text-left">
                <h3 className="font-semibold mb-2">Appointments</h3>
                {Array.isArray(data.appointments) && data.appointments.length > 0 ? (
                  <ul className="pl-0">
                    {data.appointments.map((a: any) => (
                      <li key={a.appointment_id} className="py-2 border-b last:border-b-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm">
                            <span className="font-medium">{formatDate(String(a.date))}</span>
                            <span className="ml-2">{a.time_slot}</span>
                            <div className="text-slate-600 text-sm">{a.name ?? `Doctor ${a.doctor_id}`}</div>
                          </div>
                          {a.status ? <div className="mt-2 sm:mt-0"><span className="inline-block text-sm px-2 py-0.5 rounded bg-slate-100 text-slate-700">{a.status}</span></div> : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No appointments</div>
                )}
              </section>

              <section className="p-4 border rounded text-left">
                <h3 className="font-semibold mb-2">Medications / Prescriptions</h3>
                {Array.isArray(data.medications) && data.medications.length > 0 ? (
                  <ul className="pl-0">
                    {data.medications.map((m: any) => (
                      <li key={`${m.appointment_id}-${m.prescribed_at}`} className="py-2 border-b last:border-b-0">
                        <div className="text-sm"><span className="font-medium">{formatDate(m.prescribed_at)}</span> — {m.prescription_items_details}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No medications</div>
                )}
              </section>

              <section className="p-4 border rounded text-left">
                <h3 className="font-semibold mb-2">Medical History</h3>
                {Array.isArray(data.medicalHistories) && data.medicalHistories.length > 0 ? (
                  <ul className="pl-0">
                    {data.medicalHistories.map((h: any) => (
                      <li key={h.medical_history_id} className="py-2 border-b last:border-b-0">
                        <div className="text-sm"><span className="font-medium">{formatDate(h.visit_date)}</span> — {h.diagnosis} — {h.notes}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No medical history</div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div>Loading patient details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div>No data</div>;

  // normalize patient for rendering
  const patientObj = data && data.patient ? (Array.isArray(data.patient) ? data.patient[0] : data.patient) : null;
  const appointments = data?.appointments ?? [];
  const medications = data?.medications ?? [];
  const medicalHistories = data?.medicalHistories ?? [];

  return (
    <div className="space-y-6">
      <PageTitle title={`Patient: ${patientObj?.name ?? 'Unknown'}${patientObj?.patient_id ? ` (ID: ${patientObj.patient_id})` : ''}`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="md:col-span-1">
          <section className="p-4 border rounded text-left">
            <h3 className="font-semibold mb-2">Personal Information</h3>
            <div className="space-y-1">
              <div><span className="font-medium">ID:</span> {patientObj?.patient_id ?? '—'}</div>
              <div><span className="font-medium">Name:</span> {patientObj?.name ?? '—'}</div>
              <div><span className="font-medium">Gender:</span> {patientObj?.gender ?? '—'}</div>
              <div><span className="font-medium">DOB:</span> {toDisplayDate(patientObj?.date_of_birth ?? '') ?? '—'}</div>
              <div><span className="font-medium">NIC:</span> {patientObj?.nic ?? '—'}</div>
              <div><span className="font-medium">Contact:</span> {patientObj?.emergency_contact_no ?? '—'}</div>
              <div><span className="font-medium">Address:</span> {patientObj?.address ?? '—'}</div>
              <div><span className="font-medium">Blood type:</span> {patientObj?.blood_type ?? '—'}</div>
            </div>
          </section>
        </div>

        <div className="md:col-span-2 space-y-4">
          <section className="p-4 border rounded text-left">
            <h3 className="font-semibold mb-2">Appointments</h3>
            {Array.isArray(appointments) && appointments.length > 0 ? (
              <ul className="pl-0">
                {appointments.map((a: any) => (
                  <li key={a.appointment_id} className="py-2 border-b last:border-b-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm">
                        <span className="font-medium">{formatDate(String(a.date))}</span>
                        <span className="ml-2">{a.time_slot}</span>
                        <div className="text-slate-600 text-sm">{a.name ?? `Doctor ${a.doctor_id}`}</div>
                      </div>
                      {a.status ? <div className="mt-2 sm:mt-0"><span className="inline-block text-sm px-2 py-0.5 rounded bg-slate-100 text-slate-700">{a.status}</span></div> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No appointments</div>
            )}
          </section>

          <section className="p-4 border rounded text-left">
            <h3 className="font-semibold mb-2">Medications / Prescriptions</h3>
            {Array.isArray(medications) && medications.length > 0 ? (
              <ul className="pl-0">
                {medications.map((m: any) => (
                  <li key={`${m.appointment_id}-${m.prescribed_at}`} className="py-2 border-b last:border-b-0">
                    <div className="text-sm"><span className="font-medium">{formatDate(m.prescribed_at)}</span> — {m.prescription_items_details}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No medications</div>
            )}
          </section>

          <section className="p-4 border rounded text-left">
            <h3 className="font-semibold mb-2">Medical History</h3>
            {Array.isArray(medicalHistories) && medicalHistories.length > 0 ? (
              <ul className="pl-0">
                {medicalHistories.map((h: any) => (
                  <li key={h.medical_history_id} className="py-2 border-b last:border-b-0">
                    <div className="text-sm"><span className="font-medium">{formatDate(h.visit_date)}</span> — {h.diagnosis} — {h.notes}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No medical history</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
