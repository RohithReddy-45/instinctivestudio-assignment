import Hero from "@/components/hero";

export default async function Index() {
  return (
    <section className="flex flex-col min-h-screen container mx-auto max-w-7xl">
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        Landing page
      </main>
    </section>
  );
}
