import { PROVIDER_GET } from "../provider";
import { Store } from "../../redux/store";

const getToken = () => Store.getState().auth.value;

const delay = (): Promise<void> =>
  new Promise((res) => setTimeout(() => res(), 800));

export const userLookup = async (targetUser: string) => {
  await delay();
  const response = await PROVIDER_GET(
    `api/user/lookup/${targetUser}`,
    "",
    true
  );
  return response;
};

export const getUser = async () => {
  await delay();
  const response = await PROVIDER_GET(`user`, getToken());
  return response;
};
