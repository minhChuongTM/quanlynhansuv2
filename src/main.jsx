import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { ConfirmProvider } from "material-ui-confirm";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
            <ConfirmProvider
            defaultOptions={{
                title: 'Xác nhận',
                confirmationText: 'Xác nhận',
                cancellationText: 'Hủy',
                confirmationButtonProps: { variant: 'contained', color: 'primary' },
                cancellationButtonProps: { variant: 'outlined' }
            }}
            >
            <App />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            </ConfirmProvider>
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
