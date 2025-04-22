import { PlansForm } from "@/lib/forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import withErrorHandler from "@/lib/ErrorHandler";
import { api, config } from "@/lib/axios-config";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
type Plan = {
  _id: string;
  type: string;
  amount: number;
  value: number;
  batteries: number;
  sdAmount: number;
  freeSwaps: number;
  swapCharge: number;
};
type PricingsList = {
  _id: string;
  vehicleModel: {
    image: string;
    name: string;
    topSpeed: string;
  };
  plans: Plan[];
};

function BussinessPricings() {
  const [searchParams] = useSearchParams();
  const bussinessId = searchParams.get("bussinessId");
  const [viewPricings, setViewPricings] = useState(false);
  const [pricingsList, setPricingsList] = useState([] as PricingsList[]);
  const getPricingsList = withErrorHandler(async () => {
    const res = await api.get(
      `${config.api_url}bussinessPricings?bussinessId=${bussinessId}`
    );
    setPricingsList(res.data.data);
  });

  const removePlan = withErrorHandler(async (planId: string, bpId: string) => {
    await api.delete(
      `${config.api_url}bussinessPricings/plan?planId=${planId}&bpId=${bpId}`
    );
    getPricingsList();
    toast.success("Success", {
      description: "Plan deleted Successfully.",
    });
  });

  useEffect(() => {
    getPricingsList();
  }, []);
  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="default"
          type="button"
          className="mb-3"
          onClick={() => {
            setViewPricings(!viewPricings);
            getPricingsList();
          }}
        >
          {!viewPricings && "View Pricings"}
          {viewPricings && "ADD Pricings"}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bussiness Pricings</CardTitle>
          {!viewPricings && (
            <CardDescription>add or update Pricings here.</CardDescription>
          )}
          {viewPricings && <CardDescription>Pricings List</CardDescription>}
        </CardHeader>
        <CardContent>
          {!viewPricings && <PlansForm bussinessId={bussinessId as string} />}
          {viewPricings &&
            pricingsList.length &&
            pricingsList.map((item: PricingsList) => (
              <>
                <Accordion type="single" collapsible key={item._id}>
                  <AccordionItem value={item._id}>
                    <AccordionTrigger>
                      <div className="flex justify-evenly w-full">
                        <div className="text-base">
                          {item.vehicleModel.name}
                        </div>
                        <div className="text-base">
                          {item.vehicleModel.topSpeed}
                        </div>
                        <img
                          src={item.vehicleModel.image}
                          alt="vehicleModel"
                          className="h-16 w-20"
                        />
                        <Button asChild variant="secondary">
                          <Link to={`/app/planForm?bpId=${item._id}`}>
                            Add Plan
                          </Link>
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableCaption>A list of Plans.</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>PlanType</TableHead>
                            <TableHead>PlanAmount</TableHead>
                            <TableHead>SD amount</TableHead>
                            <TableHead>PlanValue</TableHead>
                            <TableHead>Other Details</TableHead>
                            <TableHead>Remove</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item.plans.length > 0 &&
                            item.plans.map((plan: Plan) => (
                              <TableRow key={plan._id}>
                                <TableCell>{plan.type}</TableCell>
                                <TableCell>{plan.amount}</TableCell>
                                <TableCell>{plan.sdAmount}</TableCell>
                                <TableCell>{plan.value}</TableCell>
                                <TableCell>
                                  <div>
                                    <p>
                                      Batteries count :{" "}
                                      <span>{plan.batteries}</span>
                                    </p>
                                    <p>
                                      Free swaps : <span>{plan.freeSwaps}</span>
                                    </p>
                                    <p>
                                      swap Price :{" "}
                                      <span>{plan.swapCharge}</span>
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="icon"
                                    type="button"
                                    variant="destructive"
                                    onClick={() =>
                                      removePlan(plan._id, item._id)
                                    }
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Separator />
              </>
            ))}
        </CardContent>
      </Card>
    </>
  );
}

export default BussinessPricings;
