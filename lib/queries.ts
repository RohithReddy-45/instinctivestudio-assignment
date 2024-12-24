import "server-only";
import prisma from "@/utils/prisma";
import { format } from "date-fns";

export async function getStudents() {
  try {
    await prisma.$connect();

    const result = await prisma.$transaction(async (transaction) => {
      const students = await transaction.student.findMany({
        select: {
          id: true,
          name: true,
          courses: {
            select: {
              course: {
                select: {
                  id: true,
                  name: true,
                  icon: true,
                },
              },
            },
          },
          cohort: {
            select: {
              name: true,
            },
          },
          dateJoined: true,
          lastLogin: true,
          status: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return students;
    });

    return result.map((student) => ({
      id: student.id,
      name: student.name,
      cohort: student.cohort.name,
      courses: student.courses.map((c) => ({
        id: c.course.id,
        name: c.course.name,
        icon: c.course.icon,
      })),
      dateJoined: format(student.dateJoined, "dd. MMM. yyyy"),
      lastLogin: format(student.lastLogin, "dd. MMM. yyyy h:mm a"),
      status: student.status ? "active" : "inactive",
    }));
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch students",
    };
  } finally {
    await prisma.$disconnect();
  }
}
