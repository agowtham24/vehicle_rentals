import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Registration Successful</h1>
      <p className="text-muted-foreground mb-6">
        Thank you for registering the rider. You can now proceed to manage riders or register another one.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate("/rider-register")}>
          Register Another
        </Button>
      </div>
    </div>
  );
};
