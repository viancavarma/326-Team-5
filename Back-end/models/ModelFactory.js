import SQLiteTipsModel from "./SQLiteTipsModel";

class _ModelFactory {
    async getModel(model = "sqlite") {
      if (model === "sqlite") {
        return SQLiteTipsModel;
      } else if (model === "sqlite-fresh") {
        await SQLiteTipsModel.init(true);
        return SQLiteTipsModel;
      }
    }
  }

  const ModelFactory = new _ModelFactory();
  export default ModelFactory;