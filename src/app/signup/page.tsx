import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="h-screen overflow-hidden flex items-center justify-center">
      {/* Grey rectangle with rounded corners */}
      <div className="w-[1100px] h-[700px] border-2 border-gray-300 rounded-4xl bg-transparent flex">
        {/* Left side - empty for now */}
        <div className="flex-1"></div>
        
        {/* Right side - Hong Kong image */}
        <div className="flex-1 flex justify-center items-center p-2">
          <div className="relative w-full h-full">
            <Image 
              src="/Hong-Kong-EarnestTse-Shutterstock.webp"
              alt="Hong Kong skyline"
              fill
              className="object-cover rounded-3xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}