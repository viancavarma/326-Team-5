import { Sequelize, DataTypes } from "sequelize";
import sequelize from '../config/database.js';

// comment sequelize model tips 54: 

// define tip model
const Tip = sequelize.define("SavingsGoal", {
    tip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})

// make tips class
class _SQLiteTipsModel {
    constructor() {}

    async init(fresh = false) {
        await sequelize.authenticate();
        await sequelize.sync({ force: fresh });

        // initialize default tips
        if (fresh) {
            await this.delete();

            await this.create({tip: "50-30-20 Rule: 50% of paycheck -> regular expenses; 30% -> personal expenses; 20% -> savings"})
            await this.create({tip: "Go shopping with a list to prevent overspending"})
            await this.create({tip: "Don't succumb to the instant gratification of spending (think it over)"})
            await this.create({tip: "Track all of your spending in our app"})
            await this.create({tip: "Buy necessities in bulk"})
            await this.create({tip: "Take advantage of coupons and discounts"})
            await this.create({tip: "Review your subscriptions"})
        }
    }

    async create(tip){
        return await Tip.create({ tip });
    }

    async read() {
        return await Tip.findAll();
    }

    async delete(tip = null) {
        if (tip === null) {
            await Tip.destroy({ truncate: true });
            return;
        }

        await Tip.destroy({ where: { tip } });
        return tip;
    }
}

const SQLiteTipsModel = new _SQLiteTipsModel();

export default SQLiteTipsModel;