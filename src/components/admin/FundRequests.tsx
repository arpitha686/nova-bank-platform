
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const FundRequests = () => {
  const queryClient = useQueryClient();

  // Fetch fund requests
  const { data: requests, isLoading, isError } = useQuery({
    queryKey: ['fundRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fund_requests')
        .select(`
          *,
          profiles:user_id (first_name, last_name, email),
          accounts:account_id (name, account_number)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Approve fund request mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, accountId, amount, userId }: any) => {
      // Add the funds to the account
      const { error: updateError } = await supabase.rpc('add_funds', {
        p_account_id: accountId,
        p_amount: amount
      });
      
      if (updateError) throw updateError;
      
      // Create a deposit transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          to_account_id: accountId,
          amount: amount,
          transaction_type: 'deposit',
          status: 'completed',
          description: 'Deposit request'
        })
        .select()
        .single();
      
      if (transactionError) throw transactionError;
      
      // Update the request status
      const { error: updateRequestError } = await supabase
        .from('fund_requests')
        .update({ 
          status: 'approved',
          transaction_id: transaction.id
        })
        .eq('id', id);
      
      if (updateRequestError) throw updateRequestError;
      
      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Deposit Approved',
          message: `Your deposit request of ₹${amount.toLocaleString('en-IN')} has been approved.`,
        });
      
      if (notificationError) throw notificationError;
      
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fundRequests'] });
      toast.success('Fund request approved successfully');
    },
    onError: (error) => {
      console.error('Error approving fund request:', error);
      toast.error('Failed to approve fund request');
    }
  });

  // Reject fund request mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, userId }: any) => {
      // Update request status
      const { error } = await supabase
        .from('fund_requests')
        .update({ status: 'rejected' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Deposit Request Rejected',
          message: 'Your deposit request has been rejected. Please contact customer support for more information.',
        });
      
      if (notificationError) throw notificationError;
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fundRequests'] });
      toast.success('Fund request rejected');
    },
    onError: (error) => {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject fund request');
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading fund requests...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error loading fund requests</div>;
  }

  if (requests && requests.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No pending fund requests</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">User</th>
            <th className="text-left py-3 px-4">Account</th>
            <th className="text-left py-3 px-4">Amount</th>
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
              <td className="py-3 px-4">
                {request.accounts?.name}
                <div className="text-xs text-muted-foreground">#{request.accounts?.account_number}</div>
              </td>
              <td className="py-3 px-4">₹{request.amount.toLocaleString('en-IN')}</td>
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
                        accountId: request.account_id,
                        amount: request.amount,
                        userId: request.user_id
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

export default FundRequests;
