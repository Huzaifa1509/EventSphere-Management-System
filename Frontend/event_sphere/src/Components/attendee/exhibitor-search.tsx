import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/Components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/Dialog";
import axios from "axios";
import { Link } from "react-router-dom";

interface Exhibitor {
  _id: string;
  productName: string;
  productDescription: string;
  isAccepted: boolean;
  userId: {
    _id: string;
    email: string;
  };
  expoId: string;
  boothId: {
    _id: string;
    boothNumber: string;
    expoId: string;
    floor: string;
    isBooked: boolean;
    Assignedto: string;
    __v: number;
  };
  companyId: string;
}

export function ExhibitorSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([]);
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(
    null
  );

  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/all-exhibitor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExhibitors(response.data);
      } catch (error) {
        console.error("Error fetching exhibitors:", error);
      }
    };

    fetchExhibitors();
  }, []);

  const filteredExhibitors = exhibitors.filter(
    (exhibitor) =>
      exhibitor.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exhibitor.productDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exhibitor Search</CardTitle>
        <CardDescription>
          Find exhibitors and their booth locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Search exhibitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setSearchTerm("")}>Clear</Button>
        </div>
        <div className="space-y-2">
          {filteredExhibitors.map((exhibitor) => (
            <div
              key={exhibitor._id}
              className="flex justify-between items-center p-2 bg-secondary rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{exhibitor.productName}</h3>
                <p className="text-sm text-muted-foreground">
                  {exhibitor.productDescription}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedExhibitor(exhibitor)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedExhibitor?.productName}</DialogTitle>
                    <DialogDescription>Exhibitor Details</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>
                      <strong>Category:</strong>{" "}
                      {selectedExhibitor?.productDescription}
                    </p>
                    <p>
                      <strong>Booth:</strong>{" "}
                      {selectedExhibitor?.boothId.boothNumber}
                    </p>
                    <p className="mt-4">
                      Contact the exhibitor for more information or to schedule
                      a meeting.
                    </p>
                  </div>
                  <a
                    className="w-full inline-block text-center bg-primary text-white py-2 px-4 rounded"
                    href={`https://mailto:${selectedExhibitor?.userId.email}`}
                  >
                    Contact Exhibitor
                  </a>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
