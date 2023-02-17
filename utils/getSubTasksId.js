const findPost = (schema, id) => {
  if (id === null) return;

  return schema.find(
    { "parentId": id },
  ).populate('user').exec();
}

export const getSubTasksId = (arr, id) => {
  let result = [id];
  arr.forEach((item) => {
    if (item.parentId === id) {
      result = result.concat(getSubTasksId(arr, item.id));
    }
  });
  return result;
};