
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, CreditCard, ArrowLeftRight } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  // Fetch account info for better display
  const { data: fromAccount } = useQuery({
    queryKey: ['account', transaction.fromAccountId],
    queryFn: async () => {
      if (!transaction.fromAccountId) return null;
      
      const { data, error } = await supabase
        .from('accounts')
        .select('name')
        .eq('id', transaction.fromAccountId)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!transaction.fromAccountId
  });

  const { data: toAccount } = useQuery({
    queryKey: ['account', transaction.toAccountId],
    queryFn: async () => {
      if (!transaction.toAccountId) return null;
      
      const { data, error } = await supabase
        .from('accounts')
        .select('name')
        .eq('id', transaction.toAccountId)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!transaction.toAccountId
  });

  // Get current user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
  });

  // Get user accounts
  const { data: userAccounts = [] } = useQuery({
    queryKey: ['userAccounts', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', session.user.id);
      
      if (error) return [];
      return data;
    },
    enabled: !!session?.user?.id
  });

  // Determine if this is money in or out for the current user
  const userAccountIds = userAccounts.map(acc => acc.id);
  const isMoneyIn = transaction.toAccountId && userAccountIds.includes(transaction.toAccountId);
  const isMoneyOut = transaction.fromAccountId && userAccountIds.includes(transaction.fromAccountId);
  
  // Determine description based on transaction type
  let description = transaction.description || '';
  let icon = <CreditCard className="h-5 w-5 text-gray-500" />;
  
  if (transaction.type === 'transfer') {
    // For transfers, show where money went or came from
    if (isMoneyIn) {
      description = `Transfer from ${fromAccount?.name || 'another account'}`;
      icon = <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    } else {
      description = `Transfer to ${toAccount?.name || transaction.recipientName || 'another account'}`;
      icon = <ArrowUpRight className="h-5 w-5 text-red-500" />;
    }
  } else if (transaction.type === 'deposit') {
    description = transaction.description || 'Deposit';
    icon = <ArrowDownLeft className="h-5 w-5 text-green-500" />;
  } else if (transaction.type === 'withdrawal') {
    description = transaction.description || 'Withdrawal';
    icon = <ArrowUpRight className="h-5 w-5 text-red-500" />;
  } else if (transaction.type === 'payment') {
    description = `Payment to ${transaction.recipientName || 'merchant'}`;
    icon = <ArrowUpRight className="h-5 w-5 text-red-500" />;
  }

  const date = new Date(transaction.date);
  
  return (
    <div className="flex items-center justify-between py-4 px-6 hover:bg-muted/50 transition-colors">
      <div className="flex items-center">
        <div className="rounded-full p-2 bg-muted mr-4">
          {icon}
        </div>
        <div>
          <p className="font-medium">{description}</p>
          <p className="text-sm text-muted-foreground">
            {date.toLocaleString('en-IN', { 
              day: '2-digit', 
              month: 'short',
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
      
      <div className={`text-right ${isMoneyIn ? 'text-green-600' : 'text-red-600'}`}>
        <p className="font-semibold">
          {isMoneyIn ? '+' : '-'} {formatCurrency(transaction.amount)}
        </p>
        <p className="text-sm text-muted-foreground capitalize">
          {transaction.status}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
