import { Role } from "../utils/role.enum";

export class RoleRepository {
  private roleRepository;
  constructor() {
    this.roleRepository = Role;
  }

  getAllRoles(): Object {
    return Object.values(Role);
  }
}
