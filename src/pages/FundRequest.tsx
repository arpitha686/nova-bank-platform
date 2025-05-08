
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const fundSchema = z.object({
  account_id: z.string().min(1, { message: "Please select an account" }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 100;
  }, { message: "Amount must be at least ₹100" }),
});

type FundFormValues = z.infer<typeof fundSchema>;

const FundRequest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user accounts
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['userAccounts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/login');
        return [];
      }
      
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data || [];
    }
  });

  const form = useForm<FundFormValues>({
    resolver: zodResolver(fundSchema),
    defaultValues: {
      account_id: '',
      amount: '1000',
    },
  });

  const onSubmit = async (values: FundFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to request funds');
        navigate('/login');
        return;
      }
      
      // Create fund request using type assertion to bypass TypeScript error
      const { error } = await (supabase
        .from('fund_requests' as any)
        .insert({
          user_id: session.user.id,
          account_id: values.account_id,
          amount: parseFloat(values.amount),
          status: 'pending'
        }) as any);
      
      if (error) {
        console.error('Error submitting fund request:', error);
        toast.error('Failed to submit fund request');
        return;
      }
      
      toast.success('Fund request submitted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has any accounts
  useEffect(() => {
    if (!isLoading && accounts && accounts.length === 0) {
      toast.error('You need to have at least one account to request funds');
      navigate('/account-request');
    }
  }, [accounts, isLoading, navigate]);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Request Funds</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>New Fund Request</CardTitle>
            <CardDescription>
              Fill out this form to request a deposit to your account. Your request will be reviewed by an administrator.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="account_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Account</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts?.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} (₹{account.balance.toLocaleString('en-IN')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose which account to deposit to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="100" step="100" {...field} />
                      </FormControl>
                      <FormDescription>
                        Minimum amount is ₹100
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
                  {isSubmitting ? 'Submitting...' : 'Submit Fund Request'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FundRequest;
