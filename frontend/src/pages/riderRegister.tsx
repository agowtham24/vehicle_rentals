import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import vehicle1 from "../assets/vehicle1.png";
import { RiderRegisterForm } from "@/lib/forms";
function RiderRigister() {

    return (<section className="container h-full">
        <div>
            <Link to="#">
                <p className="text-xl pl-6 pb-4 pt-5 font-medium group flex">
                    OPTI
                    <span className="block text-primary group-hover:opacity-45">M</span>
                    OTION
                </p>
            </Link>
            <div className="flex mt-7 justify-around align-middle">
                <Card className="w-[600px] drop-shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle>Register</CardTitle>
                        <CardDescription>
                            Every great journey begins here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <RiderRegisterForm />
                    </CardContent>
                </Card>
                <div className="hidden sm:block">
                    <img src={vehicle1} alt="vehicle1" className="w-2xl" />
                </div>
            </div>
        </div>
    </section>)

}

export default RiderRigister