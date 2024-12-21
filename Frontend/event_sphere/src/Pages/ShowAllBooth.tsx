import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/Card"
import { Grid } from "@/components/ui/grid"; // Optional if you have a Grid layout setup
import { Skeleton } from "@/Components/ui/Skeleton";

// Define Booth type
interface Booth {
  _id: string;
  boothNumber: string;
  expoId: {
    _id: string;
    name: string; 
  };
  floor: string;
  isBooked: boolean; 
}

const ShowAllBooth: React.FC = () => {
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const response = await axios.get("/api/booths");
        setBooths(response.data);
      } catch (error) {
        console.error("Error fetching booths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooths();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">All Booths</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {booths.map((booth) => (
            <Card key={booth._id} className="shadow-lg rounded-lg bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Booth Number: {booth.boothNumber}</CardTitle>
                <CardDescription>
                  Event: <span className="font-semibold">{booth.expoId.name}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Availability Status:{" "}
                  <span
                    className={`font-semibold ${booth.isBooked ? "text-red-600" : "text-green-600"
                      }`}
                  >
                    {booth.isBooked ? "Booked" : "Available"}
                  </span>
                </p>
                <p className="text-sm">
                  Floor: <span className="font-semibold">{booth.floor == "F1" ? "Ground FLoor" : booth.floor == "F2" ? "First Floor" : "Second Floor"  }</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowAllBooth;
