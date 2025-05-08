
import React, { useEffect } from 'react';
import { useBanking } from '@/contexts/BankingContext';
import MainLayout from '@/components/layouts/MainLayout';
import AccountCard from '@/components/dashboard/AccountCard';
import TransactionItem from '@/components/dashboard/TransactionItem';
import StatsCard from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown, CreditCard, PlusCircle, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';

const Dashboard = () => {
  const { currentUser } = useBanking();
  
  // Fetch user accounts
  const { data: accounts = [] } = useQuery({
    queryKey: ['userAccounts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser
  });
  
  // Fetch recent transactions
  const { data: transactionsData = [] } = useQuery({
    queryKey: ['recentTransactions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
      // First get all user accounts
      const { data: userAccounts, error: accountsError } = await supabase
        .from('accounts')
        .select('id')
        .eq('user_id', session.user.id);
      
      if (accountsError) throw accountsError;
      
      const accountIds = userAccounts?.map(acc => acc.id) || [];
      
      if (accountIds.length === 0) return [];
      
      // Then get transactions for these accounts
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`from_account_id.in.(${accountIds.join(',')}),to_account_id.in.(${accountIds.join(',')})`)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentUser && accounts.length > 0
  });

  // Transform Supabase transactions to match our Transaction type
  const transactions: Transaction[] = transactionsData.map(tx => ({
    id: tx.id,
    fromAccountId: tx.from_account_id,
    toAccountId: tx.to_account_id,
    amount: tx.amount,
    type: tx.transaction_type as 'transfer' | 'deposit' | 'withdrawal' | 'payment',
    status: tx.status as 'pending' | 'completed' | 'failed',
    description: tx.description || '',
    date: new Date(tx.created_at),
    recipientName: tx.recipient_name
  }));
  
  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Get most recent account
  const primaryAccount = accounts.length > 0 ? accounts[0] : null;
  
  // Calculate income and expenses for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Filter transactions from the current month
  const monthlyTransactions = transactions.filter(tx => {
    const txDate = tx.date;
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });
  
  // Calculate income (deposits to user accounts)
  const monthlyIncome = monthlyTransactions
    .filter(tx => accounts.some(acc => acc.id === tx.toAccountId) && tx.type === 'deposit')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  // Calculate expenses (payments or withdrawals from user accounts)
  const monthlyExpenses = monthlyTransactions
    .filter(tx => 
      accounts.some(acc => acc.id === tx.fromAccountId) && 
      (tx.type === 'payment' || tx.type === 'withdrawal')
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Listen for real-time updates on accounts and transactions
  useEffect(() => {
    const accountsChannel = supabase
      .channel('accounts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'accounts'
      }, () => {
        // Invalidate queries when accounts are updated
        window.location.reload();
      })
      .subscribe();

    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'transactions'
      }, () => {
        // Invalidate queries when transactions are updated
        window.location.reload();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(accountsChannel);
      supabase.removeChannel(transactionsChannel);
    };
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {currentUser?.name}</h1>
            <p className="text-muted-foreground">Here's an overview of your finances</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <Link to="/account-request">
              <Button className="bg-banking-purple hover:bg-banking-deep-purple">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Account
              </Button>
            </Link>
            <Link to="/fund-request">
              <Button className="bg-banking-green hover:bg-green-700">
                <Banknote className="mr-2 h-4 w-4" />
                Request Funds
              </Button>
            </Link>
            <Link to="/transfer">
              <Button variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" />
                Transfer
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard 
            title="Total Balance" 
            value={formatCurrency(totalBalance)} 
            icon={<CreditCard className="h-5 w-5 text-banking-purple" />}
          />
          <StatsCard 
            title="Monthly Income" 
            value={formatCurrency(monthlyIncome)} 
            icon={<TrendingUp className="h-5 w-5 text-banking-green" />}
          />
          <StatsCard 
            title="Monthly Expenses" 
            value={formatCurrency(monthlyExpenses)} 
            icon={<TrendingDown className="h-5 w-5 text-banking-red" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">My Accounts</h2>
            {accounts.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {accounts.map(account => (
                  <AccountCard key={account.id} account={account} />
                ))}
                <div className="flex items-center justify-center h-48 sm:h-full border-2 border-dashed rounded-xl border-muted hover:border-muted-foreground/50 transition-colors">
                  <Link to="/account-request">
                    <Button variant="ghost" className="h-full flex flex-col gap-4">
                      <CreditCard className="h-6 w-6" />
                      <span>Add New Account</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl border-muted p-6 text-center">
                <CreditCard className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="mb-4 text-muted-foreground">You don't have any accounts yet</p>
                <Link to="/account-request">
                  <Button>Request Your First Account</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <Link to="/accounts" className="text-banking-purple text-sm hover:underline">View all</Link>
            </div>
            <Card>
              {transactions.length > 0 ? (
                <div className="divide-y">
                  {transactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  No transactions yet
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
