import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import withErrorHandler from "@/lib/ErrorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, config } from "@/lib/axios-config";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(25, { message: "Name must not exceed 25 characters." }),

  email: z.string().email({ message: "Please enter a valid email address." }),

  mobile: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Mobile must be a valid 10-digit number.",
  }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),

  address: z.string().min(1, { message: "Address is required." }),

  pincode: z.string().min(1, { message: "Pincode is required." }),

  state: z.string().min(1, { message: "State is required." }),

  image: z.string().url({ message: "Image must be a valid URL." }).optional(),
});
interface BussinessAccount {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  location: {
    address: string;
    pincode: string;
    state: string;
    // lat: number;
    // lng: number;
  };
  status: string;
  image: string;
  isPricing: boolean;
}
function BussinessAccounts() {
  const [list, setList] = useState([] as BussinessAccount[]);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      mobile: "",
      address: "",
      pincode: "",
      state: "",
      image:
        "https://www.logoshape.com/wp-content/uploads/2024/09/zepto-logo-vector_logoshape.png",
    },
  });

  const getList = withErrorHandler(async () => {
    const res = await api.get(`${config.api_url}bussinessAccounts`);
    setList(res.data.data);
  });

  const onSubmit = withErrorHandler(
    async (values: z.infer<typeof formSchema>) => {
      await api.post(`${config.api_url}bussinessAccounts`, values);
      toast.success("Success", {
        description: "Bussiness Account Created.",
      });
      form.reset();
      setOpen(false);
      getList();
    }
  );

  useEffect(() => {
    getList();
  }, []);
  return (
    <>
      <p className="text-xl">Bussiness Accounts</p>
      {/* create form */}
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" type="button">
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Bussiness Account</DialogTitle>
              <DialogDescription>
                Come join with us and grow your business. Fill in the details to
                get started!
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email*" {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Password*"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Name*" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mobile */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Mobile Number*" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Address*" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Pincode */}
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Pincode*" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="State*" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Image URL optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* get Accounts */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-3">
        {list.length > 0 &&
          list.map((item: BussinessAccount) => (
            <Card key={item._id}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around">
                  <img src={item.image} alt="logo" className="h-16 w-20" />
                  <div>
                    <p>{item.mobile}</p>
                    <p>{`${item.location.address}, ${item.location.pincode}, ${item.location.state}`}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default">
                  <Link to={`/app/pricings?bussinessId=${item._id}`}>
                    Manage Pricings
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </>
  );
}

export default BussinessAccounts;
