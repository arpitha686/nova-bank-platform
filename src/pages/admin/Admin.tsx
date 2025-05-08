
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountRequests from '@/components/admin/AccountRequests';
import FundRequests from '@/components/admin/FundRequests';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const Admin = () => {
  const navigate = useNavigate();

  // Check if user is an admin
  const { isLoading, isError } = useQuery({
    queryKey: ['checkAdmin'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Check if user is an admin
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || !profile || profile.role !== 'admin') {
        throw new Error('Unauthorized');
      }

      return true;
    },
    retry: false,
    meta: {
      onError: () => {
        toast.error('You are not authorized to access this page');
        navigate('/dashboard');
      }
    }
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p>Verifying admin access...</p>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return null; // Navigate will happen in onError
  }

  return (
    <MainLayout requireAdmin={true}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <Tabs defaultValue="account-requests">
          <TabsList>
            <TabsTrigger value="account-requests">Account Requests</TabsTrigger>
            <TabsTrigger value="fund-requests">Fund Requests</TabsTrigger>
            <TabsTrigger value="users">Users Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account-requests" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Requests</CardTitle>
                <CardDescription>
                  Manage pending account creation requests from customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccountRequests />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fund-requests" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Fund Requests</CardTitle>
                <CardDescription>
                  Manage pending fund deposit requests from customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FundRequests />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Redirecting to user management page...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Admin;
