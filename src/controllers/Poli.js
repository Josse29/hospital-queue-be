import { Types } from "mongoose";
import Poli from "../models/Poli.js";
import {
  capitalizeWord,
  formatDateTime,
  validateWhite,
} from "../utils/index.js";

const createPoli = async (req, res) => {
  const { PoliName, PoliCode, PoliColor } = req.body;
  try {
    const PoliNameVal = capitalizeWord(PoliName);
    const PoliCodeVal = PoliCode.toUpperCase().trim();
    // receive request shouldn't empty
    if (!PoliNameVal || !PoliCodeVal) {
      return res
        .status(400)
        .json({ errMsg: "Upppps, All Input are Required !" });
    }
    // valid exsited name Poli
    const namePoliExsited = await Poli.findOne({
      PoliName: PoliNameVal,
    });
    if (namePoliExsited) {
      return res.status(409).json({
        errMsg: `Upppss, Poli Name : ${PoliNameVal} - is already Existed !`,
      });
    }
    // valid exsited code Poli
    const codePoliExsited = await Poli.findOne({ PoliCode: PoliCodeVal });
    if (codePoliExsited) {
      return res.status(409).json({
        errMsg: `Uppssss, Poli Code : ${PoliCodeVal} is already Existed !`,
      });
    }
    // validate color
    const isWhite = validateWhite(PoliColor);
    if (isWhite) {
      return res
        .status(409)
        .json({ errMsg: "Uppppss, Poli Color White isn't allowed !" });
    }
    // create new user
    const newPoli = new Poli({
      PoliName: PoliNameVal,
      PoliCode: PoliCodeVal,
      PoliColor,
    });
    //save poli
    await newPoli.save();
    // respond to client
    return res.status(200).json({
      msg: `${PoliNameVal} has been added`,
    });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const readPoli = async (req, res) => {
  const { search } = req.query;
  try {
    const keyword = search
      ? { PoliName: { $regex: search, $options: "i" } }
      : {};
    const poli = await Poli.find(keyword, "-PoliQueue").sort({ PoliName: 1 });
    return res.status(200).json(poli);
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const readPoliQueue = async (req, res) => {
  const { search } = req.query;
  try {
    const keyword = search
      ? { PoliName: { $regex: search, $options: "i" } }
      : {};
    const { FormatDate } = formatDateTime();
    const poli = await Poli.aggregate([
      { $match: keyword },
      {
        $addFields: {
          PoliQueue: {
            $filter: {
              input: "$PoliQueue",
              as: "queue",
              cond: { $eq: ["$$queue.Date", FormatDate] },
            },
          },
        },
      },
      { $sort: { PoliName: 1 } },
    ]);
    return res.status(200).json(poli);
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const readPoliQueueId = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Poli.findById(id);
    if (!data) return res.status(409).json({ errMsg: "Not Found" });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const updatePoli = async (req, res) => {
  const { id } = req.params;
  const { PoliName, PoliCode, PoliColor } = req.body;
  try {
    const PoliNameVal = capitalizeWord(PoliName);
    const PoliCodeVal = PoliCode.toUpperCase().trim();
    // receive request shouldn't empty
    if (!PoliNameVal || !PoliCodeVal) {
      return res
        .status(400)
        .json({ errMsg: "Upppps, All Input are Required !" });
    }
    // valid exsited name
    const namePoliExsited = await Poli.findOne({
      PoliName: PoliNameVal,
      _id: { $ne: id },
    });
    if (namePoliExsited) {
      return res.status(409).json({
        errMsg: `Upppps, Poli Name : ${PoliNameVal} is already Existed !`,
      });
    }
    // valid codePoli is already
    const codePoliExsited = await Poli.findOne({
      PoliCode: PoliCodeVal,
      _id: { $ne: id },
    });
    if (codePoliExsited) {
      return res.status(409).json({
        errMsg: `Upppps, Poli Code : ${PoliCodeVal} is Already Existed !`,
      });
    }
    // validate Color
    const isWhite = validateWhite(PoliColor);
    if (isWhite) {
      return res
        .status(409)
        .json({ errMsg: "Uppppss, Poli Color White isn't allowed !" });
    }
    // Update poli by id
    const updated = await Poli.findByIdAndUpdate(
      id,
      {
        PoliName: PoliNameVal,
        PoliCode: PoliCodeVal,
        PoliColor,
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ errMsg: "Poli Not Found!" });
    }
    return res.status(200).json({
      msg: `${PoliNameVal} - has been Updated`,
    });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const deletePoli = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Poli.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ errMsg: `Poli is not found !` });
    }
    return res
      .status(200)
      .json({ msg: `${result.PoliName} - has been Deleted ` });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const printPoliQueue = async (req, res) => {
  const { id } = req.params;
  const { FormatDate, Time } = formatDateTime();
  try {
    const poliAgg = await Poli.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $project: {
          PoliName: 1,
          PoliCode: 1,
          PoliQueueToday: {
            $filter: {
              input: "$PoliQueue",
              as: "queue",
              cond: { $eq: ["$$queue.Date", FormatDate] },
            },
          },
        },
      },
    ]);
    if (!poliAgg.length) {
      return res.status(404).json({ errMsg: "Poli not found" });
    }
    const poli = poliAgg[0];
    const nextNo = poli.PoliQueueToday.length + 1;
    const newQueueData = {
      No: nextNo,
      Date: FormatDate,
      Time,
      Code: `${poli.PoliCode} - ${nextNo}`,
      PoliName: poli.PoliName,
      CallTimes: 0,
    };
    await Poli.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          PoliQueue: {
            $each: [newQueueData],
            $sort: { Date: -1, Time: 1 },
          },
        },
      },
      { new: true }
    );
    return res.status(200).json(newQueueData);
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const ringPoliQueue = async (req, res) => {
  const { id } = req.params;
  const { No, Date, Time } = req.body;
  try {
    const updatedPoli = await Poli.findOneAndUpdate(
      {
        _id: id,
        "PoliQueue.No": No,
        "PoliQueue.Date": Date,
        "PoliQueue.Time": Time,
        "PoliQueue.CallTimes": { $lt: 3 },
      },
      {
        $inc: {
          "PoliQueue.$.CallTimes": 1,
        },
      },
      { new: true }
    );
    if (!updatedPoli) {
      return res.status(404).json({
        errMsg: `Poli Queue Is Not Found or It's already called 3 times`,
      });
    }
    return res.status(200).json({
      msg: `Nomor Antrian ${No} ke ${updatedPoli.PoliName}`,
    });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
export {
  createPoli,
  readPoli,
  updatePoli,
  deletePoli,
  printPoliQueue,
  ringPoliQueue,
  readPoliQueue,
  readPoliQueueId,
};
