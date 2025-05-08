
import React, { useEffect } from 'react';
import { useBanking } from '@/contexts/BankingContext';
import MainLayout from '@/components/layouts/MainLayout';
import AccountCard from '@/components/dashboard/AccountCard';
import TransactionItem from '@/components/dashboard/TransactionItem';
import StatsCard from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const { currentUser, getUserAccounts, getUserTransactions } = useBanking();
  
  const accounts = currentUser ? getUserAccounts(currentUser.id) : [];
  const transactions = currentUser ? getUserTransactions(currentUser.id).slice(0, 5) : [];
  
  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Get most recent account
  const primaryAccount = accounts.length > 0 ? accounts[0] : null;
  
  // Calculate income and expenses for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = currentUser ? getUserTransactions(currentUser.id).filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  }) : [];
  
  const monthlyIncome = monthlyTransactions
    .filter(tx => tx.type === 'deposit')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const monthlyExpenses = monthlyTransactions
    .filter(tx => tx.type === 'payment' || tx.type === 'withdrawal')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, {currentUser?.name}</h1>
            <p className="text-muted-foreground">Here's an overview of your finances</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/transfer">
              <Button className="bg-banking-purple hover:bg-banking-deep-purple">
                <ArrowRight className="mr-2 h-4 w-4" />
                New Transfer
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard 
            title="Total Balance" 
            value={totalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} 
            icon={<CreditCard className="h-5 w-5 text-banking-purple" />}
          />
          <StatsCard 
            title="Monthly Income" 
            value={monthlyIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} 
            icon={<TrendingUp className="h-5 w-5 text-banking-green" />}
            change={{ value: "+12% from last month", positive: true }}
          />
          <StatsCard 
            title="Monthly Expenses" 
            value={monthlyExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} 
            icon={<TrendingDown className="h-5 w-5 text-banking-red" />}
            change={{ value: "-3% from last month", positive: true }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">My Accounts</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {accounts.map(account => (
                <AccountCard key={account.id} account={account} />
              ))}
              <div className="flex items-center justify-center h-48 sm:h-full border-2 border-dashed rounded-xl border-muted hover:border-muted-foreground/50 transition-colors">
                <Link to="/accounts/new">
                  <Button variant="ghost" className="h-full flex flex-col gap-4">
                    <CreditCard className="h-6 w-6" />
                    <span>Add New Account</span>
                  </Button>
                </Link>
              </div>
            </div>
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
