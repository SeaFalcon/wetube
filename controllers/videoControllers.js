// import { videos } from "../db";
import routes from "../routes";
import Video from "../models/Video";

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
    file: { path }
  } = req;
  // To Do: Upload and save video
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description
  });
  console.log(newVideo);
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findOne({ _id: id });
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
    await Video.findOneAndRemove({ _id: id });
  } catch (err) {
    console.log(err);
  }
  res.redirect(routes.home);
};
