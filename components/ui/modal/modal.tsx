import React, { JSX, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.scss';

export const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }): JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect((): void | (() => void) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event): void => {
      e.preventDefault();
      onClose();
    };

    const handleClose = (): void => {
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('close', handleClose);

    if (!dialog.open) dialog.showModal();

    return (): void => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className={styles.modal}
      onClick={(e): void => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (e.target === dialog) {
          onClose();
        }
      }}
      onClose={onClose}
    >
      {children}
    </dialog>,
    document.getElementById('modal-root')!,
  );
};
