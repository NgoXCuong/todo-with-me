import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50">
      <img
        src="404_NotFound.png"
        alt="Not Found"
        className="max-w-full mb-6 w-100"
      />
      <p className="text-xl font-semibold">
        Bạn đang đi vào vùng cấm tuyệt mật !
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 font-medium text-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark"
      >
        Quay lại
      </a>
    </div>
  );
};

export default NotFound;
