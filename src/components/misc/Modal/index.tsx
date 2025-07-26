import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";

import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: (e: boolean) => void;
  width?: string;
  height?: string;
  title?: string;
}

export function Modal({
  children,
  onClose,
  width = "1000px",
  height = "600px",
  title,
}: ModalProps) {
  return (
    <Dialog
      modal
      open={true}
      onOpenChange={(e) => {
        onClose(e);
      }}
    >
      <DialogContent
        className="max-h-[90vh] sm:max-w-[90vw] max-w-[90vw] overflow-y-auto flex flex-col p-0"
        style={{ width, height }}
      >
        {title && (
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        )}
        <div className="flex flex-col overflow-y-auto px-6 pb-6 h-full">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
