import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface IProps {
  children?: ReactNode;
}

export default function MainLayout({ children }: IProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
