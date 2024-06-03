<div align="center">
  <img alt="ts-glue amazing logo" src="https://github.com/comet-buildings/ts-glue/assets/3911114/95830240-eeb1-4c53-b4ab-1a1d9f46b9b3" width="50%" />
</div>

# ts-glue

TypeScript opiniated dependency injection library.  
Why another dependency injection library?  
Most dependency injection libraries target object oriented codebases.  
Glue is a tiny lightweight library made for FP codebases making extensive use of partial application for dependency injection.  
Main benefits of Glue include:  
- **TypeScript type level** configuration checks: Glue allows to check at buidtime that all dependencies have been registered.
- **Lazyness**: A function or a component managed by Glue can be used anywhere in your codebase without worrying when and how dependencies will be set up at runtime.  
- **Modularity**: Glue is monorepo friendly, configuration can be splitted into several modules without losing buildtime checking nor lazyness.  


If you are in a hurry you can start playing with `ts-glue` right away with this [demo sandbox](https://playcode.io/1886380)  


## Getting started
`ts-glue` is a TypeScript library that can be installed with any package manager such as npm or yarn:  

```sh
  # with npm
  npm i ts-glue
  # or yarn
  yarn add ts-glue

```

## Usage
In order to use `ts-glue`, you need to do 3 things:
- Build a `Glue` object that will hold a descriptions of all the components and functions that might need to be injected
- Register implementations 
- Use the glue to inject the implementations previously registered

So let's begin by building a "Glue" object and a description of all the functions and components that it will handle.  
Let's say we have a clock function we want to inject in our codebase:  
```typescript
type Clock = () => Date;

const systemClock: Clock = () => new Date();
```

Our *Glue* could be set up as shown below:  
```typescript
import { Glue, is } from "ts-glue";

const glue = 
  Glue.buildFrom(
    {
      clock: is<Clock>,
    }
  ).registerService('clock', systemClock);
```

Our glue is now ready for use!  

It can be used like a regular glue:
```typescript
const clock: Clock = glue.getService('clock');
```

But the `ts-glue` sweet spot comes with functions that can be partially applied as shown below:  
```typescript
const doHelloWorld = (clock: Clock) => (name: string) => `Hello world ${name} (${clock()})`;

const helloWorld = glue.inject(doHelloWorld, ['clock']);

helloWorld('Glue');
```

Our *helloWorld()* is now ready for use. If we want to inject dependencies into an object instead of a function, we need to use *Glue.build()* instead of *Glue.inject()*:
```typescript
const buildHelloWorld = (clock: Clock) => ({ 
  sayHello: (name: string) => `Hello world ${name} (${clock()})`;
}):

const helloWorld = glue.build(buildHelloWorld, ['clock']);

helloWorld.sayHello('Glue');
```

## TypeScript type level checks
Glue functions such as *registerService()* or *inject()*. This means that if you do a typo, TypeScript will yell at you!

```typescript
import { Glue, is } from "ts-glue";

const glue = 
  Glue.buildFrom(
    {
      clock: is<Clock>,
    }
  )
const doHelloWorld = (clock: Clock) => (name: string) => `Hello world ${name} (${clock()})`;


glue.registerService('cloq', systemClock); // Compilation error 
glue.registerService('clock', () => 'string')); // Compilation error

glue.inject(doHelloWorld, ['cloq']); // compilation error
glue.inject(doHelloWorld, []); // compilation error
```

You can also ask `ts-glue` to check that your configuration is complete:
```typescript
import { Glue, is } from "ts-glue";

const glue = 
  Glue.buildFrom(
    {
      clock: is<Clock>,
      dbConfiguration: is<DbConfiguration>
    }
  ).registerService('clock', systemClock);

// compilation error, dbConfiguration is missing
glue.checkAllServicesAreRegistered();

const glue2 = glue.registerService('clock', someDbConfiguration);
// compilation OK
glue2.checkAllServicesAreRegistered();

```


TODO playground

## Lazyness
ts-glue is very lazy :-)  
Function dependencies are resolved at the very last moment, which is when they get executed. This means that you do 
not have to worry too much ot the sequence order of injections and registrations:

```typescript
import { Glue, is } from "ts-glue";

type Random = () => number;
const doGiveMeANumber = (random: Random) => `A random number ${random()}`

const glue = 
  Glue.buildFrom(
    {
      randomGenerator: is<Random>,
    }
  ).registerService('randomGenerator', Math.random);

const giveMeANumber = glue.inject(doGiveMeANumber, ['randomGenerator']);

glue.registerService('randomGenerator', () => 42);
giveMeANumber(); // A random number 42

```

In the example above, we first build a glue, we register a first random number generator and we retrieve an injected version of the
*giveMeANumber()* function. Then we override the registered random number generator. Since dependency injection is lazy, since dependencies are resolved each time an injected function get executed, *giveMeANumber()* calls the very last registered random generator.  
   
ts-glue lazyness is very handy when one part of your codebase is managed by `ts-glue` but not everything.
We have included in the example folder an [Express](TODO) express example app that demonstrate how to use components managed by `ts-glue` from Express routes that are out of the scoe of `ts-glue`.

## Modularity
Any significant codebase is splitted into several modules, packages... well it should be ;)  
A big monolythic dependency injection configuration file quickly becomes hard to maintain. Hence `ts-glue` allows you to split your configuration in several files, composing your *Glue* from several sub *Glue* instances:


```typescript

// Let's say we have a booking package in our codebase
// booking.ts
export const bookingGlue = 
  Glue.buildFrom(
    {
      bookingService: is<BookingService>,
      dbConfiguration: is<DbConfiguration>,
      ...
    }
  ).registerService(
    'bookingService', 
    someBookingServiceImplementation
  );

// Let's say we have also a billing package in our codebase
// billing.ts
export const billingGlue = 
  Glue.buildFrom(
    {
      billingService: is<BillingService>,
      dbConfiguration: is<DbConfiguration>,
      ...
    }
  ).registerService(
    'billingService', 
    someBillingServiceImplementation
  );

// Then at the entry point of our application
// we can gather our two previous glues
const appGlue = Glue.compose(
  bookingGlue,
  billingGlue
);

// appGlue can inject 'bookingService' and 'billingService'
const megaSagaService = 
  appGlue.inject(
    ..., 
    ['bookingService', 'billingService']
  )

// at that point line below fails to compile because
// dbConfiguration has not been registered
appGlue

// Now it's ok and the dbConfiguration is registered
// into both bookingGlue and billingGlue
appGlue
  .registerService('dbConfiguration', SomeDbConfig)
  .checkAllServicesAreRegistered();

```

## Under the cover
TBC
