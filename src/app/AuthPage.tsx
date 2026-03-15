import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Lock, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';

interface AuthPageProps {
  onLogin: () => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-100 selection:text-blue-900">
      <Card className="full-w max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border-slate-200">
        
        {/* Left Side - Dynamic Brand Presentation */}
        <div className="md:w-1/2 bg-slate-900 text-white p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900 z-0" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Logo className="size-12" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">SmartTasks Enterprise</h1>
            <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">Secure Task Management</p>
          </div>

          <div className="relative z-10 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="text-blue-400" />
              <span className="text-slate-200 font-medium">ISO 9241-210 Compliant UX</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="text-blue-400" />
              <span className="text-slate-200 font-medium">Enterprise-grade Security</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="text-blue-400" />
              <span className="text-slate-200 font-medium">Multi-user Architecture Ready</span>
            </motion.div>
          </div>

          <div className="relative z-10 text-sm text-slate-500">
            © 2026 SmartTasks Inc. All rights reserved.
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl z-0" />
          <div className="absolute -left-20 top-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl z-0" />
        </div>

        {/* Right Side - Auth Forms */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white relative">
          <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-slate-500 text-sm">
                {isLogin ? 'Enter your details to access your dashboard' : 'Sign up to start managing your projects securely'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="name">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input 
                        id="name"
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      id="email"
                      type="email" 
                      placeholder="name@company.com" 
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                    {isLogin && <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      id="password"
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-6 py-6"
                  onClick={onLogin}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 text-center text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none focus:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>

          </div>
        </div>
      </Card>
    </div>
  );
}
