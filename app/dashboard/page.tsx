import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import prisma from "../lib/db";
import { requireUser } from "../lib/hooks";
import { ExternalLink, Pen, Settings, Trash, Users2 } from "lucide-react";

import { EmptyState } from "../components/dashboard/EmptyState";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuActiveSwitcher } from "../components/dashboard/EventTypeSwitcher";
import { CopyLinkMenuItem } from "../components/dashboard/CopyLinkMenuItem";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },

    select: {
      EventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      username: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const DashbaordPage = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-4xl md:text-5xl text-gray-900 dark:text-gray-100">
              Event Types
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Create and manage your event types.
            </p>
          </div>
          <Button
            variant="primary"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-4 py-2"
            asChild
          >
            <Link href="/dashboard/new">Create New Event</Link>
          </Button>
        </div>
        {data.EventType.length === 0 ? (
          <EmptyState
            title="You have no Event Types"
            description="You can create your first event type by clicking the button above."
            buttonText="Add Event Type"
            href="/dashboard/new"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.EventType.map((item) => (
              <div
                className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border relative"
                key={item.id}
              >
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md p-2"
                      >
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end">
                      <DropdownMenuLabel className="text-gray-700 dark:text-gray-300 font-medium">
                        Event
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${data.username}/${item.url}`}
                            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center px-4 py-2 rounded-md"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Preview</span>
                          </Link>
                        </DropdownMenuItem>
                        <CopyLinkMenuItem
                          meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.username}/${item.url}`}
                        />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/event/${item.id}`}
                            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center px-4 py-2 rounded-md"
                          >
                            <Pen className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/event/${item.id}/delete`}
                          className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 flex items-center px-4 py-2 rounded-md"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link
                  href={`/dashboard/event/${item.id}`}
                  className="block p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users2 className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {item.duration} Minutes Meeting
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {item.title}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </Link>
                <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 flex justify-between items-center">
                  <MenuActiveSwitcher
                    initialChecked={item.active}
                    eventTypeId={item.id}
                  />

                  <Button
                    variant="secondary"
                    className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md px-4 py-2"
                  >
                    <Link href={`/dashboard/event/${item.id}`}>Edit Event</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashbaordPage;
