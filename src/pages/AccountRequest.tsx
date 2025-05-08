
import React, { useState } from 'react';
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

const accountSchema = z.object({
  account_type: z.string().min(1, { message: "Please select an account type" }),
  name: z.string().min(1, { message: "Account name is required" }),
  initial_deposit: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 1000;
  }, { message: "Initial deposit must be at least ₹1,000" }),
});

type AccountFormValues = z.infer<typeof accountSchema>;

const AccountRequest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      account_type: '',
      name: '',
      initial_deposit: '1000',
    },
  });

  const onSubmit = async (values: AccountFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to request an account');
        navigate('/login');
        return;
      }
      
      // Create account request using type assertion to bypass TypeScript error
      const { error } = await (supabase
        .from('account_requests' as any)
        .insert({
          user_id: session.user.id,
          account_type: values.account_type,
          name: values.name,
          initial_deposit: parseFloat(values.initial_deposit),
          status: 'pending'
        }) as any);
      
      if (error) {
        console.error('Error submitting account request:', error);
        toast.error('Failed to submit account request');
        return;
      }
      
      toast.success('Account request submitted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Request New Account</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>New Account Request</CardTitle>
            <CardDescription>
              Fill out this form to request a new bank account. Your request will be reviewed by an administrator.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="account_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="savings">Savings Account</SelectItem>
                          <SelectItem value="checking">Checking Account</SelectItem>
                          <SelectItem value="fixed_deposit">Fixed Deposit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type of account you wish to open
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. My Savings" {...field} />
                      </FormControl>
                      <FormDescription>
                        Give your account a memorable name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="initial_deposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Deposit Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1000" step="100" {...field} />
                      </FormControl>
                      <FormDescription>
                        Minimum initial deposit is ₹1,000
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Account Request'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AccountRequest;
