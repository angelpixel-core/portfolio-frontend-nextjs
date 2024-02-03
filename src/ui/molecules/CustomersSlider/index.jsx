import "./styles.css";

import Image from "next/image";

import bitex from "@/images/home/customers/bitex.png";
import compass from "@/images/home/customers/compass.png";
import nubi from "@/images/home/customers/nubi.png";
import southworks from "@/images/home/customers/southworks.png";
import unlp from "@/images/home/customers/unlp.png";

const CustomerImage = ({ src }) => {
  return (
    <div className="slide">
      <Image src={src} alt="customer-image" className="slide-image" />
    </div>
  );
};

export function CustomersSlider() {
  return (
    <div className="slider">
      <div className="flex slide-track flex gap-32">
        <CustomerImage src={unlp} />
        <CustomerImage src={bitex} />
        <CustomerImage src={nubi} />
        <CustomerImage src={southworks} />
        <CustomerImage src={compass} />
        <CustomerImage src={unlp} />
        <CustomerImage src={bitex} />
        <CustomerImage src={nubi} />
        <CustomerImage src={southworks} />
        <CustomerImage src={compass} />
      </div>
    </div>
  );
}
