import { describe, expect, it, vi } from "vitest";
import type { Logger } from "./options";
import { Glue, is } from "./glue";

describe("options", () => {
  describe("logger", () => {
    it("should inject logger", () => {
      //Given
      const logger: Logger = {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      };
      const serviceLocator = Glue.buildFrom(
        {
          service1: is<() => string>,
        },
        { logger },
      );

      //When
      expect(() =>
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (serviceLocator as any).checkAllServicesAreRegistered(),
      ).toThrow();

      //Then
      expect(logger.debug).toHaveBeenCalledWith("custom logger");
    });

    it("should use children logger", () => {
      //Given
      const logger: Logger = {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      };
      const serviceLocator = Glue.compose(
        Glue.buildFrom(
          {
            service1: is<() => string>,
          },
          { logger },
        ),
        Glue.buildFrom({
          service2: is<() => string>,
        }),
      );

      //When
      expect(() =>
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (serviceLocator as any).checkAllServicesAreRegistered(),
      ).toThrow();

      //Then
      expect(logger.debug).toHaveBeenCalledWith("custom logger");
    });
  });

  describe("onBeforeRegister", () => {
    it("should call onBeforeRegister hook", () => {
      //Given
      const onBeforeRegister = vi.fn();
      const serviceLocator = Glue.buildFrom(
        {
          service1: is<() => string>,
        },
        { onBeforeRegister },
      );
      const service = () => "output";

      //When
      serviceLocator.registerService("service1", service);

      //Then
      expect(onBeforeRegister).toHaveBeenCalledWith("service1", service);
    });
  });
});
