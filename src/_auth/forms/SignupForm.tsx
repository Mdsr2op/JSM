import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "@/components/ui/index.ts";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignupValidation } from "../../lib/validation/index";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserAccount } from "@/lib/react-query/queriesAndMutations";
import { useToast } from "@/components/ui/use-toast";
import { signInAccount } from "@/lib/appwrite/api";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";

const SignupForm = () => {
  const { checkAuth, isAuthenticating } = useAuth();
  const { mutateAsync: createUserAccount, isPending } = useCreateUserAccount();
  const { toast } = useToast();
  const navigate = useNavigate();

  const reactHookForm = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({ title: "Sign up failed. Please try again." });
    }
    toast({ title: "Sign up successful." });

    const signedInUser = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!signedInUser) {
      toast({ title: "Sign in failed. Please try again." });
      navigate("/sign-in");
      return;
    }

    const isLoggedIn = await checkAuth();

    if (isLoggedIn) {
      reactHookForm.reset();
      navigate("/");
    } else {
      toast({ title: "Sign in failed. Please try again" });
    }
  }

  return (
    <Form {...reactHookForm}>
      <div className="sm:w-420 flex-center flex-col py-10">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use the app, enter the details
        </p>
        <form
          onSubmit={reactHookForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={reactHookForm.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="eg. John Doe"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={reactHookForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    placeholder="eg. johndoe"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={reactHookForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="shad-input"
                    placeholder="eg. johndoe123@example.com"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <FormField
            control={reactHookForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input"
                    placeholder="Enter your password"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isPending ? <div className="flex gap-3 items-center"><Loader/> Loading...</div> : <div>Submit</div>}
          </Button>
          <p className="text-small-regular text-light-2 text-center -mt-2">
            Already have an account?
            <Link to="/sign-in">
              <span className="text-primary-500 text-small-semibold ml-1">
                Sign in
              </span>
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
