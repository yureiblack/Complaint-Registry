"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const complaint_controller_1 = require("../controllers/complaint.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.authMiddleware, complaint_controller_1.createComplaint);
router.get("/:id", auth_middleware_1.authMiddleware, complaint_controller_1.getComplaint);
router.patch("/:id/status", auth_middleware_1.authMiddleware, complaint_controller_1.updateStatus);
exports.default = router;
