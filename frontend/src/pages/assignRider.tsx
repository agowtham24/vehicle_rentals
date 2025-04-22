import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { api, config } from "@/lib/axios-config";
import withErrorHandler from "@/lib/ErrorHandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";

import { z } from "zod";

const formSchema = z.object({
  riderId: z.string().min(1, "Please select a rider"),
});

function AssignRider() {
  const [searchParams] = useSearchParams();
  const rentalId = searchParams.get("rentalId");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [riders, setRiders] = useState<
    { mobile: string; _id: string; name: string,status:string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      riderId: "",
    },
  });

  const getRidersBySearch = withErrorHandler(async (mobile: string) => {
    if (!mobile.trim()) return;
    const res = await api.get(`${config.api_url}riders?mobile=${mobile}`);
    setRiders(res.data.data);
  });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        getRidersBySearch(search);
      }
    }, 1500); // debounce delay: 500ms

    return () => clearTimeout(delayDebounce); // cleanup on each keystroke
  }, [search]);

  const onSubmit = withErrorHandler(
    async (values: z.infer<typeof formSchema>) => {
      await api.post(`${config.api_url}rentals/assignRider`, {
        riderId: values.riderId,
        rentalId,
      });
      form.reset();
      navigate("/app/rentals");
    }
  );

  return (
    <section className="container h-full">
      <div className="flex mt-7 justify-around align-middle">
        <Card className="w-[400px] drop-shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Assign Rider</CardTitle>
            <CardDescription>Select and assign a rider.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="riderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Rider" />
                          </SelectTrigger>
                          <SelectContent>
                            <Input
                              placeholder="Search mobile number"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                            />
                            {riders.length > 0 ? (
                              riders.map((r) => (
                                <SelectItem key={r._id} value={r._id}>
                                  {r.name} ({r.mobile}) - {r.status}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-muted-foreground text-sm">
                                No results
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full mt-2.5">
                  Assign Rider
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default AssignRider;
