import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/Components/ui/Skeleton";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/Components/ui/Dialog"; // Shadcn Dialog Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ShowAllCompanies: React.FC = () => {
  const { toast } = useToast()
  const [Companies, setCompanies] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/get-companies-by-exhibitor",
        {
            headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
            }
        });
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = async (companyId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/delete-company/${companyId}`,
            {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            }
        );
        setCompanies(Companies.filter((company) => company._id !== companyId));
        toast({
          variant: "default",
          title: "Success",
          description: "Event deleted successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete event",
        });
      }
    }
  };


  const handleEdit = (companyId: string) => {
    navigate(`/dashboard/editcompany/${companyId}`);
  };

  return (

      <div className="container mx-auto px-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">All Companies</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Companies.map((company) => (
              <Card key={company._id} className="shadow-lg rounded-lg bg-slate-900 text-white">
                <CardHeader className="relative">
                  <div className="absolute right-4 top-4 flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2"
                      onClick={() => handleDelete(company._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2"
                      onClick={() => handleEdit(company._id)}
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  </div>

                  <CardTitle className="text-lg font-semibold">{company.name}</CardTitle>
                  <CardDescription className="break-words whitespace-normal overflow-hidden">
                    {company.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm">
                    <span className="font-semibold">Company Name:</span> {company.companyName}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Company Description:</span> {company.companyDescription}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Company Service:</span> {company.companyService}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Company Email:</span> {company.companyEmail}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Company Contact:</span> {company.companyContact}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Company Address:</span> {company.companyAddress}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm border-t border-slate-700 pt-2">
                  <span>
                    <span className="font-semibold">Created At:</span>{" "}
                    {new Date(company.createdAt).toLocaleDateString()}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>


  );
};

export default ShowAllCompanies;