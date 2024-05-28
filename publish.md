# How to publish de npm 

## Set your npm user if not set
```sh
npm adduser
```

## Build package
```sh
npm run dist
```

## Update package version 
```sh
# For update beta
npm version prerelease --preid=beta

# For minor/patch/major
npm version [major | minor | patch] --preid=beta
```

## Push new version
```sh
git push
```

## Publish
```sh
# publish lastest
npm publish

# or publish beta
npm publish --tag beta
```