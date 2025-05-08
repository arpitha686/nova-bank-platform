
import { User, Account, Transaction, Notification } from './types';

// Mock Users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=8B5CF6&color=fff',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=8B5CF6&color=fff',
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0EA5E9&color=fff',
  },
];

// Mock Accounts
export const accounts: Account[] = [
  {
    id: 'account-1',
    userId: 'user-1',
    type: 'checking',
    name: 'Main Account',
    balance: 5280.42,
    currency: 'USD',
    cardNumber: '•••• 4242',
    cardExpiry: '05/25',
  },
  {
    id: 'account-2',
    userId: 'user-1',
    type: 'savings',
    name: 'Savings Account',
    balance: 12750.00,
    currency: 'USD',
    cardNumber: '•••• 5555',
    cardExpiry: '07/26',
  },
  {
    id: 'account-3',
    userId: 'user-2',
    type: 'checking',
    name: 'Primary Account',
    balance: 3245.18,
    currency: 'USD',
    cardNumber: '•••• 9876',
    cardExpiry: '03/24',
  },
];

// Mock Transactions
export const transactions: Transaction[] = [
  {
    id: 'tx-1',
    fromAccountId: 'account-1',
    toAccountId: 'account-2',
    amount: 500.00,
    type: 'transfer',
    status: 'completed',
    description: 'Transfer to Savings',
    date: new Date('2023-05-07T10:30:00'),
  },
  {
    id: 'tx-2',
    fromAccountId: 'account-1',
    amount: 75.25,
    type: 'payment',
    status: 'completed',
    description: 'Electric Bill',
    date: new Date('2023-05-05T15:20:00'),
    recipientName: 'Electric Company',
  },
  {
    id: 'tx-3',
    fromAccountId: 'account-1',
    amount: 1200.00,
    type: 'deposit',
    status: 'completed',
    description: 'Salary Deposit',
    date: new Date('2023-05-01T09:15:00'),
  },
  {
    id: 'tx-4',
    fromAccountId: 'account-1',
    amount: 49.99,
    type: 'payment',
    status: 'completed',
    description: 'Subscription Service',
    date: new Date('2023-04-28T11:45:00'),
    recipientName: 'Netflix',
  },
  {
    id: 'tx-5',
    fromAccountId: 'account-1',
    amount: 120.50,
    type: 'withdrawal',
    status: 'completed',
    description: 'ATM Withdrawal',
    date: new Date('2023-04-25T17:30:00'),
  },
  {
    id: 'tx-6',
    fromAccountId: 'account-3',
    toAccountId: 'account-1',
    amount: 250.00,
    type: 'transfer',
    status: 'completed',
    description: 'Transfer from Jane',
    date: new Date('2023-04-22T14:10:00'),
    recipientName: 'John Doe',
  },
  {
    id: 'tx-7',
    fromAccountId: 'account-1',
    amount: 35.80,
    type: 'payment',
    status: 'pending',
    description: 'Online Purchase',
    date: new Date('2023-05-07T16:40:00'),
    recipientName: 'Amazon',
  },
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Transfer Complete',
    message: 'Your transfer of $500.00 to Savings Account has been completed.',
    read: false,
    date: new Date('2023-05-07T10:30:00'),
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'Payment Processed',
    message: 'Your payment of $75.25 to Electric Company has been processed.',
    read: true,
    date: new Date('2023-05-05T15:20:00'),
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: 'Deposit Received',
    message: 'A deposit of $1200.00 has been credited to your account.',
    read: true,
    date: new Date('2023-05-01T09:15:00'),
  },
];
