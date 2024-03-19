import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import { useRef } from "react";

import useConversation from "../../../utils/hooks/useConversation";
import MessageInput from "./MessageInput";
import { Button } from "../../../@/components/ui/button";
import { HiPaperAirplane } from "react-icons/hi";
import useFetchCurrentUser from "../../../utils/hooks/useFetchCurrentUser";

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

declare global {
  interface Window {
    cloudinary: any;
  }
}

const Form = () => {
  const { conversationId } = useConversation();
  const currentUserData = useFetchCurrentUser() as User | null;
  const userEmail = currentUserData?.email;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

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

        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not found");
          throw new Error("Token not found");
        }
        if (result.info.secure_url) {
          try {
            await axios.post(
              `${SERVER_URL}/api/message?userEmail=${userEmail}`,
              {
                image: result.info.secure_url,
                conversationId: conversationId,
              }
            );
          } catch (error: any) {
            console.error("Form response error:", error.message);
          }
        }
      }
    );

    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not found");
      throw new Error("Token not found");
    }
    setValue("message", "", { shouldValidate: true });

    try {
      await axios.post(`${SERVER_URL}/api/message?userEmail=${userEmail}`, {
        ...data,
        conversationId,
      });
    } catch (error: any) {
      console.error("form Response");
      console.error("Handle error", error.message);
    }
  };

  return (
    <div
      className="
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      "
    >
      <button onClick={handleUpload}>
        <HiPhoto size={30} className="text-sky-300" />
      </button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write your message"
        />
        <Button
          type="submit"
          className="
           rounded-full 
           p-2 
           bg-sky-500 
           cursor-pointer 
           hover:bg-sky-600 
           transition
         "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </Button>
      </form>
    </div>
  );
};

export default Form;
