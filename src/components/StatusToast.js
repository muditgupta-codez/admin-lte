import { ToastContainer } from "react-toastify";
const StatusToast = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={2000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      theme="dark"
    />
  );
};
export default StatusToast;
