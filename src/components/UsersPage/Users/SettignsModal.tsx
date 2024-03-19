import React, { FC, useRef, useState } from "react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Modal from "./Modal";
import InputForm from "../../AuthHome/AuthForm/InputForm";
import ButtonForm from "../../AuthHome/AuthForm/ButtonForm";

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

interface SettignsModalProps {
  currentUser: User | null;
  onClose: () => void;
  isOpen?: boolean;
}

const SettignsModal: FC<SettignsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
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
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch("image");

  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  const handleUpload = async () => {
    if (!window.cloudinary) {
      console.error("Cloudinary is not available.");
      return;
    }

    cloudinaryRef.current = window.cloudinary;

    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
      },
      async function (error: any, result: any) {
        if (error) {
          console.error("Error during upload:", error);
          return;
        }

        if (result.info.secure_url) {
          setValue("image", result?.info?.secure_url, {
            shouldValidate: true,
          });
        }
      }
    );

    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }
    axios
      .post(`${SERVER_URL}/api/setting`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        onClose();
        navigate(0);
      })
      .catch(() => {
        toast.error("Something Went Wrong!");
      })
      .finally(() => setIsLoading(false));
  };

  const verifyEmail = () => {
    try {
      const token = localStorage.getItem("token");

      const userResponse = axios.get(
        `${SERVER_URL}/api/verifyemail`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              "
            >
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information.
            </p>
            <p className="text-md text-center font-bold mb-4">
              {currentUser?.emailVerified ? (
                <span className="text-green-500">Verified</span>
              ) : (
                <span className="text-yellow-500">
                  <p>Please verify your email address.</p>
                  <button type="button" onClick={verifyEmail} className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Verify
                  </button>
                </span>
              )}
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <InputForm
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {currentUser?.name}
                </p>
                <label
                  htmlFor="photo"
                  className="
                    block 
                    text-sm 
                    font-medium 
                    leading-6 
                    text-gray-900
                  "
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <img
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={image || currentUser?.image || "placeholder.jpg"}
                    alt="Avatar"
                  />
                  <ButtonForm
                    disabled={isLoading}
                    secondary
                    type="button"
                    onClick={handleUpload}
                  >
                    change
                  </ButtonForm>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="
            mt-6 
            flex 
            items-center 
            justify-end 
            gap-x-6
          "
        >
          <ButtonForm
            disabled={isLoading}
            secondary
            type="button"
            onClick={onClose}
          >
            Cancel
          </ButtonForm>
          <ButtonForm
            disabled={isLoading}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </ButtonForm>
        </div>
      </form>
    </Modal>
  );
};

export default SettignsModal;
