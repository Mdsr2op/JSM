import { SignInValidation } from "@/lib/validation";
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
} from "@/components/ui/form"
import {useSignInAccount} from '@/lib/react-query/queriesAndMutations'
import { toast, useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
const SigninForm = () => {
  const {checkAuth} = useAuth()
  const navigate = useNavigate()
  const {isPending, mutateAsync:signInAccount } = useSignInAccount()
  const reactHookForm = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async(values: z.infer<typeof SignInValidation>) =>{
  const signedInUser = await signInAccount({email: values.email, password: values.password})

  if(!signedInUser){
    return toast({title: "Sign in failed"})
  }
  toast({title:"Sign in successful!"})

  const isLoggedIn = await checkAuth()

  if(isLoggedIn){
    reactHookForm.reset()
    navigate("/")
  }else{
    toast({title: "Sign in failed"})
  }
  }

  return (
    <Form {...reactHookForm}>
      <form onSubmit={reactHookForm.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={reactHookForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                 type="email"
                 placeholder="Enter your email" {...field}
                 autoComplete="off" />
              </FormControl>
              <FormMessage className="shad-form_message"/>
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
                  className="shad-input"
                 type="password"
                 placeholder="Enter your password" {...field}
                 autoComplete="off" />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <Button className="shad-button_primary" type="submit">
          {isPending? <div>Loading...</div>
          : <div>Submit</div>}
        </Button>
      </form>
    </Form>
  );
};

export default SigninForm;
