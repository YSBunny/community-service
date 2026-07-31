import { useEffect } from "react";

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  isProcessing = false,
  onConfirm,
  onClose
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    document.body.classList.add("modal-open");

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isProcessing) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("modal-open");

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && !isProcessing) {
      onClose();
    }
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
      >
        <h2 id="confirm-modal-title" className="modal__title">
          {title}
        </h2>

        <p id="confirm-modal-message" className="modal__message">
          {message}
        </p>

        <div className="modal__actions">
          <button
            type="button"
            className="modal__button modal__button--cancel"
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="modal__button modal__button--confirm"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "처리 중..." : confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmModal;
