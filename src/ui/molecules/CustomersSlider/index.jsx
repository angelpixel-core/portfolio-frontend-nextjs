import "./styles.css";

import Image from "next/image";

import { Customer } from "@/models";

const CustomersSlider = async () => {
  const customers = await Customer.fetchAll();

  return (
    <div className="slider">
      <div className="flex slide-track gap-32">
        {[...customers, ...customers].map((customer, idx) => (
          <div key={idx} className="slide">
            <Image
              src={customer.src}
              alt="customer-image"
              width={1080}
              height={720}
              className="slide-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersSlider;
