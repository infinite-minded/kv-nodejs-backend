import { DataSource, EntityNotFoundError } from "typeorm";
import { when } from "jest-when";
import { DepartmentService } from "../../service/department.service";
import { DepartmentRepository } from "../../repository/department.repository";
import { Department } from "../../entity/department-entity";
import { CreateAddressDto } from "../../dto/create-address.dto";
import { CreateEmployeeDto } from "../../dto/create-employee.dto";
import { Role } from "../../utils/role.enum";
import { UpdateEmployeeDto } from "../../dto/update-employee.dto";
import { CreateDepartmentDto } from "../../dto/create-department.dto";
import { UpdateDepartmentDto } from "../../dto/update-department.dto";
import Employee from "../../entity/employee.entity";

describe("Department Service Tests", () => {
  let departmentService: DepartmentService;
  let departmentRepository: DepartmentRepository;
  beforeAll(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
    } as unknown as DataSource;
    departmentRepository = new DepartmentRepository(
      dataSource.getRepository(Department)
    );
    departmentService = new DepartmentService(departmentRepository);
  });

  describe("Test for getDepartmentById", () => {
    test("Test for invalid department ID", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith(1).mockResolvedValue(null); //ResolvedValue is used with async functions
      departmentRepository.findDepartmentById = mockFunction;
      expect(async () => {
        await departmentService.getDepartmentById(1);
      }).rejects.toThrowError();
    });
    test("Should return value when department with proper ID", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith(1).mockResolvedValue({
        id: 2,
        name: "dept2",
      });
      departmentRepository.findDepartmentById = mockFunction;
      const department = await departmentService.getDepartmentById(1);
      expect(department).toStrictEqual({
        id: 2,
        name: "dept2",
      });
    });
  });

  describe("Test for fetchAllDepartments", () => {
    test("Test for returning all departments successfully if exists", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith().mockResolvedValueOnce({
        id: 1,
        name: "dept1",
      });
      departmentRepository.findAllDepartments = mockFunction;
      expect(await departmentService.fetchAllDepartments()).toStrictEqual({
        id: 1,
        name: "dept1",
      });
    });
    test("Test for case when no department exists", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith().mockResolvedValueOnce(null);
      departmentRepository.findAllDepartments = mockFunction;
      expect(async () => {
        await departmentService.fetchAllDepartments();
      }).rejects.toThrowError();
    });
  });

  describe("Test for createDepartment", () => {
    const departmentDto: CreateDepartmentDto = {
      name: "dept1",
    };
    const department = {
      id: 1,
      name: "HR",
    };
    test("Test with valid department details", async () => {
      const mockedFunction = jest.fn();
      when(mockedFunction).mockResolvedValue({ id: 1, name: "HR" });
      departmentRepository.addNewDepartment = mockedFunction;
      const dep = await departmentService.createDepartment(CreateDepartmentDto);
      expect(dep).toStrictEqual({ id: 1, name: "HR" });
    });
  });

  describe("Test for updateDepartment", () => {
    const departmentDto: UpdateDepartmentDto = {
      id: 1,
      name: "HR",
    };
    const department = {
      id: 1,
      name: "HR",
    };
    test("Test with valid department details", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      when(mockFunction1).calledWith(1).mockResolvedValue({ id: 1, name: "HR" });
      departmentService.getDepartmentById = mockFunction1;
      when(mockFunction2).calledWith({ id: 1, name: "HR" }).mockResolvedValue({ id: 1, name: "HR" });
      expect(
        await departmentService.updateDepartment(departmentDto)
      ).toStrictEqual({ id: 1, name: "HR" });
    });
    test("Test for invalid department ID", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      when(mockFunction1).calledWith(1).mockResolvedValue(null);
      when(mockFunction2).calledWith(department).mockResolvedValue(department);
      departmentService.getDepartmentById = mockFunction1;
      departmentRepository.modifyDepartmentById = mockFunction2;
      expect(async () => {
        await departmentService.updateDepartment(departmentDto);
      }).rejects.toThrowError();
    });
  });

  describe("Test for getDepartmentByName", () => {
    const department: Department = {
      id: 1,
      name: "dept1",
      employees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };
    test("Test for invalid department name", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith("dept1").mockResolvedValue(null); //ResolvedValue is used with async functions
      departmentRepository.findDepartmentByName = mockFunction;
      expect(async () => {
        await departmentService.getDepartmentByName("dept1");
      }).rejects.toThrowError();
    });
    test("Test for return value when fetching department with valid name", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith("dept1").mockResolvedValue(department);
      departmentRepository.findDepartmentByName = mockFunction;
      const dept = await departmentService.getDepartmentByName("dept1");
      expect(dept).toStrictEqual(department);
    });
  });

  describe("Test for deleteDepartment", () => {
    test("Test for invalid department ID", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      when(mockFunction1)
        .calledWith(1)
        .mockRejectedValueOnce(EntityNotFoundError);
      departmentService.getDepartmentById = mockFunction1;
      departmentRepository.deleteDepartmentById = mockFunction2;
      expect(async () => {
        await departmentService.getDepartmentById(1);
      }).rejects.toThrowError();
    });
    test("Test for success when deleting department with valid ID", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      const dept: Department = {
        id: 1,
        name: "dept1",
        employees: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      when(mockFunction1).calledWith(1).mockResolvedValue(dept);
      departmentService.getDepartmentById = mockFunction1;
      departmentRepository.deleteDepartmentById = mockFunction2;
      const department = await departmentService.deleteDepartment(1);
      expect(mockFunction2).toBeCalledWith(dept);
    });
  });
});
