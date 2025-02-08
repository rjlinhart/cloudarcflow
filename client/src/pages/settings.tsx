import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <div className="container py-8">
      <head>
        <title>Settings</title>
      </head>
      <div className="flex items-center gap-2 mb-8">
        <SettingsIcon className="h-8 w-8" />
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Cloud Provider Integration</CardTitle>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <CardDescription>
              Configure your cloud provider credentials for future environment deployments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aws-key">AWS Access Key</Label>
              <Input 
                id="aws-key" 
                type="password" 
                placeholder="Enter AWS access key" 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aws-secret">AWS Secret Key</Label>
              <Input 
                id="aws-secret" 
                type="password" 
                placeholder="Enter AWS secret key" 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gcp-key">Google Cloud Key</Label>
              <Input 
                id="gcp-key" 
                type="password" 
                placeholder="Enter Google Cloud key" 
                disabled 
              />
            </div>
            <Button disabled>Save API Keys</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Notification Email</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <Button>Update Email</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
