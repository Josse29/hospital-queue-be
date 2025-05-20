import mongoose from "mongoose";
const HospitalSchema = mongoose.Schema(
  {
    HospitalName: { type: String },
    HospitalAddress: { type: String },
    HospitalPhone: { type: String },
    HospitalEmail: { type: String },
    HospitalLogo: { type: String },
    HospitalInfo: { type: String },
    HospitalMarquee: { type: String },
    HospitalId: { type: String },
    HospitalLogin: { type: Boolean },
    HospitalPassword: { type: String },
  },
  {
    timestamps: true,
  }
);
const Hospital = mongoose.model("Hospital", HospitalSchema);
export default Hospital;
