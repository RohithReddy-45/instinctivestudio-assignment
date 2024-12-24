"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteStudentDialog } from "./delete-student-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { UpdateStudentSheet } from "./update-student-sheet";

export type Course = {
  id: string;
  name: string;
  icon: string;
};

export type Student = {
  id: string;
  name: string;
  cohort: string;
  courses: Course[];
  dateJoined: string;
  lastLogin: string;
  status: string;
};

export function StudentsTable({ students }: { students: Student[] }) {
  if (students.length === 0) {
    return <div className="flex items-center justify-center">No data found</div>
  }

  return (
    <div className="rounded-md border-b last:border-b-0">
      <Table className="min-w-max">
        <TableHeader className="text-xs">
          <TableRow className="font-bold">
            <TableHead className="text-neutral-900 font-bold">Student Name</TableHead>
            <TableHead className="text-neutral-900 font-bold">Cohort</TableHead>
            <TableHead className="text-neutral-900 font-bold">Courses</TableHead>
            <TableHead className="text-neutral-900 font-bold">Date Joined</TableHead>
            <TableHead className="text-neutral-900 font-bold">Last Login</TableHead>
            <TableHead className="text-neutral-900 font-bold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xs">
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.cohort}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {student.courses.map((course) => (
                    <div
                      key={`${course.id}-${course.icon.substring(0, 5)}`}
                      className="flex bg-[#F6F8FA] pl-1 pr-5 py-[2px] rounded items-center gap-1 text-xs font-medium"
                    >
                      <img src={course.icon} alt="avatar" className="size-5 rounded" />
                      {course.name}
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell>{student.dateJoined}</TableCell>
              <TableCell>{student.lastLogin}</TableCell>
              <TableCell className="flex justify-center items-center">
                <div
                  className={`size-3.5 inline-block rounded-full ${student.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                />
              </TableCell>
              <TableCell className="p-0 pb-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center justify-center">
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    <DropdownMenuItem>
                      <UpdateStudentSheet student={student} />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="">
                      <DeleteStudentDialog student={student} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div >
  )
}
