import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud } from "lucide-react";
import {
  downloadBranchDailyAppointmentsCsv,
  downloadDoctorRevenueCsv,
  downloadInsuranceVsOutOfPocketCsv,
  downloadOutstandingBalancesCsv,
  downloadTreatmentsPerCategoryCsv,
} from "@/services/reportsServices";

// no direct backend url usage; services handle requests

export default function Reports() {

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      <Card className="bg-neutral-900 border border-neutral-800">
        <CardHeader>
          <CardTitle>Branch-wise Appointment Summary (Daily)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Download daily summary per branch with optional filters via query params: start, end, branchId, status.</p>
          <div className="flex gap-2">
            <Button className="cursor-pointer" onClick={() => downloadBranchDailyAppointmentsCsv()}>
              <DownloadCloud className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border border-neutral-800">
        <CardHeader>
          <CardTitle>Doctor-wise Revenue Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="cursor-pointer" onClick={() => downloadDoctorRevenueCsv()}>
            <DownloadCloud className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border border-neutral-800">
        <CardHeader>
          <CardTitle>Patients with Outstanding Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="cursor-pointer" onClick={() => downloadOutstandingBalancesCsv()}>
            <DownloadCloud className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border border-neutral-800">
        <CardHeader>
          <CardTitle>Treatments per Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => downloadTreatmentsPerCategoryCsv()}>
            <DownloadCloud className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border border-neutral-800">
        <CardHeader>
          <CardTitle>Insurance vs Out-of-Pocket</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="cursor-pointer" onClick={() => downloadInsuranceVsOutOfPocketCsv()}>
            <DownloadCloud className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
