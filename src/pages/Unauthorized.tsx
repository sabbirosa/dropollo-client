import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Unauthorized Access</h1>
      <p className="mt-4">
        You do not have permission to view this page. Please contact the
        administrator if you believe this is an error.
      </p>
      <Button className="mt-6">
        <Link to="/">Go to Home</Link>
      </Button>
    </div>
  );
}
