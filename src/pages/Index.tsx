
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CreditCard, Shield, ArrowRight, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="container mx-auto py-6 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-banking-purple">Nova Bank</h1>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-700 hover:text-banking-purple transition-colors dark:text-gray-300">Features</a>
          <a href="#testimonials" className="text-gray-700 hover:text-banking-purple transition-colors dark:text-gray-300">Testimonials</a>
          <a href="#faq" className="text-gray-700 hover:text-banking-purple transition-colors dark:text-gray-300">FAQ</a>
          <Link to="/login">
            <Button variant="outline" className="border-banking-purple text-banking-purple hover:bg-banking-purple hover:text-white">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-banking-purple hover:bg-banking-deep-purple text-white">
              Sign Up
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Banking Made <span className="text-banking-purple">Simple</span> and <span className="text-banking-purple">Secure</span>
            </h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              Experience the next generation of online banking with Nova Bank. Manage your finances, transfer money, and make payments with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-banking-purple hover:bg-banking-deep-purple text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-banking-purple text-banking-purple hover:bg-banking-purple hover:text-white">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://ui-avatars.com/api/?text=Banking%20App&background=9b87f5&color=fff&size=512"
              alt="Banking Application Demo" 
              className="rounded-lg shadow-2xl animate-pulse-slow"
            />
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="bg-white py-16 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Nova Bank?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-700">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto dark:bg-purple-900">
                <Shield className="h-6 w-6 text-banking-purple" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Secure Banking</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Bank with confidence knowing your data is protected with state-of-the-art encryption and security measures.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-700">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto dark:bg-purple-900">
                <CreditCard className="h-6 w-6 text-banking-purple" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Easy Transfers</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Transfer money between accounts or to other users instantly with just a few clicks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-700">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 mx-auto dark:bg-purple-900">
                <TrendingUp className="h-6 w-6 text-banking-purple" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Financial Insights</h3>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Gain valuable insights into your spending habits and financial health with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 mr-3">
                  <img src="https://ui-avatars.com/api/?name=S+J&background=0EA5E9&color=fff" alt="Sarah J." className="rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah J.</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Nova Bank has transformed how I manage my business finances. The interface is intuitive and the transfer system is lightning fast!"
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 mr-3">
                  <img src="https://ui-avatars.com/api/?name=M+T&background=0EA5E9&color=fff" alt="Michael T." className="rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Freelancer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Finally, a banking platform that understands what users actually need. The dashboard gives me a complete overview of my finances at a glance."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 mr-3">
                  <img src="https://ui-avatars.com/api/?name=A+P&background=0EA5E9&color=fff" alt="Anna P." className="rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold">Anna P.</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "As a student, the fee-free accounts and easy-to-use mobile interface are perfect for my needs. I can manage my limited budget efficiently."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section id="faq" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-xl font-semibold mb-2">How do I create an account?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creating an account is simple. Click on the "Sign Up" button, fill in your details, and follow the verification process. You'll be banking in minutes.
              </p>
            </div>
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-xl font-semibold mb-2">Is online banking secure?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, we use bank-grade encryption and security measures including two-factor authentication to ensure your data and transactions are always protected.
              </p>
            </div>
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-xl font-semibold mb-2">Are there any fees?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nova Bank offers fee-free basic accounts. Some premium features and transactions may incur small fees, which are always clearly displayed before you confirm.
              </p>
            </div>
            <div className="mb-6 pb-6 border-b">
              <h3 className="text-xl font-semibold mb-2">How fast are transfers processed?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Internal transfers between Nova Bank accounts are instant. External transfers typically take 1-3 business days depending on the receiving bank.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-banking-purple py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to experience modern banking?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have switched to Nova Bank for a better banking experience.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-banking-purple hover:bg-gray-100">
              Open an Account Today
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nova Bank</h3>
              <p className="mb-4 text-gray-300">
                Secure, modern banking for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-banking-purple">Personal Banking</a></li>
                <li><a href="#" className="hover:text-banking-purple">Business Accounts</a></li>
                <li><a href="#" className="hover:text-banking-purple">Loans</a></li>
                <li><a href="#" className="hover:text-banking-purple">Credit Cards</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-banking-purple">About Us</a></li>
                <li><a href="#" className="hover:text-banking-purple">Careers</a></li>
                <li><a href="#" className="hover:text-banking-purple">Press</a></li>
                <li><a href="#" className="hover:text-banking-purple">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-banking-purple">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-banking-purple">Terms of Service</a></li>
                <li><a href="#" className="hover:text-banking-purple">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Nova Bank. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
