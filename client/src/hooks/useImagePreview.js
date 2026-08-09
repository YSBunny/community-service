import { useEffect, useRef, useState } from "react";

function useImagePreview() {
  const objectUrlRef = useRef("");
  const [previewUrl, setPreviewUrl] = useState("");

  function updatePreview(file) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = file ? URL.createObjectURL(file) : "";
    objectUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  }

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return [previewUrl, updatePreview];
}

export default useImagePreview;
