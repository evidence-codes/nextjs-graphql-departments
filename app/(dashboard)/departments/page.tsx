"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_DEPARTMENTS, DELETE_DEPARTMENT } from "@/lib/graphql/queries";
import { useMutation } from "@apollo/client";
import { useToast } from "@/hooks/use-toast";
import type { Department, PaginatedDepartments } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DepartmentsPage() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);

  const { loading, error, data, refetch } = useQuery<{
    getDepartments: PaginatedDepartments;
  }>(GET_DEPARTMENTS, {
    variables: { page: currentPage, limit: 9 },
    fetchPolicy: "network-only",
  });

  const [deleteDepartment, { loading: deleteLoading }] = useMutation(
    DELETE_DEPARTMENT,
    {
      onCompleted: () => {
        toast({
          title: "Department deleted",
          description: "The department has been deleted successfully.",
        });
        refetch();
        setDepartmentToDelete(null);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to delete department.",
        });
      },
    }
  );

  const handleDelete = (department: Department) => {
    setDepartmentToDelete(department);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      deleteDepartment({
        variables: { id: departmentToDelete.id },
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading && !data) {
    return (
      <div className="container flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading departments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="rounded-md bg-destructive/15 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trash2 className="h-5 w-5 text-destructive" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Error loading departments
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

  const departments = data?.getDepartments?.items ?? [];
  const totalPages = data?.getDepartments?.totalPages;

  console.log("totalPages from query:", totalPages);
  console.log("Full data:", data);

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s departments
          </p>
        </div>
        <Link href="/departments/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Department
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {departments.length === 0 ? (
          <div className="col-span-full rounded-md border border-dashed p-10 text-center">
            <h3 className="text-lg font-medium">No departments found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new department.
            </p>
            <div className="mt-6">
              <Link href="/departments/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Department
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          departments.map((department) => (
            <Card key={department.id}>
              <CardHeader>
                <CardTitle>{department.name}</CardTitle>
                <CardDescription>
                  {/* Created on{" "} */}
                  {/* {new Date(department.createdAt).toLocaleDateString()} */}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {department.subDepartments &&
                department.subDepartments.length > 0 ? (
                  <div>
                    <h4 className="mb-2 text-sm font-medium">
                      Sub-departments:
                    </h4>
                    <ul className="space-y-1">
                      {department.subDepartments.map((subDept) => (
                        <li
                          key={subDept.id}
                          className="rounded-md bg-muted px-2 py-1 text-sm"
                        >
                          {subDept.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No sub-departments
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/departments/${department.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(department)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {totalPages !== null && totalPages !== undefined && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AlertDialog
        open={!!departmentToDelete}
        onOpenChange={(open) => !open && setDepartmentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department &quot;
              {departmentToDelete?.name}&quot; and all its sub-departments. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteLoading}>
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
