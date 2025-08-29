// src/pages/FeedbackPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import FeedbackForm from "../../pages/FeedbackPage/FeedbackForm";
import type { UserFeedback } from "../../utils/types";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import * as userRepository from "../../api/repository/userRepository";
import AppContainer from "../../components/atoms/AppContainer/AppContainer";

const FeedbackPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setUserExists(false);
      return;
    }

    handleUserLookup({ targetUser: userId });
  }, []);

  const handleUserLookup = async (data: UserFeedback) => {
    setChecking(true);

    try {
      const res = await userRepository.userLookup(data.targetUser as string);
      if (res.statusNumber === 200) {
        setUserExists(true);
      } else {
        toast.error("Gagal mendapatkan link feedback untuk pengguna ini");
      }
      setChecking(false);
    } catch (error) {
      setChecking(false);
      console.log(error);

      toast.error(
        "Terjadi kesalahan saat menghubungi server. Coba lagi nanti."
      );
      navigate("/beri-feedback");
    }
  };

  useEffect(() => {
    if (userExists === false) {
      navigate("/ke", { state: { userNotFound: true } });
    }
  }, [userExists, navigate]);

  if (!userId) {
    console.warn("No userId found in URL, redirecting to landing page.");
    return <Navigate to="/" replace />;
  }
  if (checking) {
    return (
      <AppContainer className="h-screen w-full flex items-center justify-center">
        <AppContainer className="flex items-center gap-[10px]">
          <CircularProgress />
          <h3 className="text-blue-600 text-[24px] font-unbounded">
            Mengecek pengguna...
          </h3>
        </AppContainer>
      </AppContainer>
    );
  }
  if (userExists === false) {
    return null;
  }
  return <FeedbackForm userId={userId} />;
};

export default FeedbackPage;
