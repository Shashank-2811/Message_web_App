import { FC, useState } from "react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Modal from "../UsersPage/Users/Modal";
import InputForm from "../AuthHome/AuthForm/InputForm";
import SelectMembers from "./SelectMembers";
import ButtonForm from "../AuthHome/AuthForm/ButtonForm";

const SERVER_URL = process.env.REACT_APP_SERVER_PAGE_URL;

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  conversationIds: [];
  seenMessageIds: [];
}

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  otherUsers: User[];
}

const GroupChatModal: FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  otherUsers,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    axios
      .post(
        `${SERVER_URL}/api/conversations`,
        {
          ...data,
          isGroup: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        onClose();
        navigate(0);
      })
      .catch((error: any) => {
        console.log("GroupChatModal: ", error.message);
        toast.error("Something Went Wrong");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12 w-96">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <InputForm
                register={register}
                label="Name"
                id="name"
                disabled={isLoading}
                required
                errors={errors}
              />
              <SelectMembers
                disabled={isLoading}
                label="Members"
                options={otherUsers.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <ButtonForm
            disabled={isLoading}
            onClick={onClose}
            type="button"
            secondary
          >
            Cancel
          </ButtonForm>
          <ButtonForm disabled={isLoading} type="submit">
            Create
          </ButtonForm>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
