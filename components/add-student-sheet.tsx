"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus } from 'lucide-react'
import { addStudent } from "@/app/actions/student-actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Course {
  id: string;
  name: string;
  icon: string;
}

const courses: Course[] = [
  { id: '1', name: 'CBSE 9 Science', icon: '/science-icon.png' },
  { id: '2', name: 'CBSE 9 Math', icon: '/math-icon.png' },
]

export function AddStudentSheet() {
  const [name, setName] = useState("")
  const [cohort, setCohort] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [dateJoined, setDateJoined] = useState<Date>(new Date())
  const [lastLoginDate, setLastLoginDate] = useState<Date | null>(null)
  const [lastLoginTime, setLastLoginTime] = useState("")
  const [status, setStatus] = useState(true)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const handleSubmit = async () => {
    const studentData = {
      name,
      cohortId: cohort,
      courses: selectedCourses.map(course => ({
        name: course.name,
        icon: course.icon
      })),
      dateJoined,
      lastLogin: lastLoginDate ? new Date(`${format(lastLoginDate, 'yyyy-MM-dd')} ${lastLoginTime}`) : new Date(),
      status: status
    }

    const result = await addStudent(studentData)
    if (result.success) {

      toast({
        title: "Student Added",
        description: `Successfully added ${name}`,
      })
      setName("");
      setCohort("");
      setSelectedCourses([]);
      setDateJoined(new Date());
      setLastLoginDate(null);
      setLastLoginTime("");
      setStatus(true);

      setOpen(false)

    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }

  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="px-4 py-2 flex items-center rounded bg-[#E9EDF1] text-[#3F526E]">
          <Plus size={18} className="sm:mr-2" />
          <span className="hidden sm:block">Add new Student</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"} className="sm:max-w-[425px] h-[96vh] sm:h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <SheetHeader>
          <SheetTitle>Add New Student</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4 overflow-y-auto" onClick={
          (e) => e.stopPropagation()
        }>
          <FormField label="Student Name" id="name">
            <Input
              id="name"
              required
              minLength={2}
              maxLength={255}
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField label="Cohort" id="cohort">
            <Select value={cohort} onValueChange={setCohort}>
              <SelectTrigger>
                <SelectValue placeholder="Select cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AY 2024-25">AY 2024-25</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Courses">
            <Select
              onValueChange={(value) => {
                const course = courses.find(c => c.name === value);
                if (course && !selectedCourses.some(selected => selected?.name === value)) {
                  setSelectedCourses([...selectedCourses, course]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select courses" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem
                    key={course.id}
                    value={course.name}
                    disabled={selectedCourses.some(selected => selected?.name === course?.name)}
                  >
                    {course?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {
              selectedCourses.length > 0 &&
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedCourses.map((course) => (
                  <div key={course?.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary">
                    {course?.name}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => setSelectedCourses(selectedCourses.filter(c => c?.name !== course?.name))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            }
          </FormField>

          <FormField label="Date Joined">
            <DatePicker
              date={dateJoined}
              onSelect={(day: Date | undefined) => day && setDateJoined(day)}
            />
          </FormField>

          <FormField label="Last Login">
            <div className="grid gap-2">
              <DatePicker
                date={lastLoginDate}
                onSelect={(day) => setLastLoginDate(day ?? null)}
              />
              <Input
                required
                type="time"
                value={lastLoginTime}
                onChange={(e) => setLastLoginTime(e.target.value)}
                className="w-full"
              />
            </div>
          </FormField>

          <FormField label="Status">
            <div className="flex items-center space-x-2">
              <Switch id="status" checked={status} onCheckedChange={setStatus} />
              <Label htmlFor="status">Active</Label>
            </div>
          </FormField>

          <Button type="submit" className="mt-4" onClick={handleSubmit}>
            Add Student
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function FormField({ label, id, children }: { label: string; id?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function DatePicker({ date, onSelect }: { date: Date | null; onSelect: (date: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
