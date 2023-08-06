import { RoleController } from "../controller/role.controller";
import { RoleRepository } from "../repository/role.repository";
import { RoleService } from "../service/role.service";

const roleRepository = new RoleRepository();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);
const roleRoute = roleController.router;
export default roleRoute;
