import { setFarms } from "@application/slices/farmSlice";
import { RootState } from "@application/store/store";
import { Modal } from "@components/misc/Modal";
import { Button } from "@components/ui/button";
import FarmController from "@infrastructure/controllers/FarmController";
import { useRequest } from "ahooks";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DeleteModalProps {
  onClose: (e: boolean) => void;
  id?: number;
}

const DeleteModal = ({ onClose, id }: DeleteModalProps) => {
  const farms = useSelector((state: RootState) => state.farm);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { run: runRemove, loading } = useRequest(
    () => FarmController.remove(Number(id)),
    {
      manual: true,
      onSuccess: () => {
        toast.success("Hacienda eliminada exitosamente.");
        const updatedFarms = farms
          .filter((farm) => farm?.id !== id)
          .map((farm, index) => ({
            ...farm,
            current: index === 0,
          }));
        dispatch(setFarms(updatedFarms));
        onClose(false);
        navigate("/dashboard");
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
      title="Eliminar Hacienda"
      onClose={(e: boolean) => {
        onClose(e);
      }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-4 w-full">
        <div>¿Estás seguro de que deseas eliminar esta hacienda?</div>
        <div className="flex items-center justify-center gap-2 w-full mt-2">
          <Button
            className="flex-1"
            onClick={() => onClose(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            disabled={loading}
            onClick={() => runRemove()}
          >
            {loading && <Loader2 className="animate-spin" />}
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
