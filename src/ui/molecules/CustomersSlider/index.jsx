"use client";

import "./styles.css";

import { Suspense } from "react";

import Image from "next/image";

// import { useCustomers } from "@/domains/customer/queries";

const CustomersSlider = async () => {
  // const {
  //   data: customers,
  //   isLoading: isLoadingCustomers,
  //   isError: isErrorCustomers,
  // } = useCustomers();

  return (
    <div className="slider">
      <div className="flex slide-track gap-32">
        CustomersSlider
        {/* <Suspense fallback={<span>Loading 1 Customers ...</span>}> */}
        {/*   {isLoadingCustomers && <span>Loading 2 Customers ...</span>} */}
        {/*   {isErrorCustomers && ( */}
        {/*     <p className="text-red-500 text-sm p-2"> */}
        {/*       Error loading navigation items. */}
        {/*     </p> */}
        {/*   )} */}
        {/*   {[...customers, ...customers].map((customer, idx) => ( */}
        {/*     <div key={idx} className="slide"> */}
        {/*       <Image */}
        {/*         src={customer.src} */}
        {/*         alt="customer-image" */}
        {/*         width={1080} */}
        {/*         height={720} */}
        {/*         className="slide-image" */}
        {/*       /> */}
        {/*     </div> */}
        {/*   ))} */}
        {/* </Suspense> */}
      </div>
    </div>
  );
};

export default CustomersSlider;
