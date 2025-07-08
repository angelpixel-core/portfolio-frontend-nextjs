import { customersService as service } from "@/services";

const Customer = {
  all: service.fetchAll,
  findBy: service.fetchBy,
};

export default Customer;
