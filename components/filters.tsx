import { StudentsTable } from "./students-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getStudents } from "@/lib/queries"
import { AddStudentSheet } from "./add-student-sheet"

export default async function Filters() {
  const response = await getStudents()

  const students = 'success' in response ? [] : response

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex justify-between items-center flex-wrap text-xs sm:text-base font-bold text-[#3F526E]">
        <div className="flex gap-3">
          <Select defaultValue="AY 2024-25">
            <SelectTrigger className="bg-[#E9EDF1] w-28 sm:w-32 text-xs sm:text-base">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AY 2024-25">AY 2024-25</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="CBSE 9">
            <SelectTrigger className="bg-[#E9EDF1] w-24 sm:w-28 text-xs sm:text-base">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CBSE 9">CBSE 9</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AddStudentSheet />
      </div>
      <StudentsTable students={students} />
    </div>
  )
}
