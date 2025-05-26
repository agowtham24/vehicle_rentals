import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// type Checked = DropdownMenuCheckboxItemProps["checked"];
import { Input } from "@/components/ui/input";
import { api, config } from "@/lib/axios-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import withErrorHandler from "@/lib/ErrorHandler";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BussinessAccount } from "@/pages/BussinessAccounts";
import { useNavigate } from "react-router-dom";

type VehicleModel = {
  _id: string;
  name: string;
  batterySlots: number;
  isSwapable: boolean;
};
const planItemSchema = z.object({
  type: z.enum(["day", "week"]),
  amount: z.number(),
  sdAmount: z.number(),
  value: z.number(),
  batteries: z.union([z.literal(1), z.literal(2)]),
  freeSwaps: z.number().optional(),
  swapCharge: z.number().optional(),
});

const plansFormSchema = z.object({
  vehicleModelId: z.string(),
  plans: z.array(planItemSchema),
});

const assignVehicleSchema = z.object({
  bussinessId: z.string(),
  vehicleModelId: z.string(),
  vehicleId: z.string(),
  plan: z.string(),
  assosiatedBatteries: z.array(z.string()),
});

type PlanFormProps = {
  bussinessId: string;
};
type SinglePlanFormProps = {
  bpId: string;
};
export const PlansForm = (props: PlanFormProps) => {
  const [vehicleModels, setVehicleModels] = useState([] as VehicleModel[]);

  const getVehicleModels = withErrorHandler(async () => {
    const res = await api.get(`${config.api_url}vehicleModels`);
    setVehicleModels(res.data.data);
  });

  const form = useForm<z.infer<typeof plansFormSchema>>({
    resolver: zodResolver(plansFormSchema),
    defaultValues: {
      vehicleModelId: "",
      plans: [
        {
          type: "day",
          amount: 0,
          sdAmount: 0,
          value: 0,
          batteries: 1,
          freeSwaps: 0,
          swapCharge: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "plans",
  });

  const onSubmit = withErrorHandler(
    async (values: z.infer<typeof plansFormSchema>) => {
      const formData = {
        ...values,
        bussinessId: props.bussinessId,
      };
      await api.post(`${config.api_url}bussinessPricings`, formData);
      form.reset();
      toast.success("Success", {
        description: "Plans Updated Success",
      });
    }
  );

  useEffect(() => {
    getVehicleModels();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Vehicle Model ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <FormField
            control={form.control}
            name="vehicleModelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Model</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleModels.length > 0 &&
                        vehicleModels.map((item: VehicleModel) => (
                          <SelectItem value={item._id} key={item._id}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dynamic Plans */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-xl bg-muted/20 relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Type */}
              <FormField
                control={form.control}
                name={`plans.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount */}
              <FormField
                control={form.control}
                name={`plans.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SD Amount */}
              <FormField
                control={form.control}
                name={`plans.${index}.sdAmount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SD Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Value */}
              <FormField
                control={form.control}
                name={`plans.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Batteries */}
              <FormField
                control={form.control}
                name={`plans.${index}.batteries`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batteries</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        defaultValue={String(field.value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select batteries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Free Swaps */}
              <FormField
                control={form.control}
                name={`plans.${index}.freeSwaps`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Swaps</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Swap Charge */}
              <FormField
                control={form.control}
                name={`plans.${index}.swapCharge`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Swap Charge</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Remove Button */}
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              size="icon"
              className="mt-4"
            >
              <Minus size={16} />
            </Button>
          </div>
        ))}

        {/* Add Plan Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            append({
              type: "day",
              amount: 0,
              sdAmount: 0,
              value: 0,
              batteries: 1,
              freeSwaps: 0,
              swapCharge: 0,
            })
          }
        >
          <Plus size={16} />
          Add Plan
        </Button>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export const SinglePlanForm = (props: SinglePlanFormProps) => {
  const form = useForm<z.infer<typeof planItemSchema>>({
    resolver: zodResolver(planItemSchema),
    defaultValues: {
      type: "day",
      amount: 0,
      sdAmount: 0,
      value: 0,
      batteries: 1,
      freeSwaps: 0,
      swapCharge: 0,
    },
  });

  const onSubmit = withErrorHandler(
    async (values: z.infer<typeof planItemSchema>) => {
      await api.post(
        `${config.api_url}bussinessPricings/plan?bpId=${props.bpId}`,
        values
      );
      toast.success("Success", {
        description: "Plan added successfully.",
      });
      form.reset();
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SD Amount */}
          <FormField
            control={form.control}
            name="sdAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SD Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Value */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Batteries */}
          <FormField
            control={form.control}
            name="batteries"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batteries</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batteries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Free Swaps */}
          <FormField
            control={form.control}
            name="freeSwaps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free Swaps</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Swap Charge */}
          <FormField
            control={form.control}
            name="swapCharge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Swap Charge</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit">Add Plan</Button>
        </div>
      </form>
    </Form>
  );
};

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
export const AssignVehicleToBussiness = () => {
  const [tenants, setTenants] = useState([] as BussinessAccount[]);
  const [vehicleModels, setVehicleModels] = useState([] as any[]);
  const [vehicles, setVehicles] = useState([] as any[]);
  const [plans, setPlans] = useState([] as any[]);
  const [batteries, setBatteries] = useState(
    [] as { assetId: string; _id: string }[]
  );
  const form = useForm<z.infer<typeof assignVehicleSchema>>({
    resolver: zodResolver(assignVehicleSchema),
    defaultValues: {
      bussinessId: "",
      vehicleId: "",
      vehicleModelId: "",
      plan: "",
      assosiatedBatteries: [],
    },
  });

  const onSubmit = withErrorHandler(
    async (values: z.infer<typeof assignVehicleSchema>) => {
      const plan = plans.find((item) => item._id === values.plan);
      const data = {
        ...values,
        plan,
      };
      console.log(data, "data");
      await api.post(`${config.api_url}rentals`, data);
      toast.success("Success", {
        description: "vehicle assigned to bussiness successfully.",
      });
      form.reset();
    }
  );

  const getTenants = withErrorHandler(async () => {
    const res = await api.get(`${config.api_url}bussinessAccounts`);
    setTenants(res.data.data);
  });

  const getVehicleModelsByTenant = withErrorHandler(async (id: string) => {
    const res = await api.get(
      `${config.api_url}bussinessPricings/vehicleModels?id=${id}`
    );
    setVehicleModels(res.data.data);
  });

  const getVehiclesByModel = withErrorHandler(async (id: string) => {
    const model = vehicleModels.find((item) => item.vehicleModel._id === id);
    if (model) setPlans(model.plans);
    if (model) setBatteries(model.vehicleModel.batteries);
    const res = await api.get(`${config.api_url}vehicles/modelId?id=${id}`);
    setVehicles(res.data.data);
  });

  useEffect(() => {
    getTenants();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Business */}
        <FormField
          control={form.control}
          name="bussinessId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    getVehicleModelsByTenant(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.length > 0 &&
                      tenants.map((tenant: BussinessAccount) => (
                        <SelectItem key={tenant._id} value={tenant._id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Model */}
        <FormField
          control={form.control}
          name="vehicleModelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Model</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    getVehiclesByModel(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleModels.length > 0 &&
                      vehicleModels.map((model) => (
                        <SelectItem
                          key={model._id}
                          value={model.vehicleModel._id}
                        >
                          {model.vehicleModel.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle */}
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length > 0 &&
                      vehicles.map((v) => (
                        <SelectItem key={v._id} value={v._id}>
                          {v.assetId}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.length > 0 &&
                      plans.map((v: Plan) => (
                        <SelectItem key={v._id} value={v._id}>
                          {`${v.value} ${v.type}s`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assosiatedBatteries"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Associated Batteries</FormLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {field.value.length > 0
                      ? `${field.value.length} selected`
                      : "Select batteries"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {/* Loop through the batteries array */}
                  {batteries.length > 0 &&
                    batteries.map((battery) => (
                      <DropdownMenuCheckboxItem
                        key={battery._id}
                        checked={field.value.includes(battery._id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, battery._id]); // Add battery ID to array
                          } else {
                            field.onChange(
                              field.value.filter((id) => id !== battery._id) // Remove battery ID from array
                            );
                          }
                        }}
                      >
                        {battery.assetId} {/* Display battery's assetId */}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center mt-6">
          <Button type="submit">Assign Vehicle</Button>
        </div>
      </form>
    </Form>
  );
};

export const AssignVehicleToBussiness2 = () => {
  const [tenants, setTenants] = useState([] as BussinessAccount[]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm({
    defaultValues: {
      bussinessId: "",
      file: null,
    },
  });

  const onSubmit = withErrorHandler(async (values: any) => {
    const formData = new FormData();
    formData.append("bussinessId", values.bussinessId);
    formData.append("file", values.file[0]);

    await api.post(`${config.api_url}rentals/bulk`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Success", {
      description: "Vehicles assigned successfully.",
    });
    form.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  });

  const getTenants = withErrorHandler(async () => {
    const res = await api.get(`${config.api_url}bussinessAccounts`);
    setTenants(res.data.data);
  });

  useEffect(() => {
    getTenants();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Business */}
        <FormField
          control={form.control}
          name="bussinessId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.length > 0 &&
                      tenants.map((tenant: BussinessAccount) => (
                        <SelectItem key={tenant._id} value={tenant._id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Excel</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center mt-6">
          <Button type="submit">Assign Vehicles</Button>
        </div>
      </form>
    </Form>
  );
};

const riderRegisterSchema = z.object({
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  name: z.string().min(2, "Name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  pan: z.string().min(10, "PAN must be 10 characters"),
  aadhar: z
    .string()
    .length(12, "Aadhar must be 12 digits")
    .regex(/^\d+$/, "Aadhar must be numeric"),
  drivingLicense: z.string().min(5, "Driving license is required"),
});


export const RiderRegisterForm = () => {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof riderRegisterSchema>>({
    resolver: zodResolver(riderRegisterSchema),
    defaultValues: {
      mobile: "",
      name: "",
      dob: "",
      pan: "",
      aadhar: "",
      drivingLicense: "",
    },
  });

  const onSubmit = withErrorHandler(
    async (values: z.infer<typeof riderRegisterSchema>) => {
      await api.post(`${config.api_url}riders`, values);
      toast.success("Success", {
        description: "Rider registered successfully.",
      });
      form.reset();
      navigate("/thank-you")
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aadhar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhar</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drivingLicense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driving License</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit">Register Rider</Button>
        </div>
      </form>
    </Form>
  );
};