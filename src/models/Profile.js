import { profilesService as service } from "@/services";

const Profile = {
  all: service.fetchAll,
  findBy: service.fetchBy,
};

export default Profile;
