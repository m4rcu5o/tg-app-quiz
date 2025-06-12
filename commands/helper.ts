import UserModel from "../config/model";

export const findOfUser = async (userId: number, username?: string) => {
  try {
    const info = await UserModel.findOne({ userId })
    return info;
  } catch (e) {
    return null
  }
}