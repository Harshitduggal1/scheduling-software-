"use client";

import { useState } from "react";
import { SettingsAction } from "@/app/actions";
import { aboutSettingsSchema } from "@/app/lib/zodSchemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { SubmitButton } from "../SubmitButton";
import { UploadDropzone } from "@/app/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface iAppProps {
  fullName: string;
  email: string;
  profileImage: string;
}

export function SettingsForm({ fullName, email, profileImage }: iAppProps) {
  const [lastResult, action] = useFormState(SettingsAction, undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);

  // Initialize the form state
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: aboutSettingsSchema });
    },

    // Validate the form on blur event triggered
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  // Handle deleting the profile image
  const handleDeleteImage = () => {
    setCurrentProfileImage("");
  };

  return (
    // Card component with modern styling
    <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <CardTitle className="text-gray-900 dark:text-gray-100 text-lg font-bold">
          Settings
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
          Manage your account settings.
        </CardDescription>
      </CardHeader>
      <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
        {/* Card content with form fields */}
        <CardContent className="px-6 py-4 space-y-4">
          {/* Full Name field */}
          <div className="flex flex-col">
            <Label className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Full Name
            </Label>
            <Input
              name={fields.fullName.name}
              key={fields.fullName.key}
              placeholder="Jan Marshall"
              defaultValue={fullName}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600 rounded-md"
            />
            <p className="text-red-500 text-sm">{fields.fullName.errors}</p>
          </div>

          {/* Email field (disabled) */}
          <div className="flex flex-col">
            <Label className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Email
            </Label>
            <Input
              disabled
              placeholder="Jan Marshall"
              defaultValue={email}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>

          {/* Profile Image section */}
          <div className="grid gap-y-4">
            <input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentProfileImage}
            />
            <Label className="text-gray-700 dark:text-gray-300 font-medium">
              Profile Image
            </Label>
            {currentProfileImage ? (
              // Existing profile image
              <div className="relative w-32 h-32">
                <Image
                  src={currentProfileImage}
                  alt="Profile"
                  width={300}
                  height={300}
                  className="rounded-lg w-32 h-32 object-cover"
                />
                <Button
                  type="button"
                  onClick={handleDeleteImage}
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-2"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              // No profile image, show upload dropzone
              <UploadDropzone
                endpoint="imageUploader"
                appearance={{
                  container: "border-muted",
                }}
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Profile image uploaded");
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
              />
            )}
            <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
          </div>
        </CardContent>

        {/* Card footer with submit button */}
        <CardFooter className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
}
