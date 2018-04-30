export const createGetUniqueId = () => {
  let id = 0;

  return () => {
    id += 1;

    return id.toString();
  };
};
