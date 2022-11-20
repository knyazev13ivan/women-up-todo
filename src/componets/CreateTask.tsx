import React, { useState} from "react";
import { ITask } from "./TaskCard";
import { useCreateTaskMutation } from "../store/tasks/tasks.api";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from "./Loader";

const CreateTask: React.FC = () => {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);

  const [formState, setFormState] = useState<ITask>({
    id: "",
    title: "",
    description: "",
    date: "",
    attachment: "",
    isCompleted: false,
  });

  const [fileUrl, setFileUrl] = useState<string>("");

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }));

  const handleClickCreate = () => {
    setIsCreate((state) => !state);
  };

  const [createTask, { isLoading: isLoadingCreateTask }] =
    useCreateTaskMutation();

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    await createTask({ ...formState, attachment: fileUrl });

    await setFormState((state) => ({
      id: "",
      title: "",
      description: "",
      date: "",
      attachment: "",
      isCompleted: false,
    }));
    await setFileUrl("")

    await setIsCreate((state) => !state);
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
    <div className="create-modul">
      <button
        type="button"
        className="create-modul__btn"
        onClick={handleClickCreate}
      >
        {isCreate ? "Cancel" : "Add new task"}
      </button>

      {isCreate && (
        <form className="create-modul-form" onSubmit={handleSubmitCreate}>
          <label
            className="create-modul-form__label-text-field"
            htmlFor="titleInput"
          >
            <span className="create-modul-form__label-text">Заголовок</span>
            <input
              type="text"
              className="create-modul-form__input"
              value={formState.title}
              onChange={handleChange}
              name="title"
              id="titleInput"
            />
          </label>
          <label
            className="create-modul-form__label-text-field"
            htmlFor="descriptionInput"
          >
            <span className="create-modul-form__label-text">Описание</span>
            <input
              type="text"
              className="create-modul-form__input"
              value={formState.description}
              onChange={handleChange}
              name="description"
              id="descriptionInput"
            />
          </label>
          <label
            className="create-modul-form__label-text-field"
            htmlFor="dateInput"
          >
            <span className="create-modul-form__label-text">Дата</span>
            <input
              type="datetime-local"
              className="create-modul-form__input"
              value={formState.date}
              onChange={handleChange}
              name="date"
            />
          </label>
          <label
            className="create-modul-form__label-text-field"
            htmlFor="attachmentInput"
          >
            <span className="create-modul-form__label-text">Документ</span>
            <input
              type="file"
              onChange={handleChangeFileUpload}
              name="attachment"
            />
          </label>
          {isLoad ? (
            <button
              type="submit"
              className="create-modul-form__button-create"
              disabled
            >
              <Loader />
            </button>
          ) : (
            <button type="submit" className="create-modul-form__button-create">
              {isLoadingCreateTask ? <Loader /> : "Create"}
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default CreateTask;
