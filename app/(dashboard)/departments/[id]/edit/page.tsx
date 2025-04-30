"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "@apollo/client";
import { GET_DEPARTMENT, UPDATE_DEPARTMENT } from "@/lib/graphql/queries";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditDepartmentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, error, data } = useQuery(GET_DEPARTMENT, {
    variables: { id: parseFloat(params.id) },
    fetchPolicy: "network-only",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (data?.department) {
      form.reset({
        name: data.department.name,
      });
    }
  }, [data, form]);

  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT, {
    onCompleted: () => {
      setIsSubmitting(false);
      toast({
        title: "Department updated",
        description: "The department has been updated successfully.",
      });
      router.push("/departments");
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update department.",
      });
    },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    updateDepartment({
      variables: {
        id: parseFloat(params.id),
        name: values.name,
      },
    });
  }

  if (loading) {
    return (
      <div className="container flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading department...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="rounded-md bg-destructive/15 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Error loading department
              </h3>
              <div className="mt-2 text-sm text-destructive/80">
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Department</h1>
          <p className="text-muted-foreground">
            Update the department information
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the department (min. 2 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {data?.department?.subDepartments &&
              data.department.subDepartments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sub-departments</h3>
                  <div className="rounded-md border p-4">
                    <p className="text-sm text-muted-foreground">
                      This department has{" "}
                      {data.department.subDepartments.length} sub-departments.
                      Sub-departments can only be added during creation.
                    </p>
                    <ul className="mt-2 space-y-1">
                      {data.department.subDepartments.map((subDept: any) => (
                        <li key={subDept.id} className="text-sm">
                          • {subDept.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Department"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/departments")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
