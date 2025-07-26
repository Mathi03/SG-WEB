import { Button } from "@components/ui/button";
import { Bug } from "lucide-react";

interface ErrorScreenProps {
  callback?: () => void;
}

const ErrorScreen = ({ callback }: ErrorScreenProps) => {
  const handleReload = () => {
    callback?.();
    window.location.reload();
  };

  return (
    <div className="grid place-content-center justify-items-center h-full w-full">
      <Bug />
      <span className="m-2">An internal error has occurred to fix it</span>
      <Button onClick={handleReload}>click here to reload the screen</Button>
    </div>
  );
};

export default ErrorScreen;
