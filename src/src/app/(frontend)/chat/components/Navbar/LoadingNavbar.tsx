"use client";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import NavbarLayout from "./NavbarLayout";

const dummysession = [
  {
    id: 1,
    name: "",
  },
  {
    id: 2,
    name: "",
  },
];

export default function LoadingNavbar() {
  return (
    <NavbarLayout>
      {(hideSideNavbar) => (
        <ul className="w-64 flex-grow space-y-4 pt-4">
          {dummysession.map((session) => {
            return (
              <li
                key={session.id}
                className={`h-8 py-2 px-4 bg-blur animate-pulse flex flex-row items-center space-x-4 rounded-lg hover:cursor-pointer mb-4`}
              />
            );
          })}
        </ul>
      )}
    </NavbarLayout>
  );
}
