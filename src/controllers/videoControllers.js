// import { videos } from "../db";
import routes from "../routes";
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

// async 해주는 이유, DB를 훑어보는 동안 페이지가 이미 로딩되는 상황 방지
// await 키워드는 async없이 사용 불가
// async 는 해당 function에 어떤 부분은 꼭 기다려야한다고 명시
export const home = async (req, res) => {
  // await 부분이 끝날때까지 아랫줄이 실행되지 않는 것 보장
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    console.log(videos);
    res.render("Home", { pageTitle: "Home", videos });
  } catch (err) {
    console.log(err);
    res.render("Home", { pageTitle: "Home", videos: [] });
  }
};
export const search = async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (err) {
    console.log(err);
  }

  res.render("Search", { pageTitle: "Search", searchingBy, videos });
};

// export const videos = (req, res) => res.send("Videos");

export const getUpload = (req, res) => {
  res.render("Upload", { pageTitle: "Upload" });
};
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    // file: { path }
    file: { location }
  } = req;
  // To Do: Upload and save video
  const newVideo = await Video.create({
    // fileUrl: path,
    fileUrl: location,
    title,
    description,
    creator: req.user.id
  });
  console.log(newVideo);
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const { id } = req.params;

  try {
    // populate 함수는 스키마 속성이 ObjectId인 경우에만 사용 가능
    // 원래 videos는 creator의 id 값만을 가지고 있으나, populate 함수를 사용하면 해당 필드에 유저 객체를 넣어준다.
    const video = await Video.findOne({ _id: id })
      .populate("creator")
      .populate("comments");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (err) {
    console.error(err);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;

  try {
    const video = await Video.findOne({ _id: id });
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    }
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (err) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body
  } = req;

  try {
    await Video.findOneAndUpdate({ _id: id }, body, (err, doc) => {
      console.log(doc);
    });
    res.redirect(routes.videoDetail(id));
  } catch (err) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;

  try {
    const video = await Video.findOne({ _id: id });
    if (video.creator !== req.user.id) {
      throw Error();
    }
    await Video.findOneAndRemove({ _id: id });
  } catch (err) {
    console.log(err);
  }
  res.redirect(routes.home);
};

// api (only server connect)
export const registerView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (err) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id: videoId },
    body: { comment },
    user: { id: userId }
  } = req;
  try {
    const video = await Video.findById(videoId);
    const userModel = await User.findById(userId);
    const newComment = await Comment.create({
      text: comment,
      creator: userId
    });
    video.comments.push(newComment.id);
    video.save();
    userModel.comments.push(newComment.id);
    userModel.save();
    res.json({ status: 200, id: newComment.id });
  } catch (err) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    params: { id: commentId },
    body: { videoId }
  } = req;
  try {
    const comment = await Comment.findByIdAndDelete(commentId);

    // method 1 - mongodb method
    // const video = await Video.updateOne(
    //   { _id: videoId },
    //   { $pull: { comments: commentId } }
    // );
    // const user = await User.updateOne(
    //   { _id: comment.creator },
    //   { $pull: { comments: commentId } }
    // );

    // method 2 - javascript method
    const video2 = await Video.findById(videoId);
    video2.comments.splice(video2.comments.indexOf(commentId), 1);
    video2.save();
    const user2 = await User.findById(comment.creator);
    user2.comments.splice(user2.comments.indexOf(commentId), 1);
    user2.save();

    //
  } catch (err) {
    res.status(400);
  } finally {
    res.end();
  }
};