import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContainer from "../../components/atoms/AppContainer/AppContainer";
import AppSideBarList from "../../components/organisms/AppSidebarList/AppSidebarList";
import { useForm } from "react-hook-form";
import type { FeedbackItem } from "../../utils/types";
import { convertDateString } from "../../utils/helper";
import AppFeedbackCard from "../../components/organisms/AppFeedbackCard/AppFeedbackCard";
import AppFeedbackView from "../../components/organisms/AppFeedbackView/AppFeedbackView";
import AppFilterFeedback from "../../components/molecules/AppFilterFeedback/AppFilterFeedback";
import AppToolbarDashboard from "../../components/organisms/AppToolbarDashboard/AppToolbarDashboard";
import AppMiniToolbar from "../../components/molecules/AppMiniToolbar/AppMiniToolbar";
import AOS from "aos";
import { toast } from "react-toastify";
// import * as userRepository from "../../api/repository/userRepository";
import * as feedbackRepository from "../../api/repository/feedbackRepository";

const DashboardPage: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const isAuthenticated = !!localStorage.getItem("userData");
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  const [currentFeedbacks, setCurrentFeedbacks] = useState<FeedbackItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [feedbackViewOpen, setfeedbackViewOpen] = useState<boolean>(false);
  // Perbaikan: Menggunakan selectedFeedback yang konsisten
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(
    null
  );
  const [user, setUser] = useState<{ username?: string; email: string }>({
    email: "",
  });
  const [checkedMode, setCheckedMode] = useState<boolean>(false);
  const [, setAllChecked] = useState<boolean>(false);
  const [selectedFeedbackIds, setSelectedFeedbacks] = useState<number[]>([]);
  const navigate = useNavigate();
  const { control, watch } = useForm({});
  const searchValue = watch("search");

  // const getUser = async () => {
  //   try {
  //     const res = await userRepository.getUser();
  //     if (res.statusNumber === 200) {
  //       setUser(res.data);
  //       console.log(user);
  //     } else {
  //       toast.error(res.message || "Gagal Menemukan Pengguna.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     toast.error("Gagal Menemukan Pengguna.");
  //   }
  // };
  const getUser = localStorage.getItem("userData");
  const handleFeedbackList = async () => {
    // setIsLoading(true);
    try {
      const res = await feedbackRepository.getFeedbacks();
      if (res.statusNumber == 200) {
        if (Array.isArray(res.data)) {
          setFeedbacks(res.data);
          setCurrentFeedbacks(res.data);
        } else {
          setFeedbacks([]);
          setCurrentFeedbacks([]);
        }
      } else {
        toast.error("Gagal Mengambil data Feedbacks");
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Gagal Mengambil data Feedbacks");
    }
  };

  const handleFeedbackSelected = (value: boolean, feedbackId: number) => {
    if (value) {
      setSelectedFeedbacks((prev) => [...prev, feedbackId]);
    } else {
      setSelectedFeedbacks((prev) => prev.filter((id) => id !== feedbackId));
    }
  };

  const handleSelectAll = (value: boolean) => {
    setAllChecked(value);
    if (value) {
      setSelectedFeedbacks(feedbacks.map((data: FeedbackItem) => data.id));
    } else {
      setSelectedFeedbacks([]);
    }
  };

  const handleFeedbackSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFeedbacks(currentFeedbacks);
      return;
    }

    const filteredNotes = currentFeedbacks.filter((fb) =>
      fb.context.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFeedbacks(filteredNotes);
  };

  const backend = true;

  useEffect(() => {
    if (getUser) {
      setUser(JSON.parse(getUser));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated && backend) {
      handleFeedbackList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchValue !== undefined) {
      handleFeedbackSearch(searchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <AppContainer className="w-full flex h-screen max items-stretch bg-white overflow-y-hidden relative">
      <AppContainer
        dataAos="fade-right"
        className={`w-[50%] sm:w-[50%] md:w-[30%] lg:w-[20%] xl:w-[15%] h-full  bg-blue-400  ${
          sidebarOpen &&
          " block sm:block md:block lg:block left-0 z-20 absolute sm:absolute md:absolute lg:absolute"
        }  ${!sidebarOpen && " hidden sm:hidden md:hidden lg:hidden"} xl:block`}
      >
        <AppSideBarList />
      </AppContainer>
      {/*  */}
      <AppContainer
        className="w-full h-full flex flex-col items-stretch flex-grow"
        onClick={() => {
          if (sidebarOpen) setSidebarOpen(false);
        }}
      >
        <AppToolbarDashboard
          dataAos="fade-down"
          username={user.username || ""}
          email={user.email}
          control={control}
          onAddFeedbackClick={() => {
            navigate("/beri-feedback");
          }}
          onClickSidebar={() => setSidebarOpen(true)}
        />

        {/*  */}
        <AppContainer className="w-full h-full max-h-[90vh]   flex items-stretch bg-gray-100 gap-[10px] p-[10px] flex-grow ">
          <AppContainer
            className={`
              ${
                feedbackViewOpen
                  ? "!hidden sm:!hidden md:!flex lg:!flex xl:!flex"
                  : "!flex"
              }
              w-full sm:w-full md:w-[45%] lg:w-[45%] xl:w-[45%]
              h-full  flex-col gap-[10px] p-[20px] bg-white  rounded-2xl shadow-xl
            `}
          >
            <AppMiniToolbar
              onChangeCheckedMode={(setMode) => setCheckedMode(setMode)}
              onChecked={(checked) => {
                handleSelectAll(checked);
              }}
            />
            <AppFilterFeedback />
            <AppContainer className="flex flex-col items-start gap-[10px] overflow-y-auto flex-grow">
              {feedbacks.length === 0 ? (
                <AppContainer className="w-full h-full flex flex-col items-center justify-center text-center py-20">
                  <AppContainer className="mb-6">
                    <svg
                      className="w-24 h-24 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </AppContainer>
                  <p className="text-xl font-semibold text-gray-600 mb-3">
                    Belum Ada Feedback Masuk!
                  </p>
                  <p className="text-gray-500 mb-4 max-w-md">
                    Sepertinya kotak feedback kamu masih kosong. Yuk, sebarkan
                    link feedback kamu dan dengarkan apa kata orang lain tentang
                    dirimu!
                  </p>
                </AppContainer>
              ) : (
                feedbacks.map((fb) => (
                  <AppFeedbackCard
                    key={fb.id}
                    checkMode={checkedMode}
                    checked={selectedFeedbackIds.includes(fb?.id || 0)}
                    sender={fb.sender}
                    sentiment={fb.sentiment}
                    context={fb.context}
                    summary={fb.summary}
                    constructiveCriticism={fb.constructiveCriticism}
                    timestamp={convertDateString(fb.timestamp)}
                    onClickCard={() => {
                      if (!checkedMode) {
                        setSelectedFeedback(fb);
                        setfeedbackViewOpen(true);
                      }
                    }}
                    onChecked={(value: boolean) => {
                      handleFeedbackSelected(value, fb.id || 0);
                    }}
                  />
                ))
              )}
            </AppContainer>
          </AppContainer>
          {/*  */}
          <AppContainer
            className={`
            ${feedbackViewOpen ? "!flex" : "hidden"}
            w-full h-full
            hidden sm:hidden md:flex lg:flex  xl:flex flex-col gap-[20px] rounded-2xl shadow-xl flex-grow   `}
          >
            <AppContainer className="flex flex-col w-full h-full gap-[10px] rounded-2xl">
              {selectedFeedback && (
                <AppFeedbackView
                  id={selectedFeedback.id}
                  sender={selectedFeedback.sender || "Anonim"}
                  sentiment={selectedFeedback.sentiment}
                  context={selectedFeedback.context || "-"}
                  summary={selectedFeedback.summary || "Tidak ada ringkasan"}
                  constructiveCriticism={
                    selectedFeedback.constructiveCriticism ||
                    "Tidak ada saran spesifik saat ini."
                  }
                  timestamp={selectedFeedback.timestamp}
                  onClose={() => setfeedbackViewOpen(false)}
                />
              )}
            </AppContainer>
          </AppContainer>
        </AppContainer>
      </AppContainer>
    </AppContainer>
  );
};

export default DashboardPage;
