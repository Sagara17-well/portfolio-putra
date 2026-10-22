import Site from "@/components/Site";
import { getWriteups } from "@/lib/writeups";

export default function Page() {
  return <Site writeups={getWriteups().slice(0, 3)} />;
}
