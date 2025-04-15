import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { api, config } from "@/axios-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import vehicle1 from "../assets/vehicle1.png";
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Submission error:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  }
  return (
    <section className="container h-full">
      <div>
        <Link to="/">
          <h3 className="text-2xl pl-6 pb-4 pt-5 font-medium group flex">
            OPTI
            <span className="block text-green-500 group-hover:opacity-45">
              M
            </span>
            OTION
          </h3>
        </Link>
        <div className="flex mt-7 justify-around align-middle">
          <Card className="w-[400px] drop-shadow-lg">
            <CardHeader className="text-center">
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Every great journey begins here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
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
                  <Button type="submit" className="w-full mt-2.5">
                    Submit
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="hidden sm:block">
            <img src={vehicle1} alt="vehicle1" className="w-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
