# preact-sidebar

`preat-sidebar` is a small library to render sidebar menu with preact.

## Installing preact-sidebar

As of yet `preact-sidebar` ist *not* published with npm. Install the sources from github and follow the development build instructions below.
### building the development version

`preact-sidebar` is a TypeScript project and relies on rollup for building and bundling. Declaration files are generated with tsc. In order to install run the following commands in the cloned repo:
```{bash}
npm install
npm build
npm declarations
```

## How is it rolling?

`preact-sidebar` uses a declarative style to describe the menu you want to render. It does so by the `SideBar` component. MenuTemaples are passed into this component.


```{typescript}

const slider = new HSlider(
    "CutOff", {
        min: 20,
        max: 20000,
        formatter: (hz) => `${hz} Hz`
    },
    () => someObj.cutOffFreq,
    (arg) => {
        someObj.cutOffFreq = arg
    }
)

const Menu = () => (
    <SideBar items={[slider]} />
);
```


