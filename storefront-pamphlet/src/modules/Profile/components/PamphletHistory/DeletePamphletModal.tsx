"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { usePamphlets } from "@/hooks/usePamphlets";

type DeletePamphletModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pamphlet_id: number | string;
  onPamphletDeleted: () => void;
};

const DeletePamphletModal = ({
  isOpen,
  setIsOpen,
  pamphlet_id,
  onPamphletDeleted,
}: DeletePamphletModalProps) => {
  const { deleteItem, saving } = usePamphlets();
  const closeModal = () => setIsOpen(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    setDeleteError("");
    try {
      await deleteItem(pamphlet_id);
      onPamphletDeleted();
      closeModal();
    } catch (error: unknown) {
      const err = error as { message?: string };
      setDeleteError(
        err.message || "Failed to delete pamphlet. Please try again.",
      );
      setTimeout(() => {
        setDeleteError("");
      }, 5000);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* Bug Fix #8: fixed `rounded-2xltext-gray-500` → `rounded-2xl` */}
              <Dialog.Panel className="bg-white rounded-lg w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-800"
                >
                  Delete Pamphlet
                </Dialog.Title>
                <div className="mt-2">
                  {/* Bug Fix #8: fixed `text-smtext-gray-500` → `text-sm text-gray-500` */}
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this pamphlet? This action
                    cannot be undone.
                  </p>
                  {deleteError && (
                    <p className="mt-2 text-sm text-red-500">{deleteError}</p>
                  )}
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    {saving ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeletePamphletModal;
