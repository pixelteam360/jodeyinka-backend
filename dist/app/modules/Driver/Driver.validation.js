"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverValidation = void 0;
const zod_1 = require("zod");
const HireDriverSchema = zod_1.z.object({
    offerAmount: zod_1.z.number(),
    aboutOffer: zod_1.z.string(),
    driverId: zod_1.z.string(),
});
exports.DriverValidation = {
    HireDriverSchema,
};
