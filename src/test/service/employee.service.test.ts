import { DataSource, EntityNotFoundError } from "typeorm";
import EmployeeRepository from "../../repository/employee.repository";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import { DepartmentService } from "../../service/department.service";
import { DepartmentRepository } from "../../repository/department.repository";
import { Department } from "../../entity/department-entity";
import { CreateAddressDto } from "../../dto/create-address.dto";
import { CreateEmployeeDto } from "../../dto/create-employee.dto";
import { Role } from "../../utils/role.enum";
import { Address } from "../../entity/address.entity";
import { UpdateEmployeeDto } from "../../dto/update-employee.dto";
import { CreateDepartmentDto } from "../../dto/create-department.dto";
import { jwtPayload } from "../../utils/jwtPayload.type";
import bcrypt from "bcrypt";
import jsobwebtoken, { JsonWebTokenError } from "jsonwebtoken";
import { json } from "express";

describe("Employee Service Tests", () => {
  let employeeService: EmployeeService;
  let employeeRepository: EmployeeRepository;
  let departmentService: DepartmentService;
  let departmentRepository: DepartmentRepository;
  beforeAll(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
    } as unknown as DataSource;
    employeeRepository = new EmployeeRepository(
      dataSource.getRepository(Employee)
    );
    departmentRepository = new DepartmentRepository(
      dataSource.getRepository(Department)
    );
    departmentService = new DepartmentService(departmentRepository);
    employeeService = new EmployeeService(
      employeeRepository,
      departmentService
    );
  });

  describe("Test for getEmployeeById", () => {
    test("Test for invalid employee ID", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith(1).mockResolvedValue(null); //ResolvedValue is used with async functions
      employeeRepository.findEmployeeById = mockFunction;
      expect(async () => {
        await employeeService.getEmployeeById(1);
      }).rejects.toThrowError();
    });
    test("Should return value when employee with proper ID", async () => {
      const mockFunction = jest.fn();
      when(mockFunction)
        .calledWith(1)
        .mockResolvedValue({
          id: 2,
          createdAt: "2023-08-07T00:33:07.009Z",
          updatedAt: "2023-08-07T00:35:53.791Z",
          deletedAt: null,
          name: "testing1",
          email: "testing1@gmail.com",
          password:
            "$2b$09$QjDCgWRvxfmHr1ZyPRFcuO07Y6P4fZXFtShRyeHQZEBi9vudkcDGa",
          role: "UI",
          address: {
            id: 2,
            createdAt: "2023-08-07T00:33:07.009Z",
            updatedAt: "2023-08-07T00:35:53.791Z",
            deletedAt: null,
            line1: "Test, Kakkanad",
            pincode: "123456",
          },
          department: {
            id: 2,
            createdAt: "2023-08-07T00:32:49.179Z",
            updatedAt: "2023-08-07T00:32:49.179Z",
            deletedAt: null,
            name: "Dep2",
          },
        }); //SERIKKUM FULL OBJECT ITHINTE ULLIL KODUKKANAM
      employeeRepository.findEmployeeById = mockFunction;
      const employee = await employeeService.getEmployeeById(1);
      expect(employee).toStrictEqual({
        id: 2,
        createdAt: "2023-08-07T00:33:07.009Z",
        updatedAt: "2023-08-07T00:35:53.791Z",
        deletedAt: null,
        name: "testing1",
        email: "testing1@gmail.com",
        password:
          "$2b$09$QjDCgWRvxfmHr1ZyPRFcuO07Y6P4fZXFtShRyeHQZEBi9vudkcDGa",
        role: "UI",
        address: {
          id: 2,
          createdAt: "2023-08-07T00:33:07.009Z",
          updatedAt: "2023-08-07T00:35:53.791Z",
          deletedAt: null,
          line1: "Test, Kakkanad",
          pincode: "123456",
        },
        department: {
          id: 2,
          createdAt: "2023-08-07T00:32:49.179Z",
          updatedAt: "2023-08-07T00:32:49.179Z",
          deletedAt: null,
          name: "Dep2",
        },
      });
    });
    /*
    test("Should return users successfully", async () => {
      const spy = jest.spyOn(employeeRepository, "findAllEmployees");
      spy.mockResolvedValue([]);
      const users = await employeeService.fetchAllEmployees("");
      expect(spy).toBeCalledTimes(1);
      expect(users).toEqual([]);
    });
    */
  });

  describe("Test for fetchAllEmployees", () => {
    test("Test for returning all users successfully if exists and no filter applied", async () => {
      const mockFunction = jest.fn();
      when(mockFunction)
        .calledWith("%")
        .mockResolvedValue({
          id: 1,
          name: "employee1",
          email: "employee1@gmail.com",
          address: {
            line1: "Info Park, Kakkanad",
            pincode: "686666",
          },
          role: "Admin",
          department: {
            name: "dept1",
          },
        });
      employeeRepository.findAllEmployees = mockFunction;
      expect(await employeeService.fetchAllEmployees("")).toStrictEqual({
        id: 1,
        name: "employee1",
        email: "employee1@gmail.com",
        address: {
          line1: "Info Park, Kakkanad",
          pincode: "686666",
        },
        role: "Admin",
        department: {
          name: "dept1",
        },
      });
    });
    test("Test for returning all users successfully if exists and name filter applied", async () => {
      const mockFunction = jest.fn();
      when(mockFunction)
        .calledWith("%A%")
        .mockResolvedValue({
          id: 1,
          name: "employee1",
          email: "employee1@gmail.com",
          address: {
            line1: "Info Park, Kakkanad",
            pincode: "686666",
          },
          role: "Admin",
          department: {
            name: "dept1",
          },
        });
      employeeRepository.findAllEmployees = mockFunction;
      expect(await employeeService.fetchAllEmployees("A")).toStrictEqual({
        id: 1,
        name: "employee1",
        email: "employee1@gmail.com",
        address: {
          line1: "Info Park, Kakkanad",
          pincode: "686666",
        },
        role: "Admin",
        department: {
          name: "dept1",
        },
      });
    });
    test("Test for case when no employees exist", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith("%").mockResolvedValue(null);
      employeeRepository.findAllEmployees = mockFunction;
      expect(async () => {
        await employeeService.fetchAllEmployees("");
      }).rejects.toThrowError();
    });
  });

  describe("Test for createEmployee", () => {
    const departmentDto: CreateDepartmentDto = {
      name: "dept1",
    };
    const addressDto: CreateAddressDto = {
      line1: "Info Park, Kakkanad",
      pincode: "686666",
    };
    const employeeDto: CreateEmployeeDto = {
      name: "employee1",
      email: "employee1@gmail.com",
      address: addressDto,
      password: "employee123",
      role: Role.ADMIN,
      department: departmentDto,
    };
    const address = {
      line1: "Info Park, Kakkanad",
      pincode: "686666",
    };
    const department = {
      id: 1,
      name: "dept1",
    };
    const employee = {
      name: "employee1",
      email: "employee1@gmail.com",
      address: address,
      password: expect.anything(),
      role: Role.ADMIN,
      department: department,
    };
    test("Test with valid employee details", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      when(mockFunction1).calledWith("dept1").mockResolvedValue({
        id: 1,
        name: "dept1",
      });
      when(mockFunction2)
        .calledWith(employee)
        .mockResolvedValue({
          id: 1,
          name: "employee1",
          email: "employee1@gmail.com",
          address: {
            line1: "Info Park, Kakkanad",
            pincode: "686666",
          },
          role: "Admin",
          department: {
            name: "dept1",
          },
        });
      departmentService.getDepartmentByName = mockFunction1;
      employeeRepository.addNewEmployee = mockFunction2;
      expect(await employeeService.createEmployee(employeeDto)).toStrictEqual({
        id: 1,
        name: "employee1",
        email: "employee1@gmail.com",
        address: {
          line1: "Info Park, Kakkanad",
          pincode: "686666",
        },
        role: "Admin",
        department: {
          name: "dept1",
        },
      });
    });
  });

  describe("Test for updateEmployee", () => {
    const departmentDto: CreateDepartmentDto = {
      name: "dept1",
    };
    const addressDto: CreateAddressDto = {
      line1: "Info Park, Kakkanad",
      pincode: "686666",
    };
    const employeeDto: UpdateEmployeeDto = {
      id: 1,
      name: "employee1",
      email: "employee1@gmail.com",
      address: addressDto,
      password: "employee123",
      role: Role.ADMIN,
      department: departmentDto,
    };
    const address = {
      line1: "Info Park, Kakkanad",
      pincode: "686666",
    };
    const department = {
      id: 1,
      name: "dept1",
    };
    const employee = {
      id: 1,
      name: "employee1",
      email: "employee1@gmail.com",
      address: address,
      password: expect.anything(),
      role: Role.ADMIN,
      department: department,
    };
    test("Test with valid employee details", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      const mockFunction3 = jest.fn();
      when(mockFunction1)
        .calledWith(1)
        .mockResolvedValue({
          id: 1,
          name: "employee1",
          email: "employee1@gmail.com",
          address: {
            line1: "Info Park, Kakkanad",
            pincode: "686666",
          },
          role: "Admin",
          department: {
            name: "dept1",
          },
        });
      when(mockFunction2).calledWith("dept1").mockResolvedValue({
        id: 1,
        name: "dept1",
      });
      when(mockFunction3)
        .calledWith(employee)
        .mockResolvedValue({
          id: 1,
          name: "employee1",
          email: "employee1@gmail.com",
          address: {
            line1: "Info Park, Kakkanad",
            pincode: "686666",
          },
          role: "Admin",
          department: {
            name: "dept1",
          },
        });
      employeeService.getEmployeeById = mockFunction1;
      departmentService.getDepartmentByName = mockFunction2;
      employeeRepository.modifyEmployeeById = mockFunction3;
      expect(await employeeService.updateEmployee(employeeDto)).toStrictEqual({
        id: 1,
        name: "employee1",
        email: "employee1@gmail.com",
        address: {
          line1: "Info Park, Kakkanad",
          pincode: "686666",
        },
        role: "Admin",
        department: {
          name: "dept1",
        },
      });
    });
    test("Test for invalid employee ID", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      const mockFunction3 = jest.fn();
      when(mockFunction1).calledWith(1).mockResolvedValue(null);
      when(mockFunction2).calledWith("dept1").mockResolvedValue({
        id: 1,
        name: "dept1",
      });
      when(mockFunction3)
        .calledWith(employee)
        .mockResolvedValue({
          id: 1,
          name: "employee1",
          email: "employee1@gmail.com",
          address: {
            line1: "Info Park, Kakkanad",
            pincode: "686666",
          },
          role: "Admin",
          department: {
            name: "dept1",
          },
        });
      employeeService.getEmployeeById = mockFunction1;
      departmentService.getDepartmentByName = mockFunction2;
      employeeRepository.modifyEmployeeById = mockFunction3;
      expect(async () => {
        await employeeService.updateEmployee(employeeDto);
      }).rejects.toThrowError();
    });
  });

  describe("Test for getEmployeeById", () => {
    test("Test for invalid employee email", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith("test@gmail.com").mockResolvedValue(null); //ResolvedValue is used with async functions
      employeeRepository.findByEmail = mockFunction;
      expect(async () => {
        await employeeService.getEmployeeByEmail("test@gmail.com");
      }).rejects.toThrowError();
    });
    test("Test for return value when fetching employee with valid email", async () => {
      const mockFunction = jest.fn();
      when(mockFunction)
        .calledWith("testing1@gmail.com")
        .mockResolvedValue({
          id: 2,
          createdAt: "2023-08-07T00:33:07.009Z",
          updatedAt: "2023-08-07T00:35:53.791Z",
          deletedAt: null,
          name: "testing1",
          email: "testing1@gmail.com",
          password:
            "$2b$09$QjDCgWRvxfmHr1ZyPRFcuO07Y6P4fZXFtShRyeHQZEBi9vudkcDGa",
          role: "UI",
          address: {
            id: 2,
            createdAt: "2023-08-07T00:33:07.009Z",
            updatedAt: "2023-08-07T00:35:53.791Z",
            deletedAt: null,
            line1: "Test, Kakkanad",
            pincode: "123456",
          },
          department: {
            id: 2,
            createdAt: "2023-08-07T00:32:49.179Z",
            updatedAt: "2023-08-07T00:32:49.179Z",
            deletedAt: null,
            name: "Dep2",
          },
        });
      employeeRepository.findByEmail = mockFunction;
      const employee = await employeeService.getEmployeeByEmail(
        "testing1@gmail.com"
      );
      expect(employee).toStrictEqual({
        id: 2,
        createdAt: "2023-08-07T00:33:07.009Z",
        updatedAt: "2023-08-07T00:35:53.791Z",
        deletedAt: null,
        name: "testing1",
        email: "testing1@gmail.com",
        password:
          "$2b$09$QjDCgWRvxfmHr1ZyPRFcuO07Y6P4fZXFtShRyeHQZEBi9vudkcDGa",
        role: "UI",
        address: {
          id: 2,
          createdAt: "2023-08-07T00:33:07.009Z",
          updatedAt: "2023-08-07T00:35:53.791Z",
          deletedAt: null,
          line1: "Test, Kakkanad",
          pincode: "123456",
        },
        department: {
          id: 2,
          createdAt: "2023-08-07T00:32:49.179Z",
          updatedAt: "2023-08-07T00:32:49.179Z",
          deletedAt: null,
          name: "Dep2",
        },
      });
    });
  });

  describe("Test for deleteEmployee", () => {
    test("Test for invalid employee ID", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      when(mockFunction1)
        .calledWith(1)
        .mockRejectedValueOnce(EntityNotFoundError);
      employeeService.getEmployeeById = mockFunction1;
      employeeRepository.deleteEmployeeById = mockFunction2;
      expect(async () => {
        await employeeService.getEmployeeById(1);
      }).rejects.toThrowError();
    });
    test("Test for success when deleting employee with valid ID", async () => {
      const mockFunction1 = jest.fn();
      const mockFunction2 = jest.fn();
      when(mockFunction1)
        .calledWith(1)
        .mockResolvedValue({
          id: 1,
          createdAt: "2023-08-07T00:33:07.009Z",
          updatedAt: "2023-08-07T00:35:53.791Z",
          deletedAt: null,
          name: "testing1",
          email: "testing1@gmail.com",
          password:
            "$2b$09$QjDCgWRvxfmHr1ZyPRFcuO07Y6P4fZXFtShRyeHQZEBi9vudkcDGa",
          role: "UI",
          address: {
            id: 2,
            createdAt: "2023-08-07T00:33:07.009Z",
            updatedAt: "2023-08-07T00:35:53.791Z",
            deletedAt: null,
            line1: "Test, Kakkanad",
            pincode: "123456",
          },
          department: {
            id: 2,
            createdAt: "2023-08-07T00:32:49.179Z",
            updatedAt: "2023-08-07T00:32:49.179Z",
            deletedAt: null,
            name: "Dep2",
          },
        });
      employeeService.getEmployeeById = mockFunction1;
      employeeRepository.deleteEmployeeById = mockFunction2;
      const employee = await employeeService.deleteEmployee(1);
      expect(employeeRepository.deleteEmployeeById).toBeCalledWith({
        id: 1,
        createdAt: "2023-08-07T00:33:07.009Z",
        updatedAt: "2023-08-07T00:35:53.791Z",
        deletedAt: null,
        name: "testing1",
        email: "testing1@gmail.com",
        password:
          "$2b$09$QjDCgWRvxfmHr1ZyPRFcuO07Y6P4fZXFtShRyeHQZEBi9vudkcDGa",
        role: "UI",
        address: {
          id: 2,
          createdAt: "2023-08-07T00:33:07.009Z",
          updatedAt: "2023-08-07T00:35:53.791Z",
          deletedAt: null,
          line1: "Test, Kakkanad",
          pincode: "123456",
        },
        department: {
          id: 2,
          createdAt: "2023-08-07T00:32:49.179Z",
          updatedAt: "2023-08-07T00:32:49.179Z",
          deletedAt: null,
          name: "Dep2",
        },
      });
    });
  });

  describe("Test for loginEmployee", () => {
    test("Test for invalid email or password", async () => {
      const address: CreateAddressDto = {
        line1: "ABCD",
        pincode: "686666",
      };
      const department: CreateDepartmentDto = {
        name: "dep1",
      };
      const employee: CreateEmployeeDto = {
        name: "A",
        email: "A@gmail.com",
        password: "a123",
        address: address,
        role: Role.ADMIN,
        department: department,
      };
      const mockedFunction = jest.fn();
      when(mockedFunction)
        .calledWith("A@gmail.com")
        .mockRejectedValue(EntityNotFoundError);
      employeeRepository.findByEmail = mockedFunction;
      expect(async () => {
        await employeeRepository.findByEmail("A@gmail.com");
      }).rejects.toThrowError();
    });
    test("Test for valid email or password", async () => {
      const address: CreateAddressDto = {
        line1: "ABCD",
        pincode: "686666",
      };
      const department: CreateDepartmentDto = {
        name: "dep1",
      };
      const employee: CreateEmployeeDto = {
        name: "A",
        email: "A@gmail.com",
        password:
          "$2a$09$Zq.2gt3ANoAUxFZVW3n4ZOMRbismMzoPtkdA28FdRsAfe6HzZe4Le",
        address: address,
        role: Role.ADMIN,
        department: department,
      };
      const mockedFunction = jest.fn();
      when(mockedFunction)
        .calledWith("A@gmail.com")
        .mockResolvedValueOnce(employee);
      employeeRepository.findByEmail = mockedFunction;
      const token = await employeeService.loginEmployee("A@gmail.com", "a123");
      expect(token);
    });
  });
});
