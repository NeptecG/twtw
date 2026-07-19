import { notFound } from "next/navigation";

// Any URL that no real route matched lands here and renders the localized 404.
export default function CatchAllPage() {
  notFound();
}
