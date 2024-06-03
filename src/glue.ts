import { defaultLogger, type Options } from "./options";

type TypeInformation<T> = { __tag: "TypeInformation"; type: T };

export const is = <T>(): TypeInformation<T> => {
  throw new Error("should not be invoked");
};
export class Glue<
  ServiceDefinitions extends Record<string, unknown>,
  MissingServices = keyof ServiceDefinitions
> {
  private registeredServices: Partial<ServiceDefinitions> = {};
  protected options: Required<Options> = {
    logger: defaultLogger,
    onBeforeRegister: () => {},
  };
  serviceNames: Readonly<(keyof ServiceDefinitions)[]> = [];

  protected constructor(
    serviceNames: Readonly<(keyof ServiceDefinitions)[]>,
    options: Options
  ) {
    this.serviceNames = serviceNames;

    this.options = { ...this.options, ...options };
    if (options.logger) {
      this.options.logger.debug("custom logger");
    }
  }

  static buildFrom<T extends Record<string, () => TypeInformation<any>>>(
    definition: T,
    options: Options = {}
  ): Glue<{ [Key in keyof T]: ReturnType<T[Key]>["type"] }> {
    return new Glue<{ [Key in keyof T]: ReturnType<T[Key]> }>(
      Object.keys(definition),
      options
    );
  }

  static compose<
    R1 extends Record<string, unknown>,
    M1 extends keyof R1,
    R2 extends Record<string, unknown>,
    M2 extends keyof R2
  >(
    firstChildren: Glue<R1, M1>,
    secondChildren: Glue<R2, M2>
  ): Glue<R1 & R2, M1 | M2>;
  static compose<
    R1 extends Record<string, unknown>,
    M1 extends keyof R1,
    R2 extends Record<string, unknown>,
    M2 extends keyof R2,
    R3 extends Record<string, unknown>,
    M3 extends keyof R3
  >(
    firstChildren: Glue<R1, M1>,
    secondChildren: Glue<R2, M2>,
    thirdChildren: Glue<R3, M3>
  ): Glue<R1 & R2 & R3, M1 | M2 | M3>;
  static compose<
    R1 extends Record<string, unknown>,
    M1 extends keyof R1,
    R2 extends Record<string, unknown>,
    M2 extends keyof R2,
    R3 extends Record<string, unknown>,
    M3 extends keyof R3,
    R4 extends Record<string, unknown>,
    M4 extends keyof R4
  >(
    firstChildren: Glue<R1, M1>,
    secondChildren: Glue<R2, M2>,
    thirdChildren: Glue<R3, M3>,
    fourthChildren: Glue<R4, M4>
  ): Glue<R1 & R2 & R3 & R4, M1 | M2 | M3 | M4>;
  static compose<
    R1 extends Record<string, unknown>,
    M1 extends keyof R1,
    R2 extends Record<string, unknown>,
    M2 extends keyof R2,
    R3 extends Record<string, unknown>,
    M3 extends keyof R3,
    R4 extends Record<string, unknown>,
    M4 extends keyof R4,
    R5 extends Record<string, unknown>,
    M5 extends keyof R5
  >(
    firstChildren: Glue<R1, M1>,
    secondChildren: Glue<R2, M2>,
    thirdChildren: Glue<R3, M3>,
    fourthChildren: Glue<R4, M4>,
    fifthChildren: Glue<R5, M5>
  ): Glue<R1 & R2 & R3 & R4 & R5, M1 | M2 | M3 | M4 | M5>;
  static compose<
    R1 extends Record<string, unknown>,
    M1 extends keyof R1,
    R2 extends Record<string, unknown>,
    M2 extends keyof R2,
    R3 extends Record<string, unknown>,
    M3 extends keyof R3,
    R4 extends Record<string, unknown>,
    M4 extends keyof R4,
    R5 extends Record<string, unknown>,
    M5 extends keyof R5
  >(
    firstChildren: Glue<R1, M1>,
    secondChildren: Glue<R2, M2>,
    thirdChildren: Glue<R3, M3> = new Glue([], {}),
    fourthChildren: Glue<R4, M4> = new Glue([], {}),
    fifthChildren: Glue<R5, M5> = new Glue([], {})
  ): Glue<R1 & R2 & R3 & R4 & R5, M1 | M2 | M3 | M4 | M5> {
    return new CompositeGlue(
      new CompositeGlue(firstChildren, secondChildren),
      new CompositeGlue(
        thirdChildren,
        new CompositeGlue(fourthChildren, fifthChildren)
      )
    );
  }

  registerService = <T extends keyof ServiceDefinitions>(
    name: T,
    service: ServiceDefinitions[T]
  ): Glue<ServiceDefinitions, Exclude<MissingServices, T>> => {
    this.options.onBeforeRegister(String(name), service);

    this.registeredServices[name] = service;
    return this;
  };

  getService = <T extends keyof ServiceDefinitions>(
    name: T
  ): ServiceDefinitions[T] => {
    const service = this.registeredServices[name];
    if (!service) {
      throw new Error(
        `[Glue] Service ${name.toString()} is not registered`
      );
    }
    return service;
  };

  inject = <Factory extends (...args: any[]) => any>(
    factory: Factory,
    dependencyNamesOrImplem: Services<Factory, ServiceDefinitions>
  ) => {
    type Fun = ReturnType<Factory>;
    return (...params: Parameters<Fun>): ReturnType<Fun> => {
      try {
        const dependencies = (dependencyNamesOrImplem as any[]).map((dep) => {
          return typeof dep === "string" ? this.getService(dep) : dep;
        });
        const fun: Fun = factory(...dependencies);
        return fun(...params);
      } catch (err: any) {
        this.options.logger.error(
          {
            params,
            dependencyNamesOrImplem,
            registeredServices: this.registeredServices,
            factory,
          },
          "Glue error"
        );
        throw err;
      }
    };
  };

  build = <Factory extends (...args: any[]) => any>(
    factory: Factory,
    dependencyNames: Services<Factory, ServiceDefinitions>
  ): ReturnType<Factory> => {
    return new Proxy(
      {},
      {
        get: (_obj: any, prop: string) => {
          try {
            const dependencies = (dependencyNames as any[]).map((dep) => {
              return typeof dep === "string" ? this.getService(dep) : dep;
            });
            const injected = factory(...dependencies);
            return injected[prop];
          } catch (err: any) {
            this.options.logger.error(
              { prop, dependencyNames, factory },
              "Glue error (build)"
            );
            throw err;
          }
        },
      }
    );
  };

  checkAllServicesAreRegistered = (() => {
    const unregisteredServices = this.serviceNames.filter(
      (name) => this.registeredServices[name] === undefined
    );
    if (unregisteredServices.length > 0) {
      this.options.logger.error(
        { unregisteredServices },
        "[Glue] some services are not registered"
      );
      throw new Error("[Glue] some services are not registered");
    }
  }) as [MissingServices] extends [never]
    ? () => void
    : MissingRegisterError<MissingServices>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MissingRegisterError<i> = [never];

class CompositeGlue<
  R1 extends Record<string, unknown>,
  M1 extends keyof R1,
  R2 extends Record<string, unknown>,
  M2 extends keyof R2
> extends Glue<R1 & R2, M1 | M2> {
  constructor(
    private firstChild: Glue<R1, M1>,
    private secondChild: Glue<R2, M2>
  ) {
    super([...firstChild.serviceNames, ...secondChild.serviceNames], {});
  }

  override getService = <T>(name: T) => {
    const rawName: any = name;
    if (this.firstChild.serviceNames.includes(rawName)) {
      return this.firstChild.getService(rawName);
    }
    return this.secondChild.getService(rawName) as any;
  };

  override registerService = <T extends keyof R1 | keyof R2>(
    name: T,
    service: (R1 & R2)[T]
  ) => {
    const rawName: any = name;
    if (this.firstChild.serviceNames.includes(rawName)) {
      this.firstChild.registerService(rawName, service);
    }
    if (this.secondChild.serviceNames.includes(rawName)) {
      this.secondChild.registerService(rawName, service);
    }
    return this;
  };
}

export type Services<
  Factory extends (...args: any) => any,
  RegisteredServices
> = Implem<Parameters<Factory>, RegisteredServices>;

type Implem<FactoryParameters extends string[], RegisteredServices> = {
  [Index in keyof FactoryParameters]: NameForType<
    RegisteredServices,
    FactoryParameters[Index]
  > extends never
    ? FactoryParameters[Index]
    : NameForType<RegisteredServices, FactoryParameters[Index]>;
};

type FindImplem<RegisteredServices, ServiceType> = {
  [Key in keyof RegisteredServices]: RegisteredServices[Key] extends ServiceType
    ? Key
    : never;
};
type NameForType<RegisteredServices, ServiceType> = FindImplem<
  RegisteredServices,
  ServiceType
>[keyof FindImplem<RegisteredServices, ServiceType>];
