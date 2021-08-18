"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = exports.UserService = exports.RatingService = exports.PostService = exports.CommentService = exports.CategoryService = exports.NewsService = exports.AuthService = exports.AdministratorService = exports.AccountService = void 0;
const AccountService = __importStar(require("./accountService"));
exports.AccountService = AccountService;
const AdministratorService = __importStar(require("./administratorService"));
exports.AdministratorService = AdministratorService;
const AuthService = __importStar(require("./authService"));
exports.AuthService = AuthService;
const CategoryService = __importStar(require("./categoryService"));
exports.CategoryService = CategoryService;
const CommentService = __importStar(require("./commentService"));
exports.CommentService = CommentService;
const NewsService = __importStar(require("./newsService"));
exports.NewsService = NewsService;
const PostService = __importStar(require("./postService"));
exports.PostService = PostService;
const RatingService = __importStar(require("./ratingService"));
exports.RatingService = RatingService;
const UserService = __importStar(require("./userService"));
exports.UserService = UserService;
const VerificationService = __importStar(require("./verificationService"));
exports.VerificationService = VerificationService;
