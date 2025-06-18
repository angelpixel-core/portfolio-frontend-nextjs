import "./styles.css";

import { Customer } from "@/models";

import Image from "next/image";

function CustomerImage({ src }) {
  return (
    <div className="slide">
      <Image
        src={src}
        alt="customer-image"
        width={1080}
        height={720}
        className="slide-image"
      />
    </div>
  );
}

export async function CustomersSlider() {
  const customers = await Customer.all()
    .then((records) => {
      return records.map((customer) => ({ src: customer.src }));
    })
    .then((mapped) => {
      return mapped.concat(mapped);
    });

  return (
    <div className="slider">
      <div className="flex slide-track gap-32">
        {customers.map((customer, idx) => (
          <CustomerImage key={idx} src={customer.src} />
        ))}
      </div>
    </div>
  );
}
