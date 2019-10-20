import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const commentDeleteBtn = document.querySelector(".deleteBtn");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = comment => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

const removeComment = id => {
  const removedComment = document.getElementById(id);
  removedComment.parentElement.remove();
  decreaseNumber();
};

const sendComment = async comment => {
  const videoId = location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: { comment }
  });
  console.log(response);
  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = e => {
  e.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const sendCommentDelete = async e => {
  const {
    target: { id }
  } = e;
  const response = await axios({
    url: `/api/${id}/comment/delete`,
    method: "DELETE"
  });
  console.log(response);
  if (response.status === 200) {
    removeComment(id);
  }
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  commentDeleteBtn.addEventListener("click", sendCommentDelete);
}

if (addCommentForm) {
  init();
}
