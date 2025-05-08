
import React, { useState } from 'react';
import { useBanking } from '@/contexts/BankingContext';
import MainLayout from '@/components/layouts/MainLayout';
import AccountCard from '@/components/dashboard/AccountCard';
import TransactionItem from '@/components/dashboard/TransactionItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const Accounts = () => {
  const { currentUser, getUserAccounts, getUserTransactions } = useBanking();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  const accounts = currentUser ? getUserAccounts(currentUser.id) : [];
  const transactions = currentUser 
    ? getUserTransactions(currentUser.id)
        .filter(tx => !selectedAccount || tx.fromAccountId === selectedAccount || tx.toAccountId === selectedAccount)
    : [];

  // Set first account as selected by default
  React.useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts, selectedAccount]);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">My Accounts</h1>
          <Link to="/accounts/new">
            <Button className="bg-banking-purple hover:bg-banking-deep-purple mt-4 md:mt-0">
              <CreditCard className="mr-2 h-4 w-4" />
              Add New Account
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(account => (
            <div 
              key={account.id}
              onClick={() => setSelectedAccount(account.id)}
              className={`cursor-pointer transform transition-transform hover:scale-[1.02] ${selectedAccount === account.id ? 'ring-2 ring-banking-purple rounded-xl' : ''}`}
            >
              <AccountCard account={account} />
            </div>
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
        
        {selectedAccount && (
          <div className="mt-8">
            <Tabs defaultValue="transactions">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="details">Account Details</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions" className="mt-4">
                <Card>
                  {transactions.length > 0 ? (
                    <div className="divide-y">
                      {transactions.map(transaction => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      No transactions found for this account
                    </div>
                  )}
                </Card>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <Card>
                  <div className="p-6 space-y-4">
                    {accounts
                      .filter(account => account.id === selectedAccount)
                      .map(account => (
                        <div key={account.id} className="space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Account Name</h3>
                            <p className="text-lg">{account.name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                            <p className="text-lg capitalize">{account.type}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Card Number</h3>
                            <p className="text-lg">{account.cardNumber}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
                            <p className="text-lg">{account.cardExpiry}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Current Balance</h3>
                            <p className="text-lg font-semibold">
                              {account.balance.toLocaleString('en-US', {
                                style: 'currency',
                                currency: account.currency,
                              })}
                            </p>
                          </div>
                          <div className="pt-4">
                            <div className="flex space-x-2">
                              <Button>Manage Card</Button>
                              <Button variant="outline">View Statements</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Accounts;
