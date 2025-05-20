import mongoose from "mongoose";
const PoliSchema = mongoose.Schema(
  {
    PoliName: { type: String },
    PoliCode: { type: String },
    PoliColor: { type: String, default: "0 0 0" },
    PoliQueue: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);
const Poli = mongoose.model("Poli", PoliSchema);
export default Poli;
