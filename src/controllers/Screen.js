import { Types } from "mongoose";
import Screen from "../models/Screen.js";
import { capitalizeWord, formatDateTime } from "../utils/index.js";

const createScreen = async (req, res) => {
  const { ScreenName, ScreenPoliSelected, ScreenInfo } = req.body;
  try {
    const ScreenNameVal = capitalizeWord(ScreenName);
    if (!ScreenNameVal || ScreenPoliSelected.length === 0) {
      return res
        .status(400)
        .json({ errMsg: "Upppps, All Input are Required !" });
    }
    // validated is already name layar
    const screenNameExisted = await Screen.findOne({
      ScreenName: ScreenNameVal,
    });
    if (screenNameExisted) {
      return res
        .status(409)
        .json({ errMsg: `${ScreenNameVal} - is already Existed !` });
    }
    // just in case
    // const existingScreens = await Screen.find({
    //   ScreenPoli: { $in: ScreenPoli },
    // });
    const newScreen = new Screen({
      ScreenName: ScreenNameVal,
      ScreenPoli: ScreenPoliSelected,
      ScreenInfo,
    });
    await newScreen.save();
    return res.status(200).json({ msg: `${ScreenNameVal} - Has Been Added` });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const readScreen = async (req, res) => {
  const { search } = req.query;
  try {
    const keyword = search
      ? { ScreenName: { $regex: search, $options: "i" } }
      : {};
    const screens = await Screen.find(keyword)
      .populate({
        path: "ScreenPoli",
        select: "PoliName",
        options: { sort: { PoliName: 1 } },
      })
      .sort({ ScreenName: 1 });
    return res.status(200).json(screens);
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
// for print queue
const readScreenId = async (req, res) => {
  const { id } = req.params;
  try {
    const screen = await Screen.findById(id).populate({
      path: "ScreenPoli",
      select: "PoliName PoliColor",
      options: { sort: { PoliName: 1 } },
    });
    if (!screen) {
      return res.status(404).json({ errMsg: `Screen - Not Found !` });
    }
    return res.status(200).json(screen);
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
// for main screen queue
const readScreenId1 = async (req, res) => {
  try {
    const { id } = req.params;
    const { FormatDate } = formatDateTime();
    const result = await Screen.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "polis",
          localField: "ScreenPoli",
          foreignField: "_id",
          as: "ScreenPoli",
        },
      },
      {
        $addFields: {
          ScreenPoli: {
            $map: {
              input: "$ScreenPoli",
              as: "poli",
              in: {
                $mergeObjects: [
                  "$$poli",
                  {
                    PoliQueue: {
                      $slice: [
                        {
                          $sortArray: {
                            input: {
                              $filter: {
                                input: "$$poli.PoliQueue",
                                as: "queue",
                                cond: {
                                  $and: [
                                    { $eq: ["$$queue.Date", FormatDate] },
                                    { $lt: ["$$queue.CallTimes", 3] },
                                  ],
                                },
                              },
                            },
                            sortBy: { Time: 1 },
                          },
                        },
                        1,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({ message: "Screen not found" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ errMsg: error });
  }
};
const updateScreen = async (req, res) => {
  const { id } = req.params;
  const { ScreenName, ScreenPoliSelected, ScreenInfo } = req.body;
  try {
    const ScreenNameVal = capitalizeWord(ScreenName);
    if (!ScreenNameVal || ScreenPoliSelected.length === 0) {
      return res
        .status(400)
        .json({ errMsg: "Upppps, All Input are Required !" });
    }
    const sreenNameExisted = await Screen.findOne({
      ScreenName: ScreenNameVal,
    });
    if (sreenNameExisted && sreenNameExisted._id.toString() !== id) {
      return res
        .status(409)
        .json({ errMsg: `${ScreenNameVal} is already Existed !` });
    }
    const updated = await Screen.findByIdAndUpdate(
      id,
      {
        $set: {
          ScreenName: ScreenNameVal,
          ScreenPoli: ScreenPoliSelected,
          ScreenInfo,
        },
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ errMsg: `Screen - Not Found !` });
    }
    return res.status(200).json({ msg: `${ScreenNameVal} has been Updated ` });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const deleteScreen = async (req, res) => {
  const { id } = req.params;
  try {
    const screen = await Screen.findByIdAndDelete(id);
    if (!screen) {
      return res.status(404).json({ errMsg: `Screen is not found !` });
    }
    return res
      .status(200)
      .json({ msg: `${screen.ScreenName} has been deleted !` });
  } catch (error) {
    return res.status(404).json({ errMsg: error.message });
  }
};
export {
  createScreen,
  readScreen,
  readScreenId,
  readScreenId1,
  updateScreen,
  deleteScreen,
};
