"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import CreatePamphlet from "../CreatePamphlet";

type EditPamphletModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pamphlet: {
    id: number | string;
    title?: string;
    thumbnail_image?: string;
    content?: string;
    location?: {
      latitude?: number;
      longitude?: number;
      city?: string;
    };
    url_key?: string;
    short_description?: string;
    category?: string;
    category_name?: string;
    phone?: string;
    email?: string;
  };
  onPamphletUpdated: () => void;
};

const EditPamphletModal = ({
  isOpen,
  setIsOpen,
  pamphlet,
  onPamphletUpdated,
}: EditPamphletModalProps) => {
  const closeModal = () => setIsOpen(false);

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Edit Pamphlet
                </Dialog.Title>
                <div className="mt-4">
                  <CreatePamphlet
                    pamphletToEdit={pamphlet}
                    onPamphletCreated={() => {
                      onPamphletUpdated();
                      closeModal();
                    }}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditPamphletModal;
