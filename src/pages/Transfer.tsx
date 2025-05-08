
import React, { useState } from 'react';
import { useBanking } from '@/contexts/BankingContext';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

const Transfer = () => {
  const { currentUser, getUserAccounts, accounts, transferFunds, makePayment } = useBanking();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Transfer between accounts state
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  
  // Payment state
  const [paymentAccountId, setPaymentAccountId] = useState('');
  const [paymentRecipient, setPaymentRecipient] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  
  const userAccounts = currentUser ? getUserAccounts(currentUser.id) : [];
  const otherAccounts = currentUser 
    ? accounts.filter(acc => acc.userId !== currentUser.id)
    : [];

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromAccountId || !toAccountId) {
      toast.error('Please select source and destination accounts');
      return;
    }
    
    if (fromAccountId === toAccountId) {
      toast.error('Source and destination accounts cannot be the same');
      return;
    }
    
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = transferFunds(fromAccountId, toAccountId, amount, transferDescription);
      
      setIsSubmitting(false);
      
      if (success) {
        setTransferAmount('');
        setTransferDescription('');
        navigate('/dashboard');
      }
    }, 1500);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentAccountId) {
      toast.error('Please select source account');
      return;
    }
    
    if (!paymentRecipient.trim()) {
      toast.error('Please enter recipient name');
      return;
    }
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const success = makePayment(paymentAccountId, paymentRecipient, amount, paymentDescription);
      
      setIsSubmitting(false);
      
      if (success) {
        setPaymentAmount('');
        setPaymentRecipient('');
        setPaymentDescription('');
        navigate('/dashboard');
      }
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Money Transfer</h1>
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="internal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="internal">Between Accounts</TabsTrigger>
                <TabsTrigger value="external">Make a Payment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="internal" className="mt-6">
                <CardTitle>Transfer Between Accounts</CardTitle>
                <form onSubmit={handleTransferSubmit} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fromAccount" className="text-sm font-medium">From Account</label>
                    <Select 
                      value={fromAccountId} 
                      onValueChange={setFromAccountId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                      <SelectContent>
                        {userAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.balance.toLocaleString('en-US', {
                              style: 'currency',
                              currency: account.currency,
                            })})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center my-2">
                    <ArrowRight className="h-6 w-6 text-banking-purple" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="toAccount" className="text-sm font-medium">To Account</label>
                    <Select 
                      value={toAccountId} 
                      onValueChange={setToAccountId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                      <SelectContent>
                        {userAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.balance.toLocaleString('en-US', {
                              style: 'currency',
                              currency: account.currency,
                            })})
                          </SelectItem>
                        ))}
                        {otherAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} (User's Account)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input 
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                    <Textarea 
                      id="description"
                      placeholder="What's this transfer for?"
                      value={transferDescription}
                      onChange={(e) => setTransferDescription(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6 bg-banking-purple hover:bg-banking-deep-purple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Transfer Funds'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="external" className="mt-6">
                <CardTitle>Make a Payment</CardTitle>
                <form onSubmit={handlePaymentSubmit} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="paymentAccount" className="text-sm font-medium">From Account</label>
                    <Select 
                      value={paymentAccountId} 
                      onValueChange={setPaymentAccountId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                      <SelectContent>
                        {userAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.balance.toLocaleString('en-US', {
                              style: 'currency',
                              currency: account.currency,
                            })})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="recipient" className="text-sm font-medium">Recipient Name</label>
                    <Input 
                      id="recipient"
                      type="text"
                      placeholder="John Smith or Company Name"
                      value={paymentRecipient}
                      onChange={(e) => setPaymentRecipient(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="paymentAmount" className="text-sm font-medium">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input 
                        id="paymentAmount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="paymentDescription" className="text-sm font-medium">Description (Optional)</label>
                    <Textarea 
                      id="paymentDescription"
                      placeholder="What's this payment for?"
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6 bg-banking-purple hover:bg-banking-deep-purple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Make Payment'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Important notes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Transfers between your own accounts are processed immediately</li>
                <li>External payments may take 1-3 business days to complete</li>
                <li>Maximum transfer limit is $10,000 per transaction</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Transfer;
