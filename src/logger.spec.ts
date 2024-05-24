import { describe, expect, it, vi } from "vitest";
import type { Logger } from "./logger";
import { ServiceLocator, is } from "./service-locator";

describe("logger", () => {
  it("should inject logger", () => {
    //Given
    const logger: Logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const serviceLocator = ServiceLocator.buildFrom(
      {
        service1: is<() => string>,
      },
      { logger }
    );

    //When
    expect(() =>
      (serviceLocator as any).checkAllServicesAreRegistered()
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
    const serviceLocator = ServiceLocator.compose(
      ServiceLocator.buildFrom(
        {
          service1: is<() => string>,
        },
        { logger }
      ),
      ServiceLocator.buildFrom({
        service2: is<() => string>,
      })
    );

    //When
    expect(() =>
      (serviceLocator as any).checkAllServicesAreRegistered()
    ).toThrow();

    //Then
    expect(logger.debug).toHaveBeenCalledWith("custom logger");
  });
});
