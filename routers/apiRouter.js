import express from "express";
import routes from "../routes";
import {
  registerView,
  postAddComment,
  postDeleteComment
} from "../controllers/videoControllers";

const apiRouter = express.Router();

const testModule = (req, res, next) => {
  console.log(req.path);
  next();
};

apiRouter.post(routes.registerView, registerView);
apiRouter.post(routes.addComment, testModule, postAddComment);
apiRouter.delete(routes.deleteComment, postDeleteComment);

export default apiRouter;
