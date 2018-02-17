export const createGetUniqueId = () => {
  let id = 0;

  return () => {
    id = id + 1;

    return id.toString();
  };
};
