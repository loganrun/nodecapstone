'use strict';
exports.DATABASE_URL =
    process.env.DATABASE_URL || 'mongodb://localhost/management-app';
    global.DATABASE_URL ||'mongodb://localhost/management-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-management-app';
exports.PORT = process.env.PORT || 8080;
exports.IO = process.env.IP;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
