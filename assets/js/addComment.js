import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const commentDeleteBtnList = document.querySelectorAll(".deleteBtn");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = (comment, id) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const span2 = document.createElement("span");

  span.innerHTML = comment;
  span2.innerHTML = "X";
  span2.id = id;
  span2.className = "deleteBtn";
  li.className = "cmtList";
  li.appendChild(span);
  span.insertAdjacentElement("afterend", span2);
  commentList.prepend(li);

  span2.addEventListener("click", sendCommentDelete);
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
  if (response.status === 200) {
    console.log(response);
    addComment(comment, response.data.id);
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
  const videoId = location.href.split("/videos/")[1];
  const {
    target: { id }
  } = e;
  const response = await axios({
    url: `/api/${id}/comment/delete`,
    method: "DELETE",
    data: { videoId }
  });
  console.log(response);
  if (response.status === 200) {
    removeComment(id);
  }
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  commentDeleteBtnList.forEach(commentDeleteBtn => {
    commentDeleteBtn.addEventListener("click", sendCommentDelete);
  });
}

if (addCommentForm) {
  init();
}
