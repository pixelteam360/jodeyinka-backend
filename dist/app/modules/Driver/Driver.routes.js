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
router.get("/agent", (0, auth_1.default)(), Driver_controller_1.DriverController.allAgent);
router
    .route("/bookmark")
    .get((0, auth_1.default)(), Driver_controller_1.DriverController.getMyBookMarks);
router.route("/my-hiring").get((0, auth_1.default)(), Driver_controller_1.DriverController.myhiring);
router.route("/:id").get((0, auth_1.default)(), Driver_controller_1.DriverController.singleDriver);
router
    .route("/my-hiring/:id")
    .get((0, auth_1.default)(), Driver_controller_1.DriverController.singleHiring)
    .patch((0, auth_1.default)(client_1.UserRole.DRIVER), Driver_controller_1.DriverController.acceptHiring)
    .delete((0, auth_1.default)(client_1.UserRole.DRIVER), Driver_controller_1.DriverController.deletehiring);
router
    .route("/bookmark/:id")
    .post((0, auth_1.default)(), Driver_controller_1.DriverController.bookmarkDriver);
exports.DriverRoutes = router;
