import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("Join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("Join", { pageTitle: "Join" });
  } else {
    // To Do: Register User
    try {
      const user = await User({ name, email });
      await User.register(user, password);
      next();
    } catch (err) {
      console.log(err);
      res.redirect(routes.home);
    }
    // To Do: Login User
  }
};
export const getLogin = (req, res) => {
  res.render("Login", { pageTitle: "Login" });
};
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home
});
export const githubLogin = passport.authenticate("github");
export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  const {
    _json: {
      id,
      avatar_url: { avatarUrl },
      name,
      email
    }
  } = profile;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (err) {
    return cb(err);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");
export const facebookLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (err) {
    return cb(err);
  }
};
export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // To Do: process logout
  req.logout();
  res.redirect(routes.home);
};

export const users = (req, res) => res.send("Users");

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (err) {
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;

  try {
    const user = await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      // avatarUrl: file ? file.path : req.user.avatarUrl
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
  } catch (err) {
    res.redirect(routes.editProfile);
  }

  res.redirect("/");
};

export const getChangePassword = (req, res) => {
  res.render("changePassword", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;

  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
      return;
    }

    // passport가 req에 현재 세션을 통해 쿠키에서 가지고있는 정보를 해독하여 user를 넣어줌, 그 user는 User객체를 통해 찾은 유저와 일치
    // 결국 req.user와 User.findOne({ _id: req.user.id })와 같은 값을 가진다. 결국 instance함수 changePassword를 사용할 수 있다.
    // const user = await User.findOne({ _id: req.user.id });
    // console.log(req.user, user, user.changePassword);
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (err) {
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
