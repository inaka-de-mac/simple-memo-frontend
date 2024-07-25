import Modal from "@mui/material/Modal";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";

const HeaderModal: React.VFC = () => {
  const {
    errorMessage,
    setErrorMessage,
    deleteConfirm,
    setDeleteConfirm,
    handleDeleteClick,
    modalOpen,
    setModalOpen,
  } = useAuthContext();

  useEffect(() => {
    setErrorMessage("");
    setDeleteConfirm("");
  }, [modalOpen]);

  const handleDeleteConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setErrorMessage("");
    setDeleteConfirm(e.target.value);
  };

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <div className="header__modal">
        <h2 className="modal__title">アカウント削除</h2>
        <div className="modal__content">
          <p className="modal__text">削除すると以下の情報がすべて失われます</p>
          <ul className="modal__list">
            <li className="modal__list-item">・プロフィール情報</li>
            <li className="modal__list-item">・メモ情報</li>
          </ul>
        </div>
        <div className="modal__content">
          <p className="modal__text">
            確認のため「アカウント削除」と入力してください
          </p>
          <input
            className="common__form common__form--input"
            type="text"
            placeholder="アカウント削除"
            value={deleteConfirm}
            onChange={handleDeleteConfirmChange}
          />
        </div>
        <div className="modal__button-box">
          <button
            className="common__form common__form--button modal__button modal__button--cancel"
            onClick={() => setModalOpen(false)}
          >
            キャンセル
          </button>
          <button
            className="common__form common__form--button modal__button modal__button--delete"
            onClick={handleDeleteClick}
          >
            削除
          </button>
        </div>
        <div className="common__error">{errorMessage}</div>
      </div>
    </Modal>
  );
};

export default HeaderModal;
