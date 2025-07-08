"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Driver_controller_1 = require("./Driver.controller");
const client_1 = require("@prisma/client");
const Driver_validation_1 = require("./Driver.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(), Driver_controller_1.DriverController.allDrivers)
    .post((0, auth_1.default)(client_1.UserRole.AGENT, client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(Driver_validation_1.DriverValidation.HireDriverSchema), Driver_controller_1.DriverController.hireADriver);
router.route("/:id").get((0, auth_1.default)(), Driver_controller_1.DriverController.singleDriver);
exports.DriverRoutes = router;
