import { Outlet } from 'react-router-dom';


export const AdminLayout = () => {
  return (
    <>
      <main className=" m-auto mx-3  flex flex-col items-center justify-start">
        <Outlet />
      </main>
    </>
  );
};