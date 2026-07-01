// Minimal runnable check for the password hashing path. Run: node User.selfcheck.js
const assert = require("assert");
const { hashPassword, verifyPassword } = require("./User");

const stored = hashPassword("s3cret-pw");
assert(stored.includes(":"), "hash must be salt:hash");
assert(verifyPassword("s3cret-pw", stored) === true, "correct password verifies");
assert(verifyPassword("wrong-pw", stored) === false, "wrong password rejected");
assert(hashPassword("s3cret-pw") !== stored, "salt makes each hash unique");
assert(verifyPassword("x", "malformed") === false, "malformed stored value rejected");

console.log("User password hashing self-check passed.");
