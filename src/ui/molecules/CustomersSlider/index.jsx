"use client";

import Image from "next/image";
import "./styles.css";

/**
 * Customer logo data for infinite slider
 * Logos stored in public/images/customers/
 */
const customers = [
  { id: 1, name: "Compass", logo: "/images/customers/compass.png" },
  { id: 2, name: "SouthWorks", logo: "/images/customers/southworks.png" },
  { id: 3, name: "Nubi", logo: "/images/customers/nubi.png" },
  { id: 4, name: "Bitex", logo: "/images/customers/bitex.png" },
  { id: 5, name: "UNLP", logo: "/images/customers/unlp.png" },
];

/**
 * CustomersSlider - Infinite scrolling logo slider
 *
 * Features:
 * - CSS-only infinite animation (no JS needed)
 * - Duplicated items for seamless loop
 * - Respects prefers-reduced-motion
 * - Grayscale logos that colorize on hover
 *
 * Story 12.7: Secondary blade component (FR15-FR17)
 */
const CustomersSlider = () => {
  // Duplicate the array for seamless infinite scroll
  const duplicatedCustomers = [...customers, ...customers];

  return (
    <div className="customers-slider" data-testid="customers-slider">
      <div className="customers-slider__track">
        {duplicatedCustomers.map((customer, idx) => (
          <div key={`${customer.id}-${idx}`} className="customers-slider__slide">
            <Image
              src={customer.logo}
              alt={`${customer.name} logo`}
              width={150}
              height={60}
              className="customers-slider__logo"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersSlider;
