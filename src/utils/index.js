const capitalizeWord = (val) => {
  if (!val) {
    return "";
  } else {
    const capitalize = val
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return capitalize.trim();
  }
};
const formatDateTime = () => {
  const now = new Date();
  const FormatDate = now.toISOString().split("T")[0];
  const Hour = ("0" + now.getHours()).slice(-2);
  const Minute = ("0" + now.getMinutes()).slice(-2);
  const Second = ("0" + now.getSeconds()).slice(-2);
  const Time = `${Hour}:${Minute}:${Second}`;
  return { FormatDate, Time };
};
const validateEmail = (val) => {
  const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmail = email.test(val.trim());
  return isEmail;
};
const validateLoadImg1 = async (base64) => {
  if (base64.length > 0) {
    if (!base64.startsWith("data:image")) {
      const msg = `Invalid Image File`;
      return msg;
    }
    const base64Str = base64.split(",")[1];
    const sizeInBytes =
      4 * Math.ceil(base64Str.length / 3) * 0.5624896334383812;
    const sizeInKB = sizeInBytes / 1024;
    if (sizeInKB > 1024) {
      const msg = `Invalid Image Size (Maximize 1 MB)`;
      return msg;
    }
  }
  return base64;
};
const validatePassword = () => {
  if (UserPasswordVal === "" && UserPassword1Val === "") {
    const msg = `Password and Confirmation Password are required `;
    return msg;
  }
  if (UserPasswordVal !== UserPassword1Val) {
    const msg = `Password must be same with Confirm Password`;
    return msg;
  }
  const password = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=.{8,})/;
  const isValid = password.test(UserPasswordVal);
  if (!isValid) {
    const msg = `
    Requirement Password
    Minimum length 8 Character, 
    At least 1 Capital letter (A-Z),
    At least 1 Number (0-9),
    At least 1 Character sepecial (@,#,$) `;
    return msg;
  }
};
const validateUserName = (UserNameVal) => {
  if (!UserNameVal) {
    const msg = `Username is Required!`;
    throw new Error(msg);
  }
  const username = /^[a-zA-Z0-9_.]{3,15}$/;
  const isValid = username.test(UserNameVal);
  if (!isValid) {
    const msg = `
    Requirement Username
    Only contain Alphabet, Number, Without Space
    Minimum length Character 3 - 15 
  `;
    throw new Error(msg);
  }
};
const validateWhite = (val) => {
  const isWhite = val === "255,255,255";
  return isWhite;
};
const encryptPassword = async (value) => {
  //generate password hashing Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(value, salt);
  return hashedPassword;
};
export {
  capitalizeWord,
  validateEmail,
  formatDateTime,
  validateLoadImg1,
  validateWhite,
};
