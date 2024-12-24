"use server";

import { z } from "zod";
import { getUser } from "@/utils/validation";
import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

const studentSchema = z.object({
  name: z.string().min(1),
  cohortId: z.string().min(1),
  courses: z.array(
    z.object({
      name: z.string().min(1),
      icon: z.string(),
    }),
  ),
  dateJoined: z.date(),
  lastLogin: z.date(),
  status: z.boolean(),
});

export type StudentDetails = z.infer<typeof studentSchema>;

export async function addStudent(studentData: StudentDetails) {
  try {
    if (!studentData || typeof studentData !== "object") {
      throw new Error("Student data must be a valid object");
    }

    const user = await getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const validatedData = studentSchema.parse(studentData);

    const addStudentData = await prisma.$transaction(async (prisma) => {
      const createdCourses = await Promise.all(
        validatedData.courses.map(async ({ name, icon }) => {
          const existingCourse = await prisma.course.findFirst({
            where: { name },
          });
          return await prisma.course.upsert({
            where: { id: existingCourse?.id ?? "" },
            update: { icon },
            create: { name, icon },
          });
        }),
      );

      const existingCohort = await prisma.cohort.findFirst({
        where: { name: validatedData.cohortId },
      });

      const cohort = await prisma.cohort.upsert({
        where: { id: existingCohort?.id ?? "" },
        create: { name: validatedData.cohortId },
        update: {},
      });

      const student = await prisma.student.create({
        data: {
          name: validatedData.name,
          cohort: {
            connect: { id: cohort.id },
          },
          courses: {
            create: createdCourses.map((course) => ({
              course: { connect: { id: course.id } },
            })),
          },
          dateJoined: validatedData.dateJoined,
          lastLogin:
            validatedData.lastLogin instanceof Date
              ? validatedData.lastLogin
              : new Date(validatedData.lastLogin),
          status: validatedData.status,
        },
        include: {
          cohort: true,
          courses: {
            include: {
              course: true,
            },
          },
        },
      });

      return student;
    });

    revalidatePath("/dashboard");
    return { success: true, student: addStudentData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add student",
    };
  }
}

const updateStudentSchema = z.object({
  id: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  cohortId: z.string().min(1, "Cohort ID is required"),
  courses: z.array(
    z.object({
      name: z.string().min(1, "Course name is required"),
      icon: z.string().min(1, "Course icon is required"),
    }),
  ),
  dateJoined: z.coerce.date(),
  lastLogin: z.coerce.date(),
  status: z.boolean(),
});

export type UpdateStudentDetails = z.infer<typeof updateStudentSchema>;

export async function updateStudent(studentData: UpdateStudentDetails) {
  try {
    if (!studentData || typeof studentData !== "object") {
      throw new Error("Student data must be a valid object");
    }

    const user = await getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    const validatedData = updateStudentSchema.parse(studentData);

    const updatedStudentData = await prisma.$transaction(async (tx) => {
      const existingStudent = await tx.student.findUnique({
        where: { id: validatedData.id },
      });

      if (!existingStudent) {
        throw new Error(`Student with ID ${validatedData.id} not found`);
      }

      const existingCohort = await tx.cohort.findFirst({
        where: { name: validatedData.cohortId },
      });

      const cohort = await tx.cohort.upsert({
        where: { id: existingCohort?.id ?? "" },
        create: { name: validatedData.cohortId },
        update: {},
      });

      const courseConnections = await Promise.all(
        validatedData.courses.map(async (courseData) => {
          const existingCourse = await tx.course.findFirst({
            where: { name: courseData.name },
          });

          const course = await tx.course.upsert({
            where: {
              id: existingCourse?.id ?? crypto.randomUUID(),
            },
            create: {
              name: courseData.name,
              icon: courseData.icon,
            },
            update: {
              icon: courseData.icon,
            },
          });
          return course;
        }),
      );

      const updatedStudent = await tx.student.update({
        where: { id: validatedData.id },
        data: {
          name: validatedData.name,
          cohort: {
            connect: { id: cohort.id },
          },
          courses: {
            deleteMany: {},
            create: courseConnections.map((course) => ({
              course: {
                connect: { id: course.id },
              },
            })),
          },
          dateJoined: validatedData.dateJoined,
          lastLogin: validatedData.lastLogin,
          status: validatedData.status,
        },
        include: {
          cohort: true,
          courses: {
            include: {
              course: true,
            },
          },
        },
      });

      return updatedStudent;
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      student: updatedStudentData,
    };
  } catch (error) {
    console.error("Error updating student:", error);

    let errorMessage = "Failed to update student";
    if (error instanceof z.ZodError) {
      errorMessage = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function deleteStudent(studentId: string) {
  try {
    if (!studentId) {
      throw new Error("Student ID is required");
    }

    const user = await getUser();
    if (!user) {
      throw new Error("Not authenticated");
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.coursesOnStudents.deleteMany({
        where: { studentId },
      });

      await prisma.student.delete({
        where: { id: studentId },
      });
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete student",
    };
  }
}
