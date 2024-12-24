import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Toaster } from '@/Components/ui/Toaster';
import { useToast } from "@/hooks/use-toast"

const AllExhibitors = () => {
  const { toast } = useToast()
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/exhibitor', {
          params: { isAccepted: true },
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
          }
      });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);


  const ContactInfoGet = async (requestId) => {
    try {
        axios.get(
            `/api/exhibitor/contact-info-exchange/${requestId}`,
            { 
              params: { isAccepted: true },
              headers: { 'Authorization': `Bearer ${token}` }
            }
          )
            .then((response) => {
              console.log(response);
              toast({
                variant: "success",
                title: "Contact Recieved Successfully",
                description: `Please check your email for the contact information.`,
              });
            })
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Companies Registered For Expos</h1>
      <div className="space-y-4grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="flex justify-center">
            <Card className="w-full max-w-md bg-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-xl">{request.companyId.companyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mt-2">
                    <strong>Company Description:</strong>  {request.companyId.companyDescription}</p>
                <p className="text-sm mt-2">
                  <strong>Occupied Booth No:</strong> {request.boothId.boothNumber}
                </p>
                <p className="text-sm mt-2">
                  <strong>Product Name:</strong> {request.productName}
                </p>
                <p className="text-sm mt-2">
                  <strong>Product Description:</strong> {request.productDescription}
                </p>
                <p className="text-sm mt-2">
                  <strong>Created At:</strong> {new Date(request.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm mt-2">
                  <strong>Created By:</strong> {request.userId.name}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end p-4">
                <Button
                  className='m-2 w-full bg-green-500 text-white hover:bg-green-600 hover:text-gray-100 py-2 px-4 rounded'
                  onClick={() => ContactInfoGet(request._id)}
                >
                  Share Contact Info
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>

     <Toaster />
     </>
  );
};

export default AllExhibitors;
