import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cohort = await prisma.cohort.create({
    data: {
      name: "AY 2024-25",
    },
  });

  const scienceCourse = await prisma.course.create({
    data: {
      name: "CBSE 9 Science",
      icon: "/science-icon.png",
    },
  });

  const mathCourse = await prisma.course.create({
    data: {
      name: "CBSE 9 Math",
      icon: "/math-icon.png",
    },
  });

  const students = [
    "Aarav Dadhaniya",
    "Vihaan Dadhaniya",
    "Aarav Patel",
    "Suhaan Patel",
  ];

  for (const name of students) {
    await prisma.student.create({
      data: {
        name,
        cohortId: cohort.id,
        courses: {
          create: [{ courseId: scienceCourse.id }, { courseId: mathCourse.id }],
        },
        dateJoined: new Date("2024-11-17"),
        lastLogin: new Date("2024-11-17T16:16:00"),
        status: Math.random() > 0.2,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });
