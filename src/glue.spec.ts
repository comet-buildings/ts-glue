import { describe, expect, expectTypeOf, it } from "vitest";
import { Glue, is } from "./glue";

describe("Glue", () => {
  type Pricer = (a: string) => { price: number };

  const aDummyPricer: Pricer = () => ({ price: 42 });

  it("should be built from a definition object", () => {
    const locator = Glue.buildFrom({
      pricer: is<Pricer>,
    });
    locator.registerService("pricer", aDummyPricer);
  });

  it("should inject services in a lazy way", () => {
    const serviceLocator = Glue.buildFrom({
      blabla: is<() => string>,
    });
    serviceLocator.registerService("blabla", () => "pas top");

    const injected = serviceLocator.inject(
      (fun: () => string) => fun,
      ["blabla"],
    );
    serviceLocator.registerService("blabla", () => "top");

    expect(injected()).toBe("top");
  });

  it("could inject not registered implementation", () => {
    const serviceLocator = Glue.buildFrom({});
    const blabla = () => "top";
    const injected = serviceLocator.inject(
      (fun: () => string) => fun,
      [blabla],
    );

    expect(injected()).toBe("top");
  });

  it("should build services in a lazy way", () => {
    const serviceLocator = Glue.buildFrom({
      blabla: is<() => string>,
    });
    serviceLocator.registerService("blabla", () => "pas top");

    const injected = serviceLocator.build(
      (fun: () => string) => ({
        fun,
      }),
      ["blabla"],
    );
    serviceLocator.registerService("blabla", () => "top");

    expect(injected.fun()).toBe("top");
  });
});

describe("Type safety", () => {
  it("should chain registers", () => {
    const serviceLocator = Glue.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
    });

    serviceLocator
      .registerService("blabla", () => "pas top")
      .registerService("bullshit", () => 42);

    expectTypeOf(serviceLocator).toMatchTypeOf<
      Glue<
        {
          blabla: () => string;
          bullshit: () => number;
        },
        never
      >
    >();
  });

  it("should expect typescript error when checking registration", () => {
    const serviceLocator = Glue.buildFrom({
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

describe("Composite Glue", () => {
  it("should provide services from both children", () => {
    // given
    const firstServiceLocator = Glue.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
    });

    const secondServiceLocator = Glue.buildFrom({
      echo: is<(param: string) => string>,
    });
    secondServiceLocator.registerService("echo", (coucou) => coucou);
    const compositeLocator = Glue.compose(
      firstServiceLocator,
      secondServiceLocator,
    );

    // when
    const echo = compositeLocator.getService("echo");

    // then
    expect(echo("baba")).toBe("baba");
  });

  it("should register services in child glue", () => {
    // given
    const firstServiceLocator = Glue.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
    });

    const secondServiceLocator = Glue.buildFrom({
      echo: is<(param: string) => string>,
    });
    const compositeLocator = Glue.compose(
      firstServiceLocator,
      secondServiceLocator,
    );

    // when
    compositeLocator.registerService("echo", (coucou) => coucou);
    const echo = compositeLocator.getService("echo");

    // then
    expect(echo("baba")).toBe("baba");
  });

  it("should provide services from all embedded locators", () => {
    // given
    const firstServiceLocator = Glue.buildFrom({
      blabla: is<() => string>,
      bullshit: is<() => number>,
    });

    const secondServiceLocator = Glue.buildFrom({
      echo: is<(param: string) => string>,
    }).registerService("echo", (coucou) => coucou);

    const thirdServiceLocator = Glue.buildFrom({
      random: is<() => number>,
    }).registerService("random", () => 123);

    const compositeLocator = Glue.compose(
      Glue.compose(firstServiceLocator, secondServiceLocator),
      thirdServiceLocator,
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
