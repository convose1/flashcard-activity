import { ParamsType } from "../types";

export const extractParams = (searchParams): ParamsType => {
  const channel_id = searchParams.get("channel_id");
  const user_id = searchParams.get("user_id");
  const username = searchParams.get("username");
  const avatar = searchParams.get("avatar");
  return {
    channel_id,
    username,
    user_id,
    avatar,
  };
};
