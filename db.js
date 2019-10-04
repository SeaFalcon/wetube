import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = err => console.log(`Error on DB Connection: ${err}`);

db.once("open", handleOpen);
db.on("error", handleError);

// export const videos = [
//   {
//     id: 324393,
//     title: "Video Awesome",
//     description: "This is something I love",
//     views: 24,
//     videoFile:
//       "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
//     creator: {
//       id: 123123,
//       name: "Falcon",
//       email: "sea@falcon.com"
//     }
//   },
//   {
//     id: 123154,
//     title: "Video Super",
//     description: "This is something I love",
//     views: 24,
//     videoFile:
//       "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
//     creator: {
//       id: 123123,
//       name: "Falcon",
//       email: "sea@falcon.com"
//     }
//   },
//   {
//     id: 86786,
//     title: "Video Hyper",
//     description: "This is something I love",
//     views: 24,
//     videoFile:
//       "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
//     creator: {
//       id: 123123,
//       name: "Falcon",
//       email: "sea@falcon.com"
//     }
//   },
//   {
//     id: 56854,
//     title: "Video Nice",
//     description: "This is something I love",
//     views: 24,
//     videoFile:
//       "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
//     creator: {
//       id: 123123,
//       name: "Falcon",
//       email: "sea@falcon.com"
//     }
//   }
// ];
