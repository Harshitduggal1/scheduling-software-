"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
 
    <div className="h-screen w-screen flex items-center justify-center">
      {/* Card component with modern styling */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-[400px] w-full mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
  
          <CardContent className="p-6 flex flex-col w-full items-center">
 
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-green-500 dark:text-green-400" />
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
              This event is scheduled
            </h1>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
              We emailed you and the other attendees a calendar invitation with
              all the details.
            </p>
          </CardContent>

          {/* Card footer with close button */}
          <CardFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <Button
              as={Link}
              href="/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md w-full"
            >
              Close this Page
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
