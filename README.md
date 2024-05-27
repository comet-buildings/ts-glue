# Glue

TypeScript opiniated dependency injection library. Why another dependency injection library?  
Most dependency injection libraries target object oriented codebases. Glue is a tiny lightweight library made for FP codebases making extensive use of partial application for dependency injection.  
Main benefits of Glue include:  
- TypeScript type level configuration checks: Glue allows to check at buidtime that all dependencies have been registered.
- Lazyness: A function or a component managed by Glue can be used anywhere in your codebase without worrying when and how dependencies will be set up at runtime.  
- Modularity: Glue is monorepo friendly, configuration can be splitted into several modules without losing buildtime checking nor lazyness.  

See below for more detailed explanations and examples.


# Getting started
Glue is a TypeScript library that can be installed with any package manager such as npm or yarn:  

```sh
  # with npm
  npm i glue
  # or yarn
  yarn add glue

```

# Usage
To begin using Glue, you need to build a "ServiceLocator" object and a description of all the functions and components that it will handle.  
Let's say we have a clock function we want to inject in our codebase:  
```
type Clock = () => Date;

const systemClock: Clock = () => new Date();
```

Our *ServiceLocato* could be set up as shown below:  
```
import { ServiceLocator, is } from "glue";

const serviceLocator = 
  ServiceLocator.buildFrom({
    clock: is<Clock>,
  });
```

Our service locator is now ready for use!  
Below an example with a function and partial application:
```
const doHelloWorld = (clock: Clock) => (name: string) => `Hello world ${name} (${clock()})`;

const helloWorld = serviceLocator.inject(doHelloWorld, ['clock']);

helloWorld('Glue');
```

Our *helloWorld()* is now ready for use. If we want to inject dependencies into an object instead of a function, we need to use *ServiceLocator.build()* instead of *ServiceLocator.inject()*:
```
const buildHelloWorld = (clock: Clock) => ({ 
  sayHello: (name: string) => `Hello world ${name} (${clock()})`;
}):

const helloWorld = serviceLocator.build(buildHelloWorld, ['clock']);

helloWorld.sayHello('Glue');
```

# TypeScript type level checks
TBC

# Lazyness
TBC

# Modularity
TBC

# Under the cover
TBC