'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useGeneralStateStore } from '@/store/GeneralStateStore';
import { ModalContentType } from '@/src/lib/type';

export default function Modal(props: {
  isOpened: boolean;
  setIsOpen: (param: boolean) => void;
  contentState: ModalContentType;
}) {
  return (
    <Dialog
      open={props.isOpened}
      onClose={props.setIsOpen}
      className='relative z-10'
    >
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
      />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
          >
            <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
              <div className='sm:flex sm:items-start'>
                <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                  <ExclamationTriangleIcon
                    aria-hidden='true'
                    className='h-6 w-6 text-red-600'
                  />
                </div>
                <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                  <DialogTitle
                    as='h3'
                    className='text-base font-semibold leading-6 text-gray-900'
                  >
                    {props.contentState.title}
                  </DialogTitle>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      {props.contentState.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
              <button
                type='button'
                onClick={() => props.setIsOpen(false)}
                className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
              >
                Understood
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
