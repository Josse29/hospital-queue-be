import Hospital from "../models/Hospital.js";
import {
  capitalizeWord,
  validateEmail,
  validateLoadImg1,
} from "../utils/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findOne().select(
      "-HospitalPassword -HospitalLogin"
    );
    return res.status(200).json(hospital);
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const updateHospital = async (req, res) => {
  const { id } = req.params;
  const {
    HospitalName,
    HospitalAddress,
    HospitalPhone,
    HospitalEmail,
    HospitalLogo,
    HospitalInfo,
    HospitalMarquee,
  } = req.body;
  try {
    if (!HospitalName || !HospitalMarquee || !HospitalEmail) {
      return res.status(400).json({
        errMsg:
          "Hospital Name, Hospital Email, Hospital Marquee are Required !",
      });
    }
    const HospitalNameVal = capitalizeWord(HospitalName);
    const HospitalEmailVal = HospitalEmail.trim();
    const HospitalMarqueeVal = capitalizeWord(HospitalMarquee);
    const HospitalAddressVal = capitalizeWord(HospitalAddress);
    const isEmail = validateEmail(HospitalEmailVal);
    if (!isEmail) {
      return res.status(400).json({ errMsg: "Invalid Email!" });
    }
    const isImg = await validateLoadImg1(HospitalLogo);
    if (
      isImg === "Invalid Image File" ||
      isImg === "Invalid Image Size (Maximize 1 MB)"
    ) {
      return res.status(400).json({ errMsg: isImg });
    }
    const updated = await Hospital.findByIdAndUpdate(
      id,
      {
        HospitalName: HospitalNameVal,
        HospitalAddress: HospitalAddressVal,
        HospitalPhone,
        HospitalEmail: HospitalEmailVal,
        HospitalLogo,
        HospitalInfo,
        HospitalMarquee: HospitalMarqueeVal,
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ errMsg: "Hospital is not Found!" });
    }
    return res
      .status(200)
      .json({ msg: `${HospitalNameVal} - has been Updated !` });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const login = async (req, res) => {
  const { HospitalId, HospitalPassword } = req.body;
  try {
    if (!HospitalId || !HospitalPassword) {
      return res
        .status(409)
        .json({ errMsg: "Username and Password are Required !" });
    }
    // checkid
    const hospital = await Hospital.findOne({ HospitalId });
    if (!hospital) {
      return res.status(409).json({ errMsg: "Username is wrong !" });
    }
    // checkPassword
    const validPassword = await bcrypt.compare(
      HospitalPassword,
      hospital.HospitalPassword
    );
    if (!validPassword) {
      return res.status(409).json({ errMsg: "Password is wrong !" });
    }
    // check he's already login
    if (hospital.HospitalLogin === true) {
      return res
        .status(500)
        .json({ errMsg: `Uppsss, It's already Login with another device !` });
    }
    // updateLogin
    await Hospital.findByIdAndUpdate(
      hospital._id,
      {
        HospitalLogin: true,
      },
      { new: true }
    );
    const token = jwt.sign(
      {
        id: hospital._id,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ msg: "Success Login !", token });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
const logout = async (req, res) => {
  const { id } = req.params;
  try {
    await Hospital.findByIdAndUpdate(
      id,
      {
        HospitalLogin: false,
      },
      { new: true }
    );
    return res.status(200).json({ msg: "Success Logout !" });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
// it's optional
const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { HospitalPassword } = req.body;
  try {
    await Hospital.findByIdAndUpdate(id, { HospitalPassword }, { new: true });
    return res.status(200).json({ msg: "Reset Password Success" });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};
export { getHospital, updateHospital, login, logout };
