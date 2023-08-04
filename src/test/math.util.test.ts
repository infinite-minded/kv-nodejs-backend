import { when } from "jest-when";
import { MathUtil } from "../utils/math.util";

//TO GROUP TEST CASES, USE DESCRIBE
//test - 2 args - description and function containg expect
describe("Test average function", () => {
  describe("Test average success cases", () => {
    test("Test average 4 + 4", () => {
      MathUtil.sum = jest.fn().mockReturnValueOnce(8);
      expect(MathUtil.average(4, 4)).toBe(4);
    });

    test("Test average 4 + 4", () => {
      const mockedFunction = jest.fn();
      MathUtil.sum = mockedFunction;
      when(mockedFunction).calledWith(4, 4).mockReturnValueOnce(8);
      expect(MathUtil.average(4, 4)).toBe(4);
    });
  });

  describe("Test average failure cases", () => {
    test("Test average 4 + 4", () => {
      expect(MathUtil.average(4, 4)).not.toBe(3);
    });
  });
});
