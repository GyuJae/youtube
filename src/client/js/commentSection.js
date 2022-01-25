import "regenerator-runtime";

const videoComments = document.querySelector("div.video_comments");
const form = videoComments.querySelector("form.video_comment_form");
const textarea = form.querySelector("textarea");
// const btn = form.querySelector("button");
const videoContainer = document.querySelector("div.video_detail_video");
const video = videoContainer.querySelector("video");

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
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
