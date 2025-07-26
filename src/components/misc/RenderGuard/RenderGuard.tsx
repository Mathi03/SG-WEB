import { Outlet } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

type RenderGuardProps = {
  rendered: boolean;
};

const RenderGuard = ({ rendered }: RenderGuardProps) => {
  if (!rendered) {
    return (
      <div
        className="grid place-content-center w-full"
        style={{ height: "calc(100vh - 107.71px" }}
      >
        <ClipLoader
          color={"#000"}
          loading={true}
          cssOverride={{}}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return <Outlet />;
};

export default RenderGuard;
