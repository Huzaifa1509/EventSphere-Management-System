import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Toaster } from '@/Components/ui/Toaster';
import { useToast } from "@/hooks/use-toast"

const AllRequests = () => {
  const { toast } = useToast()
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/exhibitor',{ headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);


  const handleAccept = async (requestId, boothId) => {
    try {
        axios.put(
            `/api/exhibitor/${requestId}`,
            { isAccepted: true, isTemporaryBooked: true },
            { headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` } }
          )
            .then((response) => {
              console.log(response);
                return axios.put(
                  `/api/boothBooked/${boothId}`,
                  { isBooked: true },
                  { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
                )
                  .then((response) => {
                    console.log(response);
                    toast({
                      variant: "success",
                      title: "Request Accepted Successfully",
                      description: `Exhibitor has been accepted successfully.`,
                    });
                  });
            })
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReject = async (requestId, boothId) => {
    try {
        axios.put(
            `/api/exhibitor/${requestId}`,
            { isAccepted: false },
            { headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${token}` } }
          )
            .then((response) => {
              console.log(response);

              return axios.put(
                `/api/boothBooked/${boothId}`,
                { isBooked: false, isTemporaryBooked: false },
                { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
              )
                .then((response) => {
                  console.log(response);
                  toast({
                    variant: "danger",
                    title: "Request Rejected Successfully",
                    description: `Exhibitor has been rejected successfully.`,
                  });
                });

            })
    } catch (error) {
      console.error('Error:', error);
    }
}

  return (
    <>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Company Booth Requests</h1>
      <div className="space-y-4">
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
                  <strong>Booth No:</strong> {request.boothId.boothNumber} {request.requestByAnotherCompany ? '(Requested by another company)' : ''}
                </p>
                <p className="text-sm mt-2">
                  <strong>Product Name:</strong> {request.productName}
                </p>
                <p className="text-sm mt-2">
                  <strong>Product Description:</strong> {request.productDescription}
                </p>
                <p className="text-sm mt-2 p-3">
                  <strong>Required Document:</strong> <img className='p-2 h-auto max-w-full transition-all duration-300 rounded-lg blur-sm hover:blur-none' src={request.companyId.requireDocument} alt="Document Image" />
                </p>
                <p className="text-sm">
                  <strong>Created At:</strong> {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end p-4">
                <Button
                  className='m-2 w-full bg-green-500 text-white hover:bg-green-600 hover:text-gray-100 py-2 px-4 rounded'
                  onClick={() => handleAccept(request._id, request.boothId._id)}
                >
                  Accept
                </Button>
                <Button
                  className="m-2 w-full bg-red-500 text-white hover:bg-red-600 hover:text-gray-100 py-2 px-4 rounded"
                  onClick={() => handleReject(request._id, request.boothId._id)}
                >
                  Reject
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

export default AllRequests;
