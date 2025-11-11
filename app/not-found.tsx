import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <Separator className="mb-8 bg-white/20 max-w-md mx-auto" />
        
        <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-300 mb-8">
          The miniature you&apos;re looking for seems to have wandered off the map.
        </p>
        
        <Separator className="mb-8 bg-white/20 max-w-md mx-auto" />
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/"
            className="cursor-pointer px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-all hover:scale-105"
          >
            Return Home
          </Link>
          
          <Link
            href="/figurefinder"
            className="cursor-pointer px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-full transition-all hover:scale-105"
          >
            Browse Miniatures
          </Link>
        </div>
      </div>
    </div>
  );
}
