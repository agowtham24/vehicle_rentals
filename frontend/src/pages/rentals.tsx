import withErrorHandler from "@/lib/ErrorHandler";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api, config } from "@/lib/axios-config";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Link } from "react-router-dom";

function Rentals() {
  const [rentals, setRentals] = useState([] as any[]);
  const [status, setStatus] = useState(0);
  const userId = sessionStorage.getItem("userId") as string;
  const getRentals = withErrorHandler(async (id, status) => {
    const res = await api.get(
      `${config.api_url}rentals?bussinessId=${id}&status=${status}`
    );
    setRentals(res.data.data);
  });

  const manageStatus = withErrorHandler(async (status: number) => {
    setStatus(status);
  });

  const updateRental = withErrorHandler(async (id: string, riderId: string) => {
    await api.post(`${config.api_url}rentals/deAssignRider`, {
      rentalId: id,
      riderId,
    });
 manageStatus(1)
    toast.success("success", {
      description: "Rental updated success",
    });
  });

  useEffect(() => {
    getRentals(userId, status);
  }, [status]);

  return (
    <>
      <p className="text-xl">Assign Rider To Rentals</p>
      <div className="flex justify-between mt-3">
        <Tabs defaultValue="READY_TO_ASSIGN" className="w-full">
          <TabsList>
            <TabsTrigger
              className="pr-3"
              value="READY_TO_ASSIGN"
              onClick={() => manageStatus(0)}
            >
              <Button variant="outline">READY_TO_ASSIGN</Button>
            </TabsTrigger>
            <TabsTrigger value="ASSIGNED" onClick={() => manageStatus(1)}>
              <Button variant="outline">ASSIGNED</Button>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="READY_TO_ASSIGN">
            <Table>
              <TableCaption>A list of All Active rentals.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>AssetId</TableHead>
                  <TableHead>Plan Details</TableHead>
                  <TableHead>Rental End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.length > 0 &&
                  rentals.map((rental) => (
                    <TableRow key={rental._id}>
                      <TableCell>{rental.vehicle?.assetId}</TableCell>
                      <TableCell>
                        <div>{`${rental.plan?.value} ${rental.plan?.type}s`}</div>
                      </TableCell>
                      <TableCell>
                        {
                          new Date(rental.rentalEndDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </TableCell>
                      <TableCell className="text-primary">
                        {rental.status === 0 && "READY_TO_ASSIGN"}
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="secondary" type="button">
                          <Link to={`/app/assignRider?rentalId=${rental._id}`}>
                            Assign Rider
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="ASSIGNED">
            <Table>
              <TableCaption>A list of All Assigned rentals.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>AssetId</TableHead>
                  <TableHead>Plan Details</TableHead>
                  <TableHead>Rider Details</TableHead>
                  <TableHead>Rental End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.length > 0 &&
                  rentals.map((rental) => (
                    <TableRow key={rental._id}>
                      <TableCell>{rental.vehicle?.assetId}</TableCell>
                      <TableCell>
                        <div>{`${rental.plan?.value} ${rental.plan?.type}s`}</div>
                      </TableCell>
                      <TableCell>
                        <div>{rental.rider?.name}</div>
                        <div>{rental.rider?.mobile}</div>
                      </TableCell>
                      <TableCell>
                        {
                          new Date(rental.rentalEndDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </TableCell>
                      <TableCell className="text-destructive">
                        {rental.status === 1 && "RIDER_ASSIGNED"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => updateRental(rental._id,rental.rider?._id)}
                        >
                          De-Assign Rider
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default Rentals;
