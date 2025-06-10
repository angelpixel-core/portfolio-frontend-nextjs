const customers = [
  { id: 1, src: "/images/customers/bitex.png" },
  { id: 2, src: "/images/customers/compass.png" },
  { id: 3, src: "/images/customers/nubi.png" },
  { id: 4, src: "/images/customers/southworks.png" },
  { id: 5, src: "/images/customers/unlp.png" },
];

async function all() {
  return customers;
}

async function fetchBy({ id }) {
  return customers.filter((exp) => exp.id == id);
}

export const Customer = {
  all,
  fetchBy,
};
