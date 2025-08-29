import type { FeedbackRequest } from "../../utils/types";
import { PROVIDER_GET, PROVIDER_POST } from "../provider";
// import { Store } from "../../redux/store";

// const getToken = () => Store.getState().auth.value;

const delay = (): Promise<void> =>
  new Promise((res) => setTimeout(() => res(), 800));

const userData = localStorage.getItem("userData");
const identifier = userData ? JSON.parse(userData).username : "anonymous";
export const feedbackSend = async (
  targetUser: string,
  data: FeedbackRequest
) => {
  await delay();
  const response = await PROVIDER_POST(`api/feedback/${targetUser}`, data);
  return response;
};

export const getFeedbacks = async () => {
  await delay();
  const response = await PROVIDER_GET(`api/users/${identifier}/feedbacks`);
  return response;
};
