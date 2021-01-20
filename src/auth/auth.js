import React from "react";
import CryptoJS from "crypto-js";

export const EncriptPass = (password) => {
  // Encrypt
  var ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(password),
    process.env.REACT_APP_APP_SALT
  ).toString();

  return ciphertext;
};

export const DecrptPass = (password) => {
  // Decrypt
  var bytes = CryptoJS.AES.decrypt(password, process.env.REACT_APP_APP_SALT);
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};
