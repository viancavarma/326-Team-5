import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the Wishlist model
const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// CRUD operations
class SQLiteWishlistModel {
  async init(fresh = false) {
    await sequelize.authenticate();
    await sequelize.sync({ force: fresh });
  }   
  
  async create(wishlistData) {
    return await Wishlist.create(wishlistData);
  }

  async readAll(filters = {}) {
    const whereClause = {};
    if (filters.title) {
      whereClause.title = { [Sequelize.Op.like]: `%${filters.title}%` };
    }
    if (filters.content) {
      whereClause.content = { [Sequelize.Op.like]: `%${filters.content}%` };
    }
    return await Wishlist.findAll({ where: whereClause });
  }

  async readById(id) {
    return await Wishlist.findByPk(id);
  }

  async update(id, updatedData) {
    const wishlist = await Wishlist.findByPk(id);
    if (wishlist) {
      return await wishlist.update(updatedData);
    }
    return null;
  }

  async delete(id) {
    const wishlist = await Wishlist.findByPk(id);
    if (wishlist) {
      return await wishlist.destroy();
    }
    return null;
  }
}

const wishlistModel = new SQLiteWishlistModel();
export default wishlistModel;