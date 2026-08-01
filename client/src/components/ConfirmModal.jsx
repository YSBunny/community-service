import { useEffect } from "react";

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "확인",
  isProcessing = false,
  onConfirm,
  onClose
}) {
  // 모달이 열려 있는 동안 뒤쪽 화면의 스크롤 막음
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleOverlayClick(event) {
    const clickedOverlay = event.target === event.currentTarget;

    if (clickedOverlay && !isProcessing) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <section className="modal" role="dialog" aria-modal="true">
        <h2 className="modal__title">{title}</h2>
        <p className="modal__message">{message}</p>

        <div className="modal__actions">
          <button
            type="button"
            className="modal__button modal__button--cancel"
            onClick={onClose}
            disabled={isProcessing}
          >
            취소
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
