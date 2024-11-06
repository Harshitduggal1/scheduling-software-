"use client";

import { CreateEventTypeAction } from "@/app/actions";
import { SubmitButton } from "@/app/components/SubmitButton";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { useFormState } from "react-dom";

type Platform = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

const CreateNewEvent = () => {
  const [lastResult, action] = useFormState(CreateEventTypeAction, undefined);
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eventTypeSchema });
    },

    // Validate the form on blur event triggered
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const [activePlatform, setActivePlatform] = useState<Platform>("Google Meet");

  // Function to toggle the active platform
  const togglePlatform = (platform: Platform) => {
    setActivePlatform(platform);
  };

  return (
    // Use Framer Motion for smooth transitions
    <motion.div
      className="h-full w-full flex-1 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card text-card-foreground shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Add new appointment type
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Create a new appointment type that allows people to book times.
          </CardDescription>
        </CardHeader>
        <form noValidate id={form.id} onSubmit={form.onSubmit} action={action}>
          <CardContent className="grid gap-y-6">
            {/* Title input */}
            <div className="flex flex-col gap-y-2">
              <Label className="text-muted-foreground">Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
                placeholder="30 min meeting"
                className="bg-card text-card-foreground border-muted focus:border-primary focus:ring-primary"
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>

            {/* URL slug input */}
            <div className="grid gap-y-2 ">
              <Label className="text-muted-foreground">URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                  CalMarshal.com/
                </span>
                <Input
                  type="text"
                  key={fields.url.key}
                  defaultValue={fields.url.initialValue}
                  name={fields.url.name}
                  placeholder="example-user-1"
                  className="rounded-l-none bg-card text-card-foreground border-muted focus:border-primary focus:ring-primary"
                />
              </div>
              <p className="text-red-500 text-sm">{fields.url.errors}</p>
            </div>

            {/* Description textarea */}
            <div className="grid gap-y-2">
              <Label className="text-muted-foreground">Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={fields.description.initialValue}
                placeholder="30 min meeting"
                className="bg-card text-card-foreground border-muted focus:border-primary focus:ring-primary"
              />
              <p className="text-red-500 text-sm">
                {fields.description.errors}
              </p>
            </div>

            {/* Duration select */}
            <div className="grid gap-y-2">
              <Label className="text-muted-foreground">Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={fields.duration.initialValue}
                className="bg-card text-card-foreground border-muted focus:border-primary focus:ring-primary"
              >
                <SelectTrigger className="py-2 px-4 rounded-md">
                  <SelectValue placeholder="Select the duration" />
                </SelectTrigger>
                <SelectContent className="bg-card text-card-foreground shadow-lg rounded-md">
                  <SelectGroup>
                    <SelectLabel className="text-muted-foreground">
                      Duration
                    </SelectLabel>
                    <SelectItem
                      value="15"
                      className="hover:bg-muted hover:text-muted-foreground"
                    >
                      15 Mins
                    </SelectItem>
                    <SelectItem
                      value="30"
                      className="hover:bg-muted hover:text-muted-foreground"
                    >
                      30 Min
                    </SelectItem>
                    <SelectItem
                      value="45"
                      className="hover:bg-muted hover:text-muted-foreground"
                    >
                      45 Mins
                    </SelectItem>
                    <SelectItem
                      value="60"
                      className="hover:bg-muted hover:text-muted-foreground"
                    >
                      1 Hour
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.duration.errors}</p>
            </div>

            {/* Video call platform buttons */}
            <div className="grid gap-y-2">
              <input
                type="hidden"
                name={fields.videoCallSoftware.name}
                value={activePlatform}
              />
              <Label className="text-muted-foreground">Video Call Provider</Label>
              <ButtonGroup className="w-full">
                <Button
                  onClick={() => togglePlatform("Zoom Meeting")}
                  type="button"
                  className="w-full rounded-md"
                  variant={
                    activePlatform === "Zoom Meeting"
                      ? "secondary"
                      : "outline"
                  }
                >
                  Zoom
                </Button>
                <Button
                  onClick={() => togglePlatform("Google Meet")}
                  type="button"
                  className="w-full rounded-md"
                  variant={
                    activePlatform === "Google Meet"
                      ? "secondary"
                      : "outline"
                  }
                >
                  Google Meet
                </Button>
                <Button
                  variant={
                    activePlatform === "Microsoft Teams"
                      ? "secondary"
                      : "outline"
                  }
                  type="button"
                  className="w-full rounded-md"
                  onClick={() => togglePlatform("Microsoft Teams")}
                >
                  Microsoft Teams
                </Button>
              </ButtonGroup>
            </div>
          </CardContent>
          <CardFooter className="w-full flex justify-between">
            <Button
              asChild
              variant="secondary"
              className="rounded-md shadow-md hover:bg-muted hover:text-muted-foreground"
            >
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton text="Create Event Type" />
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default CreateNewEvent;
