import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LOCAL_STORAGE__ROLE, LOCAL_STORAGE__USER } from "@/services/authServices";

const initials = (name?: string) => {
  if (!name) return "U";
  const parts = String(name).trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last || first || "U").toUpperCase();
};

const safe = (v: unknown, fallback: string = "—") => (v === undefined || v === null || v === "" ? fallback : String(v));

const ProfilePage: React.FC = () => {
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE__USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const role = localStorage.getItem(LOCAL_STORAGE__ROLE) ?? "Unknown";

  const username = safe(user?.username);
  const fullname = safe(user?.fullname ?? user?.name ?? user?.username);
  const email = safe(user?.email);
  const userId = safe(user?.user_id);
  const branchId = safe(user?.branch_id);
  const nic = safe(user?.nic);

  return (
    <div className="grid gap-6 w-full max-w-5xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials(fullname)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{fullname}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground">@{username}</span>
              <Badge variant="secondary">{role}</Badge>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>Basic information associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">User ID</div>
              <div className="font-medium">{userId}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Branch ID</div>
              <div className="font-medium">{branchId}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">NIC</div>
              <div className="font-medium">{nic}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
