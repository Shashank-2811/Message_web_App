import React, { FC, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import axios from "axios";

import useConversation from "../../../utils/hooks/useConversation";
import Modal from "../../UsersPage/Users/Modal";
import { Dialog } from "@headlessui/react";
import ButtonForm from "../../AuthHome/AuthForm/ButtonForm";

const SERVER_URL = process.env.REACT_APP_SERVER_PAGE_URL;

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const { conversationId } = useConversation();
  const [isLoading, setLoading] = useState(false);

  const onDelete = useCallback(() => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }
      axios.delete(`${SERVER_URL}/api/conversationDelete/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
      navigate(-1);
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error deleting conversation:", error);
    } finally {
      setLoading(false);
    }
  }, [conversationId, navigate, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div
          className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10
          "
        >
          <FiAlertTriangle
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div
          className="
            mt-3 
            text-center 
            sm:ml-4 
            sm:mt-0 
            sm:text-left
          "
        >
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Delete conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this conversation?
              <strong> This action cannot be undone.</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <ButtonForm disabled={isLoading} danger onClick={onDelete}>
          Delete
        </ButtonForm>
        <ButtonForm disabled={isLoading} secondary onClick={onClose}>
          Cancel
        </ButtonForm>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
