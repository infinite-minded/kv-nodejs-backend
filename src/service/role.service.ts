import { RoleRepository } from "../repository/role.repository";

export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  fetchAllRoles(): Object {
    return this.roleRepository.getAllRoles();
  }
}
