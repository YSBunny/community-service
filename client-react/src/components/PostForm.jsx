import { useState } from "react";

import "../styles/PostForm.css";

function PostForm({
  initialValues = {
    title: "",
    content: ""
  },
  existingImageName = "",
  onSubmit,
  submitLabel
}) {
  // 폼 상태
  const [form, setForm] = useState(() => ({
    title: initialValues.title ?? "",
    content: initialValues.content ?? ""
  }));

  // 폼에 포커싱이 되었었는지
  const [touched, setTouched] = useState({
    title: false,
    content: false
  });

  // 게시글 이미지 상태
  const [postImage, setPostImage] = useState(null);

  // 각 필드 안내 문구
  let titleHelperText = "";
  let contentHelperText = "";

  // 제목에 포커싱 되었었는데 값이 비어있을 때
  if (touched.title && form.title.trim() === "") {
    titleHelperText = "* 제목을 입력해주세요.";
  }

  // 내용에 포커싱 되었었는데 값이 비어있을 때
  if (touched.content && form.content.trim() === "") {
    contentHelperText = "* 내용을 입력해주세요.";
  }

  // 필드 값이 전부 입력되었는지
  const isFormFilled =
    form.title.trim() !== "" &&
    form.content.trim() !== "";

  // 필드 입력 인식
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
  }

  // 필드 포커스 인식
  function handleBlur(event) {
    const { name } = event.target;

    setTouched((previousTouched) => ({
      ...previousTouched,
      [name]: true
    }));
  }

  // 이미지 파일 선택 인식
  function handleImageChange(event) {
    const selectedFile = event.currentTarget.files?.[0] ?? null;

    setPostImage(selectedFile);
  }

  // 폼 제출
  async function handleSubmit(event) {
    event.preventDefault();

    setTouched({
      title: true,
      content: true
    });

    if (!isFormFilled) {
      return;
    }

    await onSubmit({
      title: form.title.trim(),
      content: form.content.trim(),
      postImage
    });
  }

  const displayedImageName = postImage?.name || existingImageName || "선택된 이미지 없음";

  return (
    <form
      className="post-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-group">
        <label
          htmlFor="title"
          className="form-label"
        >
          제목
        </label>

        <input
          type="text"
          id="title"
          name="title"
          className="title-input"
          placeholder="제목을 입력하세요"
          value={form.title}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={
            titleHelperText !== ""
          }
          aria-describedby="title-helper"
        />

        <p
          id="title-helper"
          className="helper-text"
        >
          {titleHelperText}
        </p>
      </div>

      <div className="form-group">
        <label
          htmlFor="content"
          className="form-label"
        >
          내용
        </label>

        <textarea
          id="content"
          name="content"
          className="content-textarea"
          placeholder="내용을 입력하세요"
          value={form.content}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={
            contentHelperText !== ""
          }
          aria-describedby="content-helper"
        />

        <p
          id="content-helper"
          className="helper-text"
        >
          {contentHelperText}
        </p>
      </div>

      <div className="form-group">
        <label
          htmlFor="postImage"
          className="form-label"
        >
          이미지
        </label>

        <div className="file-row">
          <label
            htmlFor="postImage"
            className="file-button"
          >
            이미지 선택
          </label>

          <input
            type="file"
            id="postImage"
            name="postImage"
            className="file-input"
            accept="image/*"
            onChange={handleImageChange}
          />

          <span className="file-name">
            {displayedImageName}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={!isFormFilled}
      >
        {submitLabel}
      </button>
    </form>
  );
}

export default PostForm;
