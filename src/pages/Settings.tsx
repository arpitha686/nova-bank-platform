
import React, { useState } from 'react';
import { useBanking } from '@/contexts/BankingContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Settings = () => {
  const { currentUser } = useBanking();
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('english');
  
  const handleSavePreferences = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="notifications">
              <TabsList>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="notifications" className="mt-6">
                <CardTitle>Notification Preferences</CardTitle>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications} 
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                      </div>
                      <Switch 
                        checked={smsNotifications} 
                        onCheckedChange={setSmsNotifications} 
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={handleSavePreferences}>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <CardTitle>Security Settings</CardTitle>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Switch 
                        checked={twoFactorAuth} 
                        onCheckedChange={setTwoFactorAuth} 
                      />
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Change Password</h3>
                      <p className="text-sm text-muted-foreground mb-4">Update your password regularly to keep your account secure</p>
                      <Button>Change Password</Button>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Login History</h3>
                      <p className="text-sm text-muted-foreground mb-4">Review recent logins to your account</p>
                      <Button variant="outline">View History</Button>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-6">
                <CardTitle>Appearance Settings</CardTitle>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                      </div>
                      <Switch 
                        checked={darkMode} 
                        onCheckedChange={setDarkMode} 
                      />
                    </div>
                    
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Language</h3>
                      <p className="text-sm text-muted-foreground mb-4">Select your preferred language</p>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={handleSavePreferences}>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
