import { Outlet } from "react-router";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </>
  );
}

export default App;
