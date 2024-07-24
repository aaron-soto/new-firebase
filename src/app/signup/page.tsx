"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormEvent, useState } from "react";
import { auth, db } from "@/lib/firebase/clientApp"; // Import db here
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import setDoc and doc

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import SimpleIcon from "@/components/SimpleIcon";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

const Page = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { email, password, confirmPassword, terms } = values;

    if (password !== confirmPassword) {
      form.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    if (!terms) {
      form.setError("terms", {
        message: "You must accept the terms and conditions",
      });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);

      // Add user to Firestore with a default role
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "user", // Default role
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        lastSeen: new Date(),
      });

      toast({
        title: "Account created",
        description: "Your account has been successfully created",
      });

      router.push("/signin");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating user:", errorCode, errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-screen flex items-center">
      <div className="w-[400px] mx-auto">
        <h1 className="text-2xl font-bold text-center">Create an account</h1>
        <p className="text-center text-gray-500 mb-6">
          Sign up to start using our services
        </p>

        <div className="flex my-4 gap-2">
          <Button variant="outline" className="w-full">
            <SimpleIcon name="apple" size={19} />
          </Button>
          <Button variant="outline" className="w-full">
            <SimpleIcon name="google" color="#fcba03" size={19} />
          </Button>
          <Button variant="outline" className="w-full">
            <SimpleIcon name="facebook" color="#3b5998" size={19} />
          </Button>
        </div>

        <div className="flex items-center my-8">
          <div className="h-px bg-gray-100 flex-1"></div>
          <p className="mx-4 text-gray-300 text-xs">OR</p>
          <div className="h-px bg-gray-100 flex-1"></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter your email..." {...field} />
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
                      type="password"
                      placeholder="Enter your password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox
                        className="w-4 h-4"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>
                      I agree to the{" "}
                      <Link href="/terms" className="underline">
                        terms and conditions
                      </Link>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button
                className="w-full"
                type="submit"
                disabled={!form.formState.isValid}
              >
                Sign Up
              </Button>
            )}
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="underline font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
