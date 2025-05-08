
import React from 'react';
import { Transaction } from '@/types';
import { ArrowDown, ArrowUp, CreditCard, ArrowRight } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const getIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return <ArrowDown className="h-5 w-5 text-banking-green" />;
      case 'withdrawal':
        return <ArrowUp className="h-5 w-5 text-banking-red" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-banking-purple" />;
      case 'transfer':
        return <ArrowRight className="h-5 w-5 text-banking-blue" />;
      default:
        return <CreditCard className="h-5 w-5 text-banking-gray" />;
    }
  };
  
  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return 'text-banking-green';
      case 'pending':
        return 'text-banking-blue';
      case 'failed':
        return 'text-banking-red';
      default:
        return 'text-banking-gray';
    }
  };
  
  const getAmountDisplay = () => {
    const isOutgoing = ['payment', 'withdrawal', 'transfer'].includes(transaction.type);
    const prefix = isOutgoing ? '- ' : '+ ';
    return `${isOutgoing ? prefix : prefix}${transaction.amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })}`;
  };

  return (
    <div className="transaction-item">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
          {getIcon()}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground mr-2">
              {transaction.recipientName ? transaction.recipientName : 'Personal Account'}
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${transaction.type === 'deposit' ? 'text-banking-green' : ''}`}>
          {getAmountDisplay()}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(transaction.date).toLocaleDateString()} · <span className={getStatusColor()}>{transaction.status}</span>
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
