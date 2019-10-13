import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videos/" });

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.routes = routes;
  // passport는 user가 담긴 object를 req에도 전달
  res.locals.loggedUser = req.user || null;
  console.log(req.user);
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  }
  next();
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  }
  res.redirect(routes.home);
};

export const uploadVideo = multerVideo.single("videoFile");
