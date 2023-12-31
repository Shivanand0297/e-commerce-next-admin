"use client";

import useOrigin from "@/hooks/useOrigin";
import ApiAlert from "../modals/ApiAlert";
import Heading from "./heading";
import { Separator } from "./separator";
import { useParams } from "next/navigation";

type Props = {
  entityName: string;
  entityIdName: string;
}

const ApiList = ({ entityName, entityIdName }: Props) => {

  let origin = useOrigin();
  let { storeId } = useParams();

  return (
    <>
      <Heading title="API" description="Api for connecting to store" />
      <Separator className="my-2"/>
      <div className="space-y-2">
        <ApiAlert
          title="GET"
          description={`${origin}/api/${storeId}/${entityName}`}
          variant="public"
        />

        <ApiAlert
          title="GET"
          description={`${origin}/api/${storeId}/${entityName}/[${entityIdName}]`}
          variant="public"
        />

        <ApiAlert
          title="POST"
          description={`${origin}/api/${storeId}/${entityName}`}
          variant="admin"
        />

        <ApiAlert
          title="PATCH"
          description={`${origin}/api/${storeId}/${entityName}/[${entityIdName}]`}
          variant="admin"
        />

        <ApiAlert
          title="DELETE"
          description={`${origin}/api/${storeId}/${entityName}/[${entityIdName}]`}
          variant="admin"
        />
      </div>
    </>
  )
}

export default ApiList