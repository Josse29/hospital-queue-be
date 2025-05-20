import mongoose from "mongoose";
const ScreenSchema = mongoose.Schema(
  {
    ScreenName: { type: String },
    ScreenPoli: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poli",
      },
    ],
    ScreenInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Screen = mongoose.model("Screen", ScreenSchema);
export default Screen;
