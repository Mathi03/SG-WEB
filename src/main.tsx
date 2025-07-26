/* eslint-disable react-refresh/only-export-components */
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "/src/index.css";
import ErrorBoundary, { ErrorScreen } from "@components/misc/ErrorBoundary";
import App from "./App";
import { store } from "@application/store/store";
import disableReactDevTools from "@utils/disableReactDevTools";

const BUILD_MODE = import.meta.env.VITE_BUILD_MODE;
const APP_TITLE = import.meta.env.VITE_APP_TITLE;

if (BUILD_MODE === "production") disableReactDevTools();
if (APP_TITLE) document.title = APP_TITLE;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

const Error = () => <ErrorScreen callback={() => sessionStorage.clear()} />;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary fallback={Error}>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
);
