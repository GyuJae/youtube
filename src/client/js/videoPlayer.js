const video = document.querySelector("video");

const handleEnded = () => {
  const { id } = video.dataset;
  fetch(`/apis/videos/${id}/view`, { method: "POST" });
};

video.addEventListener("ended", handleEnded);
