import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  plan: planItemSchema,
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

const businesses = [
  { _id: "biz1", name: "Business One" },
  { _id: "biz2", name: "Business Two" },
];

const vehicles = [
  { _id: "veh1", plateNumber: "ABC-123" },
  { _id: "veh2", plateNumber: "XYZ-789" },
];

const vehicleModels = [
  { _id: "model1", name: "Model A" },
  { _id: "model2", name: "Model B" },
];
export const AssignVehicleToBussiness = () => {
  const form = useForm<z.infer<typeof assignVehicleSchema>>({
    resolver: zodResolver(assignVehicleSchema),
    defaultValues: {
      bussinessId: "",
      vehicleId: "",
      vehicleModelId: "",
      plan: {
        type: "day",
        amount: 0,
        sdAmount: 0,
        value: 1,
        batteries: 1,
        freeSwaps: 0,
        swapCharge: 0,
      },
    },
  });
  const onSubmit = withErrorHandler(
    async (values: z.infer<typeof assignVehicleSchema>) => {
      await api.post(`${config.api_url}rentals`, values);
      toast.success("Success", {
        description: "vehicle assigned to bussiness successfully.",
      });
      form.reset();
    }
  );
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business" />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.map((b) => (
                      <SelectItem key={b._id} value={b._id}>
                        {b.name}
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
                    {vehicles.map((v) => (
                      <SelectItem key={v._id} value={v._id}>
                        {v.plateNumber}
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleModels.map((model) => (
                      <SelectItem key={model._id} value={model._id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
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
