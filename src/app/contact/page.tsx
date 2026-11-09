import ContactForm from "@/sections/contact/ContactForm";

export const metadata: Metadata = {
  title: contact.metadata.title,
  description: contact.metadata.description,
};

export default function Page() {
  return (
    <main>
      <ContactForm />
    </main>
  );
}
import type { Metadata } from "next";
import contact from "@/content/contact";
