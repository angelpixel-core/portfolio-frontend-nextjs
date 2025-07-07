import { customersService as service } from "@/services";

const Customer = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default Customer;

/*
const customers = [
  { id: 1, src: "/images/customers/bitex.png" },
  { id: 2, src: "/images/customers/compass.png" },
  { id: 3, src: "/images/customers/nubi.png" },
  { id: 4, src: "/images/customers/southworks.png" },
  { id: 5, src: "/images/customers/unlp.png" },
];

const all = async () => {
  return customers;
};

const fetchBy = async ({ id }) => {
  return customers.filter((exp) => exp.id == id);
};

const Customer = {
  all,
  fetchBy,
};
*/
