import { useState } from "react";

import "../styles/PostForm.css";

function PostForm({
  initialTitle = "",
  initialContent = "",
  existingImageName = "",
  submitLabel,
  isSubmitting,
  submitError,
  onSubmit
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [postImage, setPostImage] = useState(null);
  const [titleTouched, setTitleTouched] = useState(false);
  const [contentTouched, setContentTouched] = useState(false);

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();
  const isFormValid = trimmedTitle !== "" && trimmedContent !== "";

  const titleError = titleTouched && trimmedTitle === ""
    ? "* 제목을 입력해주세요."
    : "";

  const contentError = contentTouched && trimmedContent === ""
    ? "* 내용을 입력해주세요."
    : "";

  function handleSubmit(event) {
    event.preventDefault();
    setTitleTouched(true);
    setContentTouched(true);

    if (!isFormValid || isSubmitting) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      content: trimmedContent,
      postImage
    });
  }

  const imageName = postImage?.name || existingImageName || "선택된 이미지 없음";

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="title" className="form-label">제목</label>
        <input
          id="title"
          type="text"
          className="title-input"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={() => setTitleTouched(true)}
        />
        <p className="helper-text">{titleError}</p>
      </div>

      <div className="form-group">
        <label htmlFor="content" className="form-label">내용</label>
        <textarea
          id="content"
          className="content-textarea"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onBlur={() => setContentTouched(true)}
        />
        <p className="helper-text">{contentError}</p>
      </div>

      <div className="form-group">
        <label htmlFor="postImage" className="form-label">이미지</label>
        <div className="file-row">
          <label htmlFor="postImage" className="file-button">이미지 선택</label>
          <input
            id="postImage"
            type="file"
            className="file-input"
            accept="image/*"
            onChange={(event) => setPostImage(event.target.files[0] || null)}
          />
          <span className="file-name">{imageName}</span>
        </div>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? "처리 중..." : submitLabel}
      </button>

      {submitError && <p className="form-error" role="alert">{submitError}</p>}
    </form>
  );
}

export default PostForm;
