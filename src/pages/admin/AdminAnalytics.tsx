
import React from 'react';
import { useBanking } from '@/contexts/BankingContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from 'recharts';
import { Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminAnalytics = () => {
  const { transactions, accounts, users } = useBanking();
  
  // Transactions data by type for pie chart
  const transactionsByType = [
    {
      name: 'Transfers',
      value: transactions.filter(tx => tx.type === 'transfer').length,
      fill: '#8B5CF6', // purple
    },
    {
      name: 'Payments',
      value: transactions.filter(tx => tx.type === 'payment').length,
      fill: '#0EA5E9', // blue
    },
    {
      name: 'Deposits',
      value: transactions.filter(tx => tx.type === 'deposit').length,
      fill: '#10B981', // green
    },
    {
      name: 'Withdrawals',
      value: transactions.filter(tx => tx.type === 'withdrawal').length,
      fill: '#EF4444', // red
    },
  ];
  
  // Transaction amounts by month for bar chart
  const getMonthsData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === index && txDate.getFullYear() === currentYear;
      });
      
      const deposits = monthTransactions
        .filter(tx => tx.type === 'deposit')
        .reduce((sum, tx) => sum + tx.amount, 0);
        
      const payments = monthTransactions
        .filter(tx => tx.type === 'payment' || tx.type === 'withdrawal')
        .reduce((sum, tx) => sum + tx.amount, 0);
      
      return {
        name: month,
        deposits,
        payments,
        net: deposits - payments,
      };
    });
  };
  
  // Weekly transactions count for line chart
  const getWeeklyTransactionsData = () => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    
    return weeks.map((week, index) => {
      // This is mock data - in a real app you'd filter by actual dates
      const factor = index + 1;
      
      return {
        name: week,
        count: Math.floor(10 + Math.random() * 10) * factor,
      };
    });
  };
  
  // Account distribution by type for pie chart
  const accountsByType = [
    {
      name: 'Checking',
      value: accounts.filter(acc => acc.type === 'checking').length,
      fill: '#8B5CF6', // purple
    },
    {
      name: 'Savings',
      value: accounts.filter(acc => acc.type === 'savings').length,
      fill: '#0EA5E9', // blue
    },
  ];

  return (
    <MainLayout requireAdmin={true}>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{accounts.length}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getMonthsData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deposits" name="Deposits" fill="#10B981" />
                    <Bar dataKey="payments" name="Payments" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transaction Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    />
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Trends & Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity">
              <TabsList className="mb-4">
                <TabsTrigger value="activity">User Activity</TabsTrigger>
                <TabsTrigger value="accounts">Account Distribution</TabsTrigger>
              </TabsList>
              <TabsContent value="activity">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getWeeklyTransactionsData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Transactions" stroke="#8B5CF6" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="accounts">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accountsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      />
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminAnalytics;
