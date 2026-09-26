import ServiceTile from "@/components/ui/ServiceTile";
import { services } from "@/lib/site-content";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="shell py-[clamp(3rem,7vw,8rem)]"
      aria-label="Our services"
    >
      <h2 className="sr-only">Our services</h2>
      <div className="grid grid-cols-1 gap-x-[clamp(1rem,4vw,5rem)] gap-y-[clamp(1rem,3vw,3.5rem)] sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceTile key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
