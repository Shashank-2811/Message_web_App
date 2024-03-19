import { FC } from "react";

import Modal from "../../UsersPage/Users/Modal";

interface ImageModalProps {
  isOpen?: boolean;
  onClose(): void;
  src?: string | null;
}

const ImageModal: FC<ImageModalProps> = ({
    isOpen,
    onClose,
    src
}) => {
    const imgSrc = src === null ? undefined : src;
  return(
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-80 h-80">
        <img 
          className="object-cover" 
          alt="Images" 
          src={imgSrc}
        />
        </div>

    </Modal>
  )
};

export default ImageModal;
