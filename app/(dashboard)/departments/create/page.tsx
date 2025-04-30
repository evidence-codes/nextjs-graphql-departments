"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@apollo/client"
import { CREATE_DEPARTMENT } from "@/lib/graphql/queries"
import { useToast } from "@/hooks/use-toast"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Trash2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
  subDepartments: z.array(
    z.object({
      name: z.string().min(2, {
        message: "Sub-department name must be at least 2 characters.",
      }),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateDepartmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subDepartments: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subDepartments",
  })

  const [createDepartment] = useMutation(CREATE_DEPARTMENT, {
    onCompleted: () => {
      setIsSubmitting(false)
      toast({
        title: "Department created",
        description: "The department has been created successfully.",
      })
      router.push("/departments")
    },
    onError: (error) => {
      setIsSubmitting(false)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create department.",
      })
    },
  })

  function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    createDepartment({
      variables: {
        name: values.name,
        subDepartments: values.subDepartments.length > 0 ? values.subDepartments : undefined,
      },
    })
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Department</h1>
          <p className="text-muted-foreground">Add a new department to your organization</p>
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
                  <FormDescription>The name of the department (min. 2 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Sub-departments</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "" })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Sub-department
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="rounded-md border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No sub-departments added yet. Click the button above to add one.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 rounded-md border p-4">
                      <FormField
                        control={form.control}
                        name={`subDepartments.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Sub-department Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter sub-department name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Department"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/departments")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
