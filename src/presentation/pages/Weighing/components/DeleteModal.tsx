import { Modal } from "@components/misc/Modal";
import { Button } from "@components/ui/button";
import WeighingController from "@infrastructure/controllers/WeighingController";
import { useRequest } from "ahooks";
import { Loader2 } from "lucide-react";

interface DeleteModalProps {
  onClose: (e: boolean) => void;
  id: number | null;
  onAction?: () => void;
}

const DeleteModal = ({
  onClose,
  onAction = () => {},
  id,
}: DeleteModalProps) => {
  const { run: runRemove, loading: loadingRemove } = useRequest(
    () => WeighingController.remove(id || 0),
    {
      manual: true,
      onSuccess: () => {
        onAction();
        onClose(false);
      },
    }
  );

  return (
    <Modal
      width="auto"
      height="auto"
      title="Eliminar Pesaje"
      onClose={(e: boolean) => {
        onClose(e);
      }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-4 w-full">
        <div>¿Estás seguro de que deseas eliminar este registro?</div>
        <div className="flex items-center justify-center gap-2 w-full mt-2">
          <Button
            disabled={loadingRemove}
            className="flex-1"
            onClick={() => onClose(false)}
          >
            Cancelar
          </Button>
          <Button
            disabled={loadingRemove}
            variant="destructive"
            className="flex-1"
            onClick={() => runRemove()}
          >
            {loadingRemove && <Loader2 className="animate-spin" />}
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
