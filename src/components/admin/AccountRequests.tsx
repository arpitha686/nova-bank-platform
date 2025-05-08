
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const AccountRequests = () => {
  const queryClient = useQueryClient();

  // Fetch account requests
  const { data: requests, isLoading, isError } = useQuery({
    queryKey: ['accountRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_requests')
        .select(`
          *,
          profiles:user_id (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Approve account request mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, userId, accountType, name, initialDeposit }: any) => {
      // Generate a random account number
      const accountNumber = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const cardNumber = `•••• ${Math.floor(1000 + Math.random() * 9000)}`;
      const expiryYear = new Date().getFullYear() + 5;
      const expiryMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
      const cardExpiry = `${expiryMonth}/${String(expiryYear).slice(-2)}`;
      
      // Create the account
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .insert({
          user_id: userId,
          account_type: accountType,
          name: name,
          balance: initialDeposit,
          currency: 'INR',
          account_number: accountNumber,
          card_number: cardNumber,
          card_expiry: cardExpiry,
          status: 'active'
        })
        .select()
        .single();
      
      if (accountError) throw accountError;
      
      // Create a deposit transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          to_account_id: account.id,
          amount: initialDeposit,
          transaction_type: 'deposit',
          status: 'completed',
          description: 'Initial deposit'
        });
      
      if (transactionError) throw transactionError;
      
      // Update the request status
      const { error: updateError } = await supabase
        .from('account_requests')
        .update({ status: 'approved' })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Account Request Approved',
          message: `Your request for a new ${accountType} account has been approved.`,
        });
      
      if (notificationError) throw notificationError;
      
      return account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountRequests'] });
      toast.success('Account request approved successfully');
    },
    onError: (error) => {
      console.error('Error approving account:', error);
      toast.error('Failed to approve account request');
    }
  });

  // Reject account request mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, userId }: any) => {
      // Update request status
      const { error } = await supabase
        .from('account_requests')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Account Request Rejected',
          message: 'Your account request has been rejected. Please contact customer support for more information.',
        });
      
      if (notificationError) throw notificationError;
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountRequests'] });
      toast.success('Account request rejected');
    },
    onError: (error) => {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject account request');
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading account requests...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error loading account requests</div>;
  }

  if (requests && requests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No pending account requests</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">User</th>
            <th className="text-left py-3 px-4">Account Type</th>
            <th className="text-left py-3 px-4">Account Name</th>
            <th className="text-left py-3 px-4">Initial Deposit</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request: any) => (
            <tr key={request.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                {request.profiles?.first_name} {request.profiles?.last_name}
                <div className="text-xs text-muted-foreground">{request.profiles?.email}</div>
              </td>
              <td className="py-3 px-4 capitalize">{request.account_type}</td>
              <td className="py-3 px-4">{request.name}</td>
              <td className="py-3 px-4">₹{request.initial_deposit.toLocaleString('en-IN')}</td>
              <td className="py-3 px-4">
                <Badge 
                  variant={
                    request.status === 'pending' ? 'outline' : 
                    request.status === 'approved' ? 'default' : 'destructive'
                  }
                >
                  {request.status}
                </Badge>
              </td>
              <td className="py-3 px-4">{formatDate(request.created_at)}</td>
              <td className="py-3 px-4">
                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => approveMutation.mutate({
                        id: request.id, 
                        userId: request.user_id,
                        accountType: request.account_type,
                        name: request.name,
                        initialDeposit: request.initial_deposit
                      })}
                      disabled={approveMutation.isPending}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => rejectMutation.mutate({
                        id: request.id,
                        userId: request.user_id
                      })}
                      disabled={rejectMutation.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountRequests;
