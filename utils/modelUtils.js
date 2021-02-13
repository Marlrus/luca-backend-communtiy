// Imperatively updates model will throw if updates are not compatible
const updateModel = (model, updates) => {
  const modelKeys = Object.keys(model._doc);
  for (const prop in updates) {
    if (!modelKeys.includes(prop)) throw new Error("Prop not in model");
    model[prop] = updates[prop];
  }
  return model;
};

module.exports = {
  updateModel,
};
