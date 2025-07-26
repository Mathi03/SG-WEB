import { Modal } from "@components/misc/Modal";
import { Button } from "@components/ui/button";
import GeneticsController from "@infrastructure/controllers/GeneticsController";
import { useRequest } from "ahooks";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    () => GeneticsController.remove(id || 0),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Registro genético eliminado exitosamente.");
        onAction();
        onClose(false);
      },
      onError: (error) => {
        toast.error(`Error: ${error.message}`);
      },
    }
  );

  return (
    <Modal
      width="auto"
      height="auto"
      title="Eliminar Registro Genético"
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
