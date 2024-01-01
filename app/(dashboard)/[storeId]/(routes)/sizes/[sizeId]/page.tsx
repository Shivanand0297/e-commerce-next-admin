import prismadb from "@/lib/prismadb";
import SizeForm from "../components/SizeForm";

type SizePageProps = {
  params: {
    sizeId: string;
  }
}

const SizePage = async ({ params }: SizePageProps) => {

  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    }
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size}/>
      </div>
    </div>
  )
}

export default SizePage