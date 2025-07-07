import { profilesService as service } from "@/services";

const Profile = {
  fetchAll: service.fetchAll,
  fetchBy: service.fetchBy,
};

export default Profile;
