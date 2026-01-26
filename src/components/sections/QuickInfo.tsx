"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Calendar } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const infoItems = [
  {
    icon: MapPin,
    label: "Location",
    value: CONTACT_INFO.address,
    href: CONTACT_INFO.googleMapsUrl,
    isExternal: true,
  },
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT_INFO.phoneDisplay,
    href: `tel:${CONTACT_INFO.phone}`,
    isExternal: false,
  },
  {
    icon: Mail,
    label: "Email",
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
    isExternal: false,
  },
  {
    icon: Calendar,
    label: "Season",
    value: CONTACT_INFO.season,
    href: null,
    isExternal: false,
  },
];

export default function QuickInfo() {
  return (
    <section className="py-12 md:py-16 bg-[var(--color-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-1">
                      {item.label}
                    </p>
                    <p className="text-white font-medium leading-tight">
                      {item.value}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-1">
                      {item.label}
                    </p>
                    <p className="text-white font-medium leading-tight">
                      {item.value}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
