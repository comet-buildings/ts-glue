import { describe, expect, expectTypeOf, it } from "vitest";
import { ServiceLocator, is } from "./service-locator";

describe("Service Locator", () => {
  type Pricer = (a: string) => { price: number };

  const aDummyPricer: Pricer = () => ({ price: 42 });

  it("should be built from a definition object", () => {
    const locator = ServiceLocator.buildFrom({
      pricer: is<Pricer>,
    });
    locator.registerService("pricer", aDummyPricer);
  });

  it("should inject services in a lazy way", () => {
    const serviceLocator = ServiceLocator.buildFrom({
      blabla: is<() => string>,
    });
    serviceLocator.registerService("blabla", () => "pas top");

    const injected = serviceLocator.inject(
      (fun: () => string) => fun,
      ["blabla"]
    );
    serviceLocator.registerService("blabla", () => "top");

    expect(injected()).toBe("top");
  });

  it("could inject not registered implementation", () => {
    const serviceLocator = ServiceLocator.buildFrom({});
    const blabla = () => "top";
    const injected = serviceLocator.inject(
      (fun: () => string) => fun,
      [blabla]
    );

    expect(injected()).toBe("top");
  });

  it("should build services in a lazy way", () => {
    const serviceLocator = ServiceLocator.buildFrom({
      blabla: is<() => string>,
    });
    serviceLocator.registerService("blabla", () => "pas top");

    const injected = serviceLocator.build(
      (fun: () => string) => ({
        fun,
      }),
      ["blabla"]
    );
    serviceLocator.registerService("blabla", () => "top");

    expect(injected.fun()).toBe("top");
  });
});

describe("Type safety", () => {
  it("should chain registers", () => {
    const serviceLocator = ServiceLocator.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
    });

    serviceLocator
      .registerService("blabla", () => "pas top")
      .registerService("bullshit", () => 42);

    expectTypeOf(serviceLocator).toMatchTypeOf<
      ServiceLocator<
        {
          blabla: () => string;
          bullshit: () => number;
        },
        never
      >
    >();
  });

  it("should expect typescript error when checking registration", () => {
    const serviceLocator = ServiceLocator.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
      bullshit2: is<() => number>,
    }).registerService("bullshit", () => 42);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const runtimeCheck = () => serviceLocator.checkAllServicesAreRegistered();
    expect(runtimeCheck).toThrow();
  });
});

describe("Composite Service Locator", () => {
  it("should provide services from both children", () => {
    // given
    const firstServiceLocator = ServiceLocator.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
    });

    const secondServiceLocator = ServiceLocator.buildFrom({
      echo: is<(param: string) => string>,
    });
    secondServiceLocator.registerService("echo", (coucou) => coucou);
    const compositeLocator = ServiceLocator.compose(
      firstServiceLocator,
      secondServiceLocator
    );

    // when
    const echo = compositeLocator.getService("echo");

    // then
    expect(echo("baba")).toBe("baba");
  });

  it("should register services in child service locator", () => {
    // given
    const firstServiceLocator = ServiceLocator.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
    });

    const secondServiceLocator = ServiceLocator.buildFrom({
      echo: is<(param: string) => string>,
    });
    const compositeLocator = ServiceLocator.compose(
      firstServiceLocator,
      secondServiceLocator
    );

    // when
    compositeLocator.registerService("echo", (coucou) => coucou);
    const echo = compositeLocator.getService("echo");

    // then
    expect(echo("baba")).toBe("baba");
  });

  it("should provide services from all embedded locators", () => {
    // given
    const firstServiceLocator = ServiceLocator.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
    });

    const secondServiceLocator = ServiceLocator.buildFrom({
      echo: is<(param: string) => string>,
    }).registerService("echo", (coucou) => coucou);

    const thirdServiceLocator = ServiceLocator.buildFrom({
      random: is<() => number>,
    }).registerService("random", () => 123);

    const compositeLocator = ServiceLocator.compose(
      ServiceLocator.compose(firstServiceLocator, secondServiceLocator),
      thirdServiceLocator
    );

    // when
    const echo = compositeLocator.getService("echo");

    // then
    expect(echo("baba")).toBe("baba");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => compositeLocator.checkAllServicesAreRegistered()).toThrow();
  });
});
