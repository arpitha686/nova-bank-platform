
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
};

export type Account = {
  id: string;
  userId: string;
  type: 'checking' | 'savings';
  name: string;
  balance: number;
  currency: string;
  cardNumber: string;
  cardExpiry: string;
};

export type Transaction = {
  id: string;
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  date: Date;
  recipientName?: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
};
