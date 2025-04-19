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
import { AssignVehicleToBussiness } from "@/lib/forms";
type Vehicle = {
  _id: string;
  assetId: string;
  rider: {
    name: string;
    mobile: string;
  };
  rental: {
    bussiness: {
      name: string;
      image: string;
    };
  };
  vehicleModel: {
    name: string;
    image: string;
  };
  batteries: [{ name: string }];
  status: string;
};
type Tenant = {
  name: string;
  _id: string;
};
function Vehicles() {
  const [vehicles, setVehicles] = useState([] as Vehicle[]);
  const [tenantList, setTenantList] = useState([] as Tenant[]);
  const [status, setStatus] = useState("READY_TO_ASSIGN");
  const getVehicles = withErrorHandler(async (status: string) => {
    const res = await api.get(`${config.api_url}vehicles?status=${status}`);
    setVehicles(res.data.data);
  });
  const getTenants = withErrorHandler(async () => {
    const res = await api.get(`${config.api_url}bussinessAccounts`);
    console.log(res.data.data, "tenants");
    setTenantList(res.data.data);
  });
  const manageStatus = withErrorHandler(async (status: string) => {
    setStatus(status);
  });

  useEffect(() => {
    getVehicles(status);
  }, [getVehicles, status]);

  useEffect(() => {
    getTenants();
  }, []);
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
                  <TableHead>Image</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.length > 0 &&
                  vehicles.map((vehicle: Vehicle) => (
                    <TableRow key={vehicle._id}>
                      <TableCell>{vehicle.assetId}</TableCell>
                      <TableCell>{vehicle.vehicleModel.name}</TableCell>
                      <TableCell>
                        <img
                          src={vehicle.vehicleModel.image}
                          alt="vehicle"
                          className="h-16 w-20"
                        />
                      </TableCell>
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
                  <TableHead>Image</TableHead>
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
                      <TableCell>{vehicle.vehicleModel.name}</TableCell>
                      <TableCell>
                        <img
                          src={vehicle.vehicleModel.image}
                          alt="vehicle"
                          className="h-16 w-20"
                        />
                      </TableCell>
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
                        <Button variant="secondary" type="button">
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
              <AssignVehicleToBussiness />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
export default Vehicles;
