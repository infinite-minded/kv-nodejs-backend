import { DataSource } from "typeorm";
import EmployeeRepository from "../../repository/employee.repository";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";

describe("Employee Service Tests", () => {
  let employeeService: EmployeeService;
  let employeeRepository: EmployeeRepository;
  beforeAll(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
    } as unknown as DataSource; //TRICK TO CONVERT SOMETHING TO SOME OTHER TYPE
    employeeRepository = new EmployeeRepository(
      dataSource.getRepository(Employee)
    );
    employeeService = new EmployeeService(employeeRepository);
  });

  describe("Test for getEmployeeById", () => {
    test("Test for invalid employee ID", async () => {
      const mockFunction = jest.fn();
      when(mockFunction).calledWith(1).mockResolvedValue(null); //ResolvedValue is used with async functions
      employeeRepository.findEmployeeById = mockFunction;
      //const employee = await employeeService.getEmployeeById(1); - this itself will throw error, so put it inside expect for proper testing
      expect(async () => {
        await employeeService.getEmployeeById(1);
      }).rejects.toThrowError();
    });
    test("Should return value when employee with proper ID", async () => {
      const mockFunction = jest.fn();
      when(mockFunction)
        .calledWith(1)
        .mockResolvedValue({ id: 123, name: "Employee name" }); //SERIKKUM FULL OBJECT ITHINTE ULLIL KODUKKANAM
      employeeRepository.findEmployeeById = mockFunction;
      const employee = await employeeService.getEmployeeById(1); //service layer il getEmployeeById de business logic il mistakes undengil
      //expect will return a different value when compared to expected value
      //and thus test case will fail
      expect(employee).toStrictEqual({ id: 123, name: "Employee name" });
    });
    test("Should return users successfully", async () => {
      const spy = jest.spyOn(employeeRepository, "findAllEmployees"); //mock the employeeRepository.find method
      spy.mockResolvedValue([]);
      const users = await employeeService.fetchAllEmployees("");
      expect(spy).toBeCalledTimes(1);
      expect(users).toEqual([]);
    });
  });
});
