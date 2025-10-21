import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LOCAL_STORAGE__USER } from "@/services/authServices";
import { useTheme } from "@/components/theme-provider";

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE__USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [emailNotif, setEmailNotif] = React.useState(true);
  const [smsNotif, setSmsNotif] = React.useState(false);

  return (
    <div className="grid gap-6 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how MedSync looks on your device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Theme</Label>
              <div className="text-sm text-muted-foreground">Current: {theme ?? "system"}</div>
            </div>
            <div className="flex gap-2">
              <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>Light</Button>
              <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>Dark</Button>
              <Button variant={!theme || theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>System</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control how you get notified about activity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Email notifications</Label>
              <div className="text-sm text-muted-foreground">Receive updates and alerts via email.</div>
            </div>
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">SMS notifications</Label>
              <div className="text-sm text-muted-foreground">Get important alerts via SMS.</div>
            </div>
            <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => alert("Preferences saved (placeholder)")}>Save preferences</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Basic account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">Signed in as</div>
          <div className="font-medium">{user?.email ?? user?.username ?? "—"}</div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={() => alert("Change password (placeholder)")}>Change password</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SettingsPage;
