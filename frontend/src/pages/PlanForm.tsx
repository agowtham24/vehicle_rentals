import { useSearchParams } from "react-router-dom";
import { SinglePlanForm } from "@/lib/forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function PlanForm() {
  const [searchParams] = useSearchParams();
  const bpId = searchParams.get("bpId");
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add Plan</CardTitle>
          <CardDescription>
            Add Plan to existing Bussiness Pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SinglePlanForm bpId={bpId as string} />
        </CardContent>
      </Card>
    </>
  );
}

export default PlanForm;
