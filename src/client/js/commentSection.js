import "regenerator-runtime";

const videoComments = document.querySelector("div.video_comments");
const form = videoComments.querySelector("form.video_comment_form");
const textarea = form.querySelector("div.textarea");
// const btn = form.querySelector("button");
const videoContainer = document.querySelector("div.video_detail_video");
const video = videoContainer.querySelector("video");

const deleteBtn = document.querySelector(
  "div.comments_container_payload div.comments_container_payload_right div.comment_delete"
);

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.textContent;
  const videoId = video.dataset.id;
  const response = await fetch(`/apis/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    location.reload();
  }
};

form.addEventListener("submit", handleSubmit);

const handleDelete = async (event) => {
  event.preventDefault();
  const commentId = deleteBtn.dataset.id;

  const response = await fetch(`/apis/videos/${commentId}/comment/delete`, {
    method: "POST",
  });
  if (response.status === 201) {
    location.reload();
  }
};

deleteBtn.addEventListener("click", handleDelete);
