"use strict";

const HashId = require("hashids");
const hashId = new HashId(process.env.HASH_KEY, 20, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");

class Hasher {
  /**
   * Generates a unique hash
   */
  static generate() {
    return hashId.encode(Date.now() + process.pid);
  }
}

module.exports = Hasher;