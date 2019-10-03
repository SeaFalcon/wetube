import express from "express";
import routes from "../routes";
import {
  users,
  userDetail,
  editProfile,
  changePassword
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get(routes.users, users);
// editProfile을 위로 올려야함, 아니라면 users/:id 를 먼저 인식해버리기 때문
// 같은 라우트에 속해있으면 params (:id 와 같은 것을 가장 하위로 내려야 함)
userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.changePassword, changePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
