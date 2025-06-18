// src/pages/LoginPage.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ButtonLoading } from '../components/LoadingStates'
import { useAnnouncement } from '../components/Accessibility'
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password";


// Enhanced Input with Icon
interface InputWithIconProps extends React.ComponentProps<typeof Input> {
  icon?: React.ReactNode;
  error?: boolean;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          className={cn(
            "h-12 rounded-lg bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm",
            icon && "pl-11",
            error && "border-red-300 focus:border-red-500 focus:ring-red-100",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputWithIcon.displayName = "InputWithIcon";

// Password Input with Toggle

// Schema for form validation
const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email atau username harus diisi ya!"),
  password: z.string().min(1, "Password jangan lupa diisi dong!"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { announce } = useAnnouncement();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    clearError();
    
    try {
      await login({ username: data.emailOrUsername, password: data.password });
      announce('Yeay! Login berhasil, lagi redirect ke dashboard nih!');
      navigate('/dashboard');
    } catch (err) {
      announce('Waduh, login gagal. Coba cek lagi email sama passwordnya ya!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="border border-gray-200 bg-white shadow-lg rounded-2xl">
          <CardHeader className="text-center pt-8 pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50"
            >
              <Lock className="h-5 w-5 text-blue-600" />
            </motion.div>
            <CardTitle className="text-2xl font-medium text-gray-900 mb-2">Halo lagi! 👋</CardTitle>
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              Login dulu yuk buat lanjutin aktivitas kamu
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6"
                >
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div className="space-y-3">
                <Label htmlFor="emailOrUsername" className="text-sm font-medium text-gray-700">
                  Email atau Username
                </Label>
                <InputWithIcon
                  id="emailOrUsername"
                  type="text"
                  placeholder="Tulis email atau username kamu di sini"
                  icon={<Mail className="h-4 w-4" />}
                  error={!!errors.emailOrUsername}
                  disabled={isLoading}
                  className="mt-2"
                  aria-label="Email atau Username"
                  {...register("emailOrUsername")}
                />
                {errors.emailOrUsername && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600"
                  >
                    {errors.emailOrUsername.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Lupa password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Tulis password kamu"
                  error={!!errors.password}
                  disabled={isLoading}
                  aria-label="Password"
                  {...register("password")}
                />
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="pt-2">
                <ButtonLoading
                  type="submit"
                  isLoading={isLoading}
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                  loadingText="Lagi login nih..."
                  disabled={isLoading}
                >
                  Login
                </ButtonLoading>
              </div>
            </form>
          </CardContent>

          <CardFooter className="px-8 pb-8 pt-0">
            <div className="text-center text-sm text-gray-600 w-full">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Daftar yuk!
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
};

export default LoginPage;
