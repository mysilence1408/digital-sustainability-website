import contact from "@/content/contact";
import { pageMetadata } from "@/lib/seo";
import PageStructuredData from "@/components/seo/page-structured-data";
import ContactForm from "@/sections/contact/ContactForm";

export const metadata = pageMetadata("/contact", contact.metadata);

export default function Page() {
  return (
    <main id="main-content" tabIndex={-1}>
      <PageStructuredData path="/contact" title={contact.metadata.title} description={contact.metadata.description} />
      <ContactForm />
    </main>
  );
}
