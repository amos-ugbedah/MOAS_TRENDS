import { CircleX } from "lucide-react";
import React, { use } from "react";
import { createPortal } from "react-dom";
import ModalContext from "../../context/modalContext";

const CustomModal = ({ title, children, className, type }) => {
    const {modal, onClose} = use(ModalContext)
  if (!modal.isOpen || modal.type !== type) return null;
console.log(modal)
  return createPortal(
    <section className="fixed inset-0 bg-black/80 z-40 overflow-hidden h-screen flex justify-center items-center">
      <div className={`bg-white lg:w-1/2 w-[90%] mx-auto rounded-lg shadow-md p-4 space-y-5 ${className}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-base text-purple-500 font-medium">{title}</h2>
          <CircleX className="text-purple-500 cursor-pointer" onClick={onClose} />
        </div>
        <section>{children}</section>
      </div>
    </section>,
    document.getElementById("modal-root") // Ensure this div exists in your index.html
  );
};

export default CustomModal;
