import ModelFactory from "../models/ModelFactory";

class TipsController {
    constructor() {
        ModelFactory.getModel("sqlite", "tip").then((model) => {
            this.model = model;
        });
    }

    async getAllTips(req, res) {
        try {
            const tips = await this.model.read();
            res.json({ tips });
        } catch (error) {
            console.error("Error fetching tips:", error);
            res.status(500).json({ error: "Failed to fetch tips." });
        }
    }

    async addTip(req, res) {
        try {
            if (!req.body || !req.body.tip) {
                return res.status(400).json({ error: "Tip is required." });
            }

            const newTip = await this.model.create(req.body.tip);
            res.status(201).json(newTip);
        } catch (error) {
            console.error("Error adding tip:", error);
            res.status(500).json({ error: "Failed to add tip. Please try again."});
        }
    }

    async clearTips(req, res) {
        try {
          await this.model.delete();
          res.json({ message: "All tips cleared." });
        } catch (error) {
          console.error("Error clearing tips:", error);
          res.status(500).json({ error: "Failed to clear tips." });
        }
      }
}

export default new TipsController();
