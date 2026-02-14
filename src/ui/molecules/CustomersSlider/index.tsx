"use client";

import React from "react";

import Image from "next/image";
import "./styles.css";
import { getSliderCustomers } from "@/domains/customer/model/mock";

/**
 * CustomersSlider - Infinite scrolling logo slider
 *
 * Data source:
 * - NEXT_PUBLIC_CUSTOMERS env var (JSON array) if set
 * - Default mock data otherwise
 *
 * Features:
 * - CSS-only infinite animation (no JS needed)
 * - Duplicated items for seamless loop
 * - Respects prefers-reduced-motion
 * - Grayscale logos that colorize on hover
 *
 * Story 12.7: Secondary blade component (FR15-FR17)
 *
 * @see .env.template for NEXT_PUBLIC_CUSTOMERS format
 */
const CustomersSlider = (): React.JSX.Element => {
  // Get customers from env or defaults
  const customers = getSliderCustomers();

  // Duplicate the array for seamless infinite scroll
  const duplicatedCustomers = [...customers, ...customers];

  return (
    <div className="customers-slider" data-testid="customers-slider">
      <div className="customers-slider__track">
        {duplicatedCustomers.map((customer, idx) => (
          <div
            key={`${customer.id}-${idx}`}
            className="customers-slider__slide"
          >
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
