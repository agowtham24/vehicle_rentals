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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import withErrorHandler from "@/lib/ErrorHandler";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AssignVehicleToBussiness,
  AssignVehicleToBussiness2,
} from "@/lib/forms";
import { toast } from "sonner";

type Vehicle = {
  _id: string;
  assetId: string;
  rider: {
    _id: string;
    name: string;
    mobile: string;
  };
  rental: {
    _id: string;
    bussiness: {
      name: string;
      image: string;
    };
  };
  vehicleModelId: string;
  batteryId2: string;
  batteryId1: string;
  chargerId: string;
  status: string;
};

function Vehicles() {
  const [vehicles, setVehicles] = useState([] as Vehicle[]);
  const [status, setStatus] = useState("READY_TO_ASSIGN");
  const getVehicles = withErrorHandler(async (status: string) => {
    const res = await api.get(`${config.api_url}vehicles?status=${status}`);
    setVehicles(res.data.data);
  });

  const manageStatus = withErrorHandler(async (status: string) => {
    setStatus(status);
  });

  const deAssignVehicle = withErrorHandler(
    async (
      rentalId: string,
      vehicleId: string,
      // batteries: [{ _id: string; name: string }]
    ) => {
      const data = {
        rentalId,
        vehicleId,
        // batteries: batteries.map((item) => item._id),
      };

      await api.post(`${config.api_url}rentals/deAssign`, data);
      getVehicles(status);
      toast.success("Success", {
        description: "Vehicle De-assigned success",
      });
    }
  );

  useEffect(() => {
    getVehicles(status);
  }, [status]);

  return (
    <>
      <p className="text-xl">Vehicles</p>
      <div className="flex justify-between mt-3">
        <Tabs defaultValue="READY_TO_ASSIGN" className="w-full">
          <TabsList>
            <TabsTrigger
              value="READY_TO_ASSIGN"
              onClick={() => manageStatus("READY_TO_ASSIGN")}
            >
              READY TO ASSIGN
            </TabsTrigger>
            <TabsTrigger
              value="ASSIGNED"
              onClick={() => manageStatus("ASSIGNED")}
            >
              ASSIGNED
            </TabsTrigger>
          </TabsList>
          <TabsContent value="READY_TO_ASSIGN">
            <Table>
              <TableCaption>A list of All Active Vehicles.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>AssetId</TableHead>
                  <TableHead>VehicleModel Name</TableHead>
                  {/* <TableHead>Image</TableHead> */}
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.length > 0 &&
                  vehicles.map((vehicle: Vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell>{vehicle.assetId}</TableCell>
                      <TableCell>{vehicle.vehicleModelId}</TableCell>
                      {/* <TableCell>
                        <img
                          src={vehicle.vehicleModel.image}
                          alt="vehicle"
                          className="h-16 w-20"
                        />
                      </TableCell> */}
                      <TableCell className="text-primary">
                        {vehicle.status}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="ASSIGNED">
            <Table>
              <TableCaption>A list of All Active Vehicles.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>AssetId</TableHead>
                  <TableHead>VehicleModel Name</TableHead>
                  {/* <TableHead>Image</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Bussiness Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.length > 0 &&
                  vehicles.map((vehicle: Vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell>{vehicle.assetId}</TableCell>
                      <TableCell>{vehicle.vehicleModelId}</TableCell>
                      {/* <TableCell>
                        <img
                          src={vehicle.vehicleModel.image}
                          alt="vehicle"
                          className="h-16 w-20"
                        />
                      </TableCell> */}
                      <TableCell className="text-destructive">
                        {vehicle.status}
                      </TableCell>
                      <TableCell>
                        <img
                          src={vehicle.rental?.bussiness?.image}
                          alt="bussiness"
                          className="h-16 w-20"
                        />
                        <p className="text-center">
                          {vehicle.rental?.bussiness?.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() =>
                            deAssignVehicle(
                              vehicle.rental._id,
                              vehicle._id,
                              // vehicle.batteries
                            )
                          }
                        >
                          De-Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        {/* assign vehicle */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Assign Vehicle</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Vehicle</DialogTitle>
              <DialogDescription>
                Here you can assign vehicle to Bussiness.
              </DialogDescription>
              <AssignVehicleToBussiness2 />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
export default Vehicles;
