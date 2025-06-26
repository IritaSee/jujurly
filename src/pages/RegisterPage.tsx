// src/pages/RegisterPage.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, AlertCircle, User } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ButtonLoading } from '../components/LoadingStates'
import { useAnnouncement } from '../components/Accessibility'
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            {icon}
          </div>
        )}
        <Input
          className={cn(
            icon && "pl-10",
            error && "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100",
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

// Schema for form validation
const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter yaa").max(20, "Username maksimal 20 karakter aja"),
  email: z.string().email("Email-nya belum bener nih"),
  password: z.string().min(8, "Password minimal 8 karakter biar aman"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const { announce } = useAnnouncement();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    clearError();
    
    try {
      await registerUser({ username: data.username, email: data.email, password: data.password });
      announce('Registration successful! Redirecting to dashboard.');
      navigate('/dashboard');
    } catch (err) {
      announce('Registration failed. Please check your information.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fef9f9] to-[#f0f4ff] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px]"
      >
        <Card className="bg-white rounded-xl shadow-lg border-0">
          <CardHeader className="text-center px-8 pt-8 pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#3B82F6]/10"
            >
              <User className="h-7 w-7 text-[#3B82F6]" />
            </motion.div>
            <CardTitle className="text-2xl font-semibold text-[#1F2937] mb-2">Daftar Jujurly</CardTitle>
            <CardDescription className="text-[#6B7280] text-base">
              Bikin akun buat ngumpulin feedback jujur!
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-[#1F2937]">username</Label>
                <InputWithIcon
                  id="username"
                  type="text"
                  placeholder="username unik ini bakal keliatan"
                  icon={<User className="h-4 w-4" />}
                  error={!!errors.username}
                  disabled={isLoading}
                  className="bg-[#F3F4F6] border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20 h-12 rounded-lg"
                  {...register("username")}
                />
                <AnimatePresence>
                  {errors.username && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-red-500"
                    >
                      {errors.username.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#1F2937]">email</Label>
                <InputWithIcon
                  id="email"
                  type="email"
                  placeholder="email@kamu.com"
                  icon={<Mail className="h-4 w-4" />}
                  error={!!errors.email}
                  disabled={isLoading}
                  className="bg-[#F3F4F6] border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20 h-12 rounded-lg"
                  {...register("email")}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-red-500"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#1F2937]">password</Label>
                <PasswordInput
                  id="password"
                  placeholder="minimal 8 karakter yaa~"
                  error={!!errors.password}
                  disabled={isLoading}
                  className="bg-[#F3F4F6] border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-[#3B82F6]/20 h-12 rounded-lg"
                  {...register("password")}
                />
                <p className="text-xs text-[#6B7280] mt-1">Biar aman, pake kombinasi angka & huruf ya</p>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-red-500"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <ButtonLoading
                 type="submit"
                 isLoading={isLoading}
                 className="w-full bg-[#111827] hover:bg-[#1F2937] text-white h-12 rounded-lg font-medium transition-all duration-200 hover:shadow-lg cursor-pointer mt-6"
                 loadingText="Lagi diproses..."
               >
                 Daftar
               </ButtonLoading>
            </form>
          </CardContent>

          <CardFooter className="flex-col space-y-4 px-8 pb-8">
            <div className="text-center text-sm text-[#6B7280]">
              Udah punya akun?{" "}
              <Link
                to="/login"
                className="text-sm font-semibold text-[#3B82F6] hover:text-[#2563EB] hover:underline transition-colors"
              >
                Login di sini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
};

export default RegisterPage;
