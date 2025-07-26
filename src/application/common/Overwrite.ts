type Overwrite<Base, Overrides> = Omit<Base, keyof Overrides> & Overrides;

export default Overwrite;
