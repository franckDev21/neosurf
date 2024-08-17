import { CardPinCode } from "@/components/CardPinCode";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="bg-gray-200 h-screen">
      <header className=" bg-[#212854] py-2 px-10 text-white">
        {/* <h1 className='text-[#F90186] text-4xl font-extrabold'>Neo surf</h1> */}
        <Image src="/logo.png" width={120} height={200} alt="logo" />
      </header>

      <div className="px-6">
        <CardPinCode />
      </div>

      <Toaster />
    </div>
  );
}
