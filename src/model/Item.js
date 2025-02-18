import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  image: String,
  subitems: [
    {
      name: String,
      estado: String,
      // Otros campos específicos de cada subitem
    },
  ],
})

export default mongoose.models.Item || mongoose.model("Item", ItemSchema)

