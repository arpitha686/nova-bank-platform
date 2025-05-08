
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { User, Account, Transaction, Notification } from '../types';
import { users as initialUsers, accounts as initialAccounts, transactions as initialTransactions, notifications as initialNotifications } from '../mock-data';
import { toast } from 'sonner';

interface BankingContextType {
  currentUser: User | null;
  accounts: Account[];
  transactions: Transaction[];
  notifications: Notification[];
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  registerUser: (name: string, email: string, password: string) => boolean;
  getUserAccounts: (userId: string) => Account[];
  getAccountById: (accountId: string) => Account | undefined;
  getUserTransactions: (userId: string) => Transaction[];
  transferFunds: (fromAccountId: string, toAccountId: string, amount: number, description: string) => boolean;
  makePayment: (fromAccountId: string, recipientName: string, amount: number, description: string) => boolean;
  markNotificationAsRead: (notificationId: string) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => boolean;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

interface BankingProviderProps {
  children: ReactNode;
}

export const BankingProvider = ({ children }: BankingProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Authentication
  const login = useCallback((email: string, password: string): boolean => {
    // In a real application, you would validate against stored credentials
    const user = users.find(u => u.email === email);
    
    if (user) {
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    }
    
    toast.error('Invalid email or password');
    return false;
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    toast.success('You have been logged out');
  }, []);

  const registerUser = useCallback((name: string, email: string, password: string): boolean => {
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      toast.error('User with this email already exists');
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8B5CF6&color=fff`,
    };

    // Create a default checking account for the new user
    const newAccount: Account = {
      id: `account-${Date.now()}`,
      userId: newUser.id,
      type: 'checking',
      name: 'Main Account',
      balance: 1000.00, // Starting balance
      currency: 'USD',
      cardNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
      cardExpiry: `${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}/${String(new Date().getFullYear() + 3).slice(2)}`,
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    setCurrentUser(newUser);
    
    toast.success('Registration successful! Welcome to Nova Banking.');
    return true;
  }, [users]);

  // Account operations
  const getUserAccounts = useCallback((userId: string): Account[] => {
    return accounts.filter(account => account.userId === userId);
  }, [accounts]);

  const getAccountById = useCallback((accountId: string): Account | undefined => {
    return accounts.find(account => account.id === accountId);
  }, [accounts]);

  // Transaction operations
  const getUserTransactions = useCallback((userId: string): Transaction[] => {
    const userAccountIds = accounts
      .filter(account => account.userId === userId)
      .map(account => account.id);
    
    return transactions
      .filter(tx => 
        userAccountIds.includes(tx.fromAccountId) || 
        (tx.toAccountId && userAccountIds.includes(tx.toAccountId))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [accounts, transactions]);

  const transferFunds = useCallback((fromAccountId: string, toAccountId: string, amount: number, description: string): boolean => {
    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    const toAccount = accounts.find(acc => acc.id === toAccountId);
    
    if (!fromAccount || !toAccount) {
      toast.error('One or more accounts not found');
      return false;
    }
    
    if (fromAccount.balance < amount) {
      toast.error('Insufficient funds');
      return false;
    }
    
    // Update account balances
    setAccounts(prevAccounts => 
      prevAccounts.map(acc => {
        if (acc.id === fromAccountId) {
          return { ...acc, balance: acc.balance - amount };
        }
        if (acc.id === toAccountId) {
          return { ...acc, balance: acc.balance + amount };
        }
        return acc;
      })
    );
    
    // Create transaction record
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      fromAccountId,
      toAccountId,
      amount,
      type: 'transfer',
      status: 'completed',
      description,
      date: new Date(),
      recipientName: toAccount.name,
    };
    
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    // Create notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId: fromAccount.userId,
      title: 'Transfer Complete',
      message: `Your transfer of ${amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })} to ${toAccount.name} has been completed.`,
      read: false,
      date: new Date(),
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    
    toast.success('Transfer completed successfully');
    return true;
  }, [accounts]);

  const makePayment = useCallback((fromAccountId: string, recipientName: string, amount: number, description: string): boolean => {
    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    
    if (!fromAccount) {
      toast.error('Account not found');
      return false;
    }
    
    if (fromAccount.balance < amount) {
      toast.error('Insufficient funds');
      return false;
    }
    
    // Update account balance
    setAccounts(prevAccounts => 
      prevAccounts.map(acc => {
        if (acc.id === fromAccountId) {
          return { ...acc, balance: acc.balance - amount };
        }
        return acc;
      })
    );
    
    // Create transaction record
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      fromAccountId,
      amount,
      type: 'payment',
      status: 'completed',
      description,
      date: new Date(),
      recipientName,
    };
    
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    // Create notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      userId: fromAccount.userId,
      title: 'Payment Processed',
      message: `Your payment of ${amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })} to ${recipientName} has been processed.`,
      read: false,
      date: new Date(),
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    
    toast.success('Payment processed successfully');
    return true;
  }, [accounts]);

  // Notification operations
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // User profile operations
  const updateUserProfile = useCallback((userId: string, updates: Partial<User>): boolean => {
    const userExists = users.some(u => u.id === userId);
    
    if (!userExists) {
      toast.error('User not found');
      return false;
    }
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prevUser => ({ ...prevUser!, ...updates }));
    }
    
    toast.success('Profile updated successfully');
    return true;
  }, [users, currentUser]);

  const value = useMemo(() => ({
    currentUser,
    users,
    accounts,
    transactions,
    notifications,
    login,
    logout,
    registerUser,
    getUserAccounts,
    getAccountById,
    getUserTransactions,
    transferFunds,
    makePayment,
    markNotificationAsRead,
    updateUserProfile,
  }), [
    currentUser, 
    users, 
    accounts, 
    transactions, 
    notifications, 
    login, 
    logout, 
    registerUser,
    getUserAccounts,
    getAccountById,
    getUserTransactions,
    transferFunds,
    makePayment,
    markNotificationAsRead,
    updateUserProfile,
  ]);

  return (
    <BankingContext.Provider value={value}>
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = (): BankingContextType => {
  const context = useContext(BankingContext);
  if (context === undefined) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
