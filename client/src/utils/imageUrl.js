import defaultProfileImage from "../assets/images/defaultProfile.png";

const SERVER_URL = (import.meta.env.VITE_SERVER_URL ?? "").replace(/\/$/, "");

function makeServerImageUrl(image, folder) {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${SERVER_URL}${image}`;
  }

  return `${SERVER_URL}/uploads/${folder}/${encodeURIComponent(image)}`;
}

export function getProfileImageUrl(image) {
  return makeServerImageUrl(image, "profiles") || defaultProfileImage;
}

export function getPostImageUrl(image) {
  return makeServerImageUrl(image, "posts");
}

export function useDefaultProfileImage(event) {
  event.currentTarget.src = defaultProfileImage;
}
