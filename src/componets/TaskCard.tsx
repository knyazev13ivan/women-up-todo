import React, { useState } from "react";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../store/tasks/tasks.api";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from "./Loader";
import dayjs from "dayjs";

export interface ITask {
  id: string;
  title: string;
  description: string;
  date: string;
  attachment: string;
  isCompleted: boolean;
}

const TaskCard: React.FC<ITask> = ({
  id,
  title,
  description,
  date,
  attachment,
  isCompleted,
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const [formState, setFormState] = useState<ITask>({
    id: id,
    title: title,
    description: description,
    date: date,
    attachment: attachment,
    isCompleted: isCompleted,
  });
  const formatedDate = dayjs(date).format("DD.MM.YYYY HH:mm");
  const isFailed = dayjs(date).diff(dayjs()) < 0;

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const handleClickComplite = async () => {
    await updateTask({ ...formState, isCompleted: !isCompleted });
    setFormState((state) => ({ ...state, isCompleted: !isCompleted }));
  };

  const [updateTask, { isError: isErrorEdit }] = useUpdateTaskMutation();
  const handleClickUpdate = async () => {
    if (isEdit) {
      await updateTask({
        ...formState,
        attachment: fileUrl ? fileUrl : attachment,
      });
    }
    setIsEdit((state) => !state);
  };

  const [deleteTask, { isError: isErrorDelete }] = useDeleteTaskMutation();
  const handleClickDelete = async () => {
    await deleteTask(id);
  };

  const handleChangeFileUpload = async (
    e: React.InvalidEvent<HTMLInputElement>
  ) => {
    setIsLoad(true);

    if (!!e.target.files) {
      const fileRef = ref(
        storage,
        `files/${formState.title + e.target.files[0].name}`
      );
      await uploadBytes(fileRef, e.target.files[0]).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setFileUrl((prev) => url);
        });
      });
    }

    setIsLoad(false);
  };

  return (
    <div
      className={`task-card ${formState.isCompleted && "completed"} ${
        isFailed && "failed"
      }`}
    >
      <div className="task-card-body">
        {isEdit ? (
          <>
            <label className="create-modul-form__label-text-field">
              <span className="create-modul-form__label-text">Заголовок</span>
              <input
                type="text"
                className="create-modul-form__input"
                value={formState.title}
                onChange={handleChange}
                name="title"
              />
            </label>
            <label className="create-modul-form__label-text-field">
              <span className="create-modul-form__label-text">Описание</span>
              <input
                type="text"
                className="create-modul-form__input"
                value={formState.description}
                onChange={handleChange}
                name="description"
              />
            </label>
            <label className="create-modul-form__label-text-field">
              <span className="create-modul-form__label-text">
                Дата окончания
              </span>
              <input
                type="datetime-local"
                className="create-modul-form__input"
                value={formState.date}
                onChange={handleChange}
                name="date"
              />
            </label>
            {attachment && (
              <div className="task-card-body__attachment">
                Документ{" "}
                <a href={attachment} className="download-button" download>
                  download
                </a>
              </div>
            )}
            <label
              className="create-modul-form__label-text-field"
              htmlFor="attachmentInput"
            >
              <span className="create-modul-form__label-text">Изменить</span>
              <input
                type="file"
                onChange={handleChangeFileUpload}
                name="attachment"
              />
            </label>
          </>
        ) : (
          <>
            <h3 className="task-card-body__title">{title}</h3>
            <div className="task-card-body__description">{description}</div>
            <div className="task-card-body__date">{formatedDate}</div>
            {attachment && (
              <div className="task-card-body__attachment">
                attached file{" "}
                <a href={attachment} className="download-button" download>
                  download
                </a>
              </div>
            )}
          </>
        )}
      </div>

      <div className="task-card-control-buttons">
        {!isEdit && (
          <button
            type="button"
            className="task-card-control-buttons__btn"
            onClick={handleClickComplite}
          >
            {isCompleted ? "Start again" : "Complete"}
          </button>
        )}
        {isLoad ? (
          <button
            type="button"
            className="task-card-control-buttons__btn"
            onClick={handleClickUpdate}
            disabled
          >
            <Loader />
          </button>
        ) : (
          <button
            type="button"
            className="task-card-control-buttons__btn"
            onClick={handleClickUpdate}
          >
            {isEdit ? "Done" : "Edit"}
          </button>
        )}
        <button
          type="button"
          className="task-card-control-buttons__btn"
          onClick={handleClickDelete}
        >
          Delete
        </button>
      </div>

      {(isErrorEdit || isErrorDelete) && (
        <div className="task-card__warning">
          ERROR: "Ошибка при выполнении операции"
        </div>
      )}
    </div>
  );
};

export default React.memo(TaskCard);
