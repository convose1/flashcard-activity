import { Outlet } from "react-router-dom";

const SimpleLayout = () => {
  return (
    <main>
      <div className="p-4" style={{width: "100vw", height: "100vh"}}>
        <Outlet />
      </div>
    </main>
  );
};

export default SimpleLayout;
