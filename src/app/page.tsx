import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-black text-white">
      <main className="flex flex-col gap-6 items-center text-center max-w-2xl">
        <Image src="/bbw25-logo.svg" alt="Berlin Blockchain Week 2025 logo" width={300} height={100} priority />

        <h1 className="text-4xl sm:text-5xl font-bold text-white">Berlin Blockchain Week 2025</h1>

        <h2 className="text-2xl text-orange-400 font-semibold -mt-4">June 8-22</h2>

        <div className="space-y-4">
          <p className="text-xl text-gray-300">Coming Soon to Berlin</p>
        </div>

        <div className="text-sm text-gray-400">Are you organizing an event? Submit it now!</div>

        <a
          href="https://baserow.io/form/m5If36R8jLWDU8eBM8LBxA22QFjwFRQtERzwnpS_-5I"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-orange-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity animate-pulse"
        >
          Submit Your Event
        </a>
      </main>
    </div>
  );
}
