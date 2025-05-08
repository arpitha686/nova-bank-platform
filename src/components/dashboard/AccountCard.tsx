
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    type?: string;
    account_type?: string;
    balance: number;
    cardNumber?: string;
    card_number?: string;
    cardExpiry?: string;
    card_expiry?: string;
  };
}

const AccountCard = ({ account }: AccountCardProps) => {
  // Handle both property naming conventions
  const accountType = account.type || account.account_type;
  const cardNumber = account.cardNumber || account.card_number;
  const cardExpiry = account.cardExpiry || account.card_expiry;
  
  return (
    <Card className="account-card card-gradient text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium opacity-90 mb-1">
              {accountType === 'checking' ? 'Checking Account' : 
               accountType === 'savings' ? 'Savings Account' : 
               'Fixed Deposit'}
            </p>
            <h3 className="text-lg font-semibold">{account.name}</h3>
          </div>
          <CreditCard className="h-6 w-6" />
        </div>
        
        <div className="mt-6">
          <p className="text-sm opacity-90 mb-1">Current Balance</p>
          <h2 className="text-2xl font-bold">
            {formatCurrency(account.balance)}
          </h2>
        </div>
        
        <div className="mt-5 flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90 mb-1">Card Number</p>
            <p className="font-medium">{cardNumber}</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Expires</p>
            <p className="font-medium">{cardExpiry}</p>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-white opacity-5 rounded-xl pointer-events-none" />
      </CardContent>
    </Card>
  );
};

export default AccountCard;
