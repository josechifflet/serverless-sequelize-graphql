(function(e, a) { for(var i in a) e[i] = a[i]; if(a.__esModule) Object.defineProperty(e, "__esModule", { value: true }); }(exports,
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./environment/environments.ts":
/*!*************************************!*\
  !*** ./environment/environments.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.environment = void 0;
exports.environment = {
    APP: process.env.JWT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: +process.env.DB_PORT,
    DB_CONNECTOR: process.env.DB_CONNECTOR,
};


/***/ }),

/***/ "./src/context.ts":
/*!************************!*\
  !*** ./src/context.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createContext = exports.verifyUser = exports.getToken = void 0;
const models_1 = __importDefault(__webpack_require__(/*! ./models */ "./src/models/index.ts"));
const graphql_subscriptions_1 = __webpack_require__(/*! graphql-subscriptions */ "graphql-subscriptions");
const jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
const environments_1 = __webpack_require__(/*! ../environment/environments */ "./environment/environments.ts");
const { JWT_SECRET } = environments_1.environment;
const pubsub = new graphql_subscriptions_1.PubSub();
const getToken = (req) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return null;
    }
    return authHeader.replace('Bearer ', '');
};
exports.getToken = getToken;
const verifyUser = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyUser = verifyUser;
function createContext(ctx) {
    const request = ctx.req;
    return {
        getUser: () => {
            const { User: User } = models_1.default;
            const token = exports.getToken(request);
            if (!token) {
                return null;
            }
            const user = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const { userId } = user;
            return userModel.findOne({
                where: {
                    id: userId,
                },
                raw: true,
            });
        },
        verifyUser: () => {
            const token = exports.getToken(request);
            if (!token) {
                return null;
            }
            return jsonwebtoken_1.default.verify(token, JWT_SECRET);
        },
        models: models_1.default,
        pubsub,
        appSecret: JWT_SECRET,
    };
}
exports.createContext = createContext;


/***/ }),

/***/ "./src/db/index.ts":
/*!*************************!*\
  !*** ./src/db/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(/*! sequelize */ "sequelize");
const environments_1 = __webpack_require__(/*! ../../environment/environments */ "./environment/environments.ts"); // for serverless api
const sequelize = new sequelize_1.Sequelize(environments_1.environment.DB_DATABASE, environments_1.environment.DB_USER, environments_1.environment.DB_PASSWORD, {
    host: environments_1.environment.DB_HOST,
    dialect: environments_1.environment.DB_CONNECTOR,
    logging: true
});
if (true) {
    sequelize.sync();
}
exports.default = sequelize;


/***/ }),

/***/ "./src/models/Notification.ts":
/*!************************************!*\
  !*** ./src/models/Notification.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(/*! sequelize */ "sequelize");
const db_1 = __importDefault(__webpack_require__(/*! ../db */ "./src/db/index.ts"));
class Notification extends sequelize_1.Model {
}
Notification.init({
    id: {
        type: sequelize_1.UUID,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    token: {
        type: sequelize_1.STRING,
        allowNull: false,
        unique: true,
    },
    device: sequelize_1.STRING,
    os: sequelize_1.STRING,
}, {
    sequelize: db_1.default,
    timestamps: true,
    paranoid: true,
});
exports.default = Notification;


/***/ }),

/***/ "./src/models/Post.ts":
/*!****************************!*\
  !*** ./src/models/Post.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(/*! sequelize */ "sequelize");
const db_1 = __importDefault(__webpack_require__(/*! ../db */ "./src/db/index.ts"));
class Post extends sequelize_1.Model {
}
Post.init({
    id: {
        type: sequelize_1.UUID,
        defaultValue: sequelize_1.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: sequelize_1.STRING,
    content: sequelize_1.STRING,
}, {
    sequelize: db_1.default,
    timestamps: true,
    paranoid: true,
});
exports.default = Post;


/***/ }),

/***/ "./src/models/User.ts":
/*!****************************!*\
  !*** ./src/models/User.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const sequelize_1 = __webpack_require__(/*! sequelize */ "sequelize");
const Notification_1 = __importDefault(__webpack_require__(/*! ./Notification */ "./src/models/Notification.ts"));
const Post_1 = __importDefault(__webpack_require__(/*! ./Post */ "./src/models/Post.ts"));
const moment_1 = __importDefault(__webpack_require__(/*! moment */ "moment"));
const db_1 = __importDefault(__webpack_require__(/*! ../db */ "./src/db/index.ts"));
const { STRING, BOOLEAN, UUID, UUIDV1, ENUM } = sequelize_1.DataTypes;
var Gender;
(function (Gender) {
    Gender["Male"] = "MALE";
    Gender["Female"] = "FEMALE";
})(Gender || (Gender = {}));
var AuthType;
(function (AuthType) {
    AuthType["Email"] = "EMAIL";
    AuthType["Facebook"] = "FACEBOOK";
    AuthType["Google"] = "GOOGLE";
    AuthType["Apple"] = "APPLE";
})(AuthType || (AuthType = {}));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: UUID,
        defaultValue: UUIDV1,
        allowNull: false,
        primaryKey: true,
    },
    email: {
        type: STRING,
    },
    password: {
        type: STRING,
        allowNull: true,
    },
    name: STRING,
    nickname: STRING,
    gender: ENUM('MALE', 'FEMALE'),
    thumbUrl: STRING,
    photoURL: STRING,
    birthday: {
        type: sequelize_1.DATEONLY,
        get: function () {
            return moment_1.default.utc(this.getDataValue('regDate')).format('YYYY-MM-DD');
        },
    },
    socialId: STRING,
    authType: ENUM('EMAIL', 'FACEBOOK', 'GOOGLE', 'APPLE'),
    verified: {
        type: BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db_1.default,
    timestamps: true,
    paranoid: true,
});
User.hasMany(Notification_1.default);
Notification_1.default.belongsTo(User);
User.hasMany(Post_1.default);
Post_1.default.belongsTo(User);
exports.default = User;


/***/ }),

/***/ "./src/models/index.ts":
/*!*****************************!*\
  !*** ./src/models/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Notification_1 = __importDefault(__webpack_require__(/*! ./Notification */ "./src/models/Notification.ts"));
const Post_1 = __importDefault(__webpack_require__(/*! ./Post */ "./src/models/Post.ts"));
const User_1 = __importDefault(__webpack_require__(/*! ./User */ "./src/models/User.ts"));
exports.default = {
    Notification: Notification_1.default,
    User: User_1.default,
    Post: Post_1.default,
};


/***/ }),

/***/ "./src/resolvers/index.ts":
/*!********************************!*\
  !*** ./src/resolvers/index.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolvers = void 0;
const notification_1 = __importDefault(__webpack_require__(/*! ./notification */ "./src/resolvers/notification.ts"));
const user_1 = __importDefault(__webpack_require__(/*! ./user */ "./src/resolvers/user.ts"));
exports.resolvers = [
    notification_1.default,
    user_1.default,
];
exports.default = {
    Notification: notification_1.default,
    User: user_1.default,
};


/***/ }),

/***/ "./src/resolvers/notification.ts":
/*!***************************************!*\
  !*** ./src/resolvers/notification.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const resolver = {
    Mutation: {
        addNotificationToken: async (_, args, { models }) => {
            try {
                const { Notification: Notification } = models;
                const notification = await Notification.create(args.notification, { raw: true });
                return notification;
            }
            catch (err) {
                throw new Error(err);
            }
        },
    },
};
exports.default = resolver;


/***/ }),

/***/ "./src/resolvers/user.ts":
/*!*******************************!*\
  !*** ./src/resolvers/user.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const auth_1 = __webpack_require__(/*! ../utils/auth */ "./src/utils/auth.ts");
const apollo_server_express_1 = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
const sequelize_1 = __webpack_require__(/*! sequelize */ "sequelize");
const types_1 = __webpack_require__(/*! ../types */ "./src/types/index.ts");
const jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
const USER_SIGNED_IN = 'USER_SIGNED_IN';
const USER_UPDATED = 'USER_UPDATED';
const signInWithSocialAccount = async (socialUser, models, appSecret) => {
    const { User: User } = models;
    if (socialUser.email) {
        const emailUser = await User.findOne({
            where: {
                email: socialUser.email,
                socialId: { [sequelize_1.Op.ne]: socialUser.socialId },
            },
            raw: true,
        });
        if (emailUser) {
            throw new Error('Email for current user is already signed in');
        }
    }
    const user = await User.findOrCreate({
        where: { socialId: `${socialUser.socialId}` },
        defaults: {
            socialId: socialUser.socialId,
            authType: socialUser.authType,
            email: socialUser.email,
            nickname: socialUser.name,
            name: socialUser.name,
            birthday: socialUser.birthday,
            gender: socialUser.gender,
            phone: socialUser.phone,
            verified: false,
        },
    });
    if (!user || (user && user[1] === false)) {
        // user already exists
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user[0].id,
        role: types_1.Role.User,
    }, appSecret);
    return { token, user: user[0] };
};
const resolver = {
    Query: {
        users: async (_, args, { getUser, models }) => {
            const { User } = models;
            const user = await getUser();
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('User is not logged in');
            return User.findAll();
        },
        user: (_, args, { models }) => {
            const { User } = models;
            return User.findOne({ where: args });
        },
    },
    Mutation: {
        signInEmail: async (_, args, { models, appSecret, pubsub }) => {
            const { User: User } = models;
            const user = await User.findOne({
                where: {
                    email: args.email,
                },
                raw: true,
            });
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('User does not exsists');
            const validate = await auth_1.validateCredential(args.password, user.password);
            if (!validate)
                throw new apollo_server_express_1.AuthenticationError('Password is not correct');
            const token = jsonwebtoken_1.default.sign({
                userId: user.id,
                role: types_1.Role.User,
            }, appSecret);
            pubsub.publish(USER_SIGNED_IN, { userSignedIn: user });
            return { token, user };
        },
        signInGoogle: async (_, { socialUser }, { appSecret, models }) => signInWithSocialAccount(socialUser, models, appSecret),
        signInFacebook: async (_, { socialUser }, { appSecret, models }) => signInWithSocialAccount(socialUser, models, appSecret),
        signInApple: async (_, { socialUser }, { appSecret, models }) => signInWithSocialAccount(socialUser, models, appSecret),
        signUp: async (_, args, { appSecret, models }) => {
            const { User: User } = models;
            const emailUser = await User.findOne({
                where: {
                    email: args.user.email,
                },
                raw: true,
            });
            if (emailUser) {
                throw new Error('Email for current user is already signed up.');
            }
            args.user.password = await auth_1.encryptCredential(args.user.password);
            const user = await models.User.create(args.user, { raw: true });
            const token = jsonwebtoken_1.default.sign({
                userId: user.id,
                role: types_1.Role.User,
            }, appSecret);
            return { token, user };
        },
        updateProfile: async (_, args, { getUser, models, pubsub }) => {
            try {
                const auth = await getUser();
                if (!auth) {
                    throw new apollo_server_express_1.AuthenticationError('User is not logged in');
                }
                models.User.update(args, {
                    where: {
                        id: auth.id,
                    },
                });
                const user = await models.User.findOne({
                    where: {
                        id: auth.id,
                    },
                    raw: true,
                });
                pubsub.publish(USER_UPDATED, { user });
                return user;
            }
            catch (err) {
                throw new Error(err);
            }
        },
    },
    Subscription: {
        userSignedIn: {
            // issue: https://github.com/apollographql/graphql-subscriptions/issues/192
            // eslint-disable-next-line
            subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(USER_SIGNED_IN),
        },
        userUpdated: {
            subscribe: apollo_server_1.withFilter((_, args, { pubsub }) => {
                return pubsub.asyncIterator(USER_UPDATED, { user: args.user });
            }, (payload, { userId }) => {
                const { userUpdated: updatedUser } = payload;
                return updatedUser.id === userId;
            }),
        },
    },
    User: {
        notifications: (_, args, { models }) => {
            const { Notification: notificationModel } = models;
            return notificationModel.findAll({
                where: {
                    userId: _.id,
                },
            });
        },
        posts: (_, args, { models }) => {
            const { Post: postModel } = models;
            return postModel.findAll({
                where: {
                    userId: _.id,
                },
            });
        },
    },
};
exports.default = resolver;


/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.graphqlHandler = void 0;
const apollo_server_lambda_1 = __webpack_require__(/*! apollo-server-lambda */ "apollo-server-lambda");
const resolvers_1 = __webpack_require__(/*! ./resolvers */ "./src/resolvers/index.ts");
const context_1 = __webpack_require__(/*! ./context */ "./src/context.ts");
const graphql_import_1 = __webpack_require__(/*! graphql-import */ "graphql-import");
const typeDefs = graphql_import_1.importSchema('schemas/schema.graphql');
exports.graphqlHandler = new apollo_server_lambda_1.ApolloServer({
    typeDefs,
    resolvers: resolvers_1.resolvers,
    playground: { endpoint: '/dev/graphql' },
    context: context_1.createContext
}).createHandler();


/***/ }),

/***/ "./src/types/index.ts":
/*!****************************!*\
  !*** ./src/types/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Role = void 0;
var Role;
(function (Role) {
    Role[Role["User"] = 0] = "User";
    Role[Role["Admin"] = 1] = "Admin";
})(Role = exports.Role || (exports.Role = {}));


/***/ }),

/***/ "./src/utils/auth.ts":
/*!***************************!*\
  !*** ./src/utils/auth.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateCredential = exports.encryptCredential = exports.verifyUser = exports.validateEmail = exports.JWT_SECRET = void 0;
const bcrypt_nodejs_1 = __importDefault(__webpack_require__(/*! bcrypt-nodejs */ "bcrypt-nodejs"));
const jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
const SALT_ROUND = 10;
_a = process.env.JWT_SECRET, exports.JWT_SECRET = _a === void 0 ? 'undefined' : _a;
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
exports.validateEmail = validateEmail;
const verifyUser = (token) => {
    return jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
};
exports.verifyUser = verifyUser;
const encryptCredential = async (password) => new Promise((resolve, reject) => {
    const SALT = bcrypt_nodejs_1.default.genSaltSync(SALT_ROUND);
    bcrypt_nodejs_1.default.hash(password, SALT, null, (err, hash) => {
        if (err) {
            return reject(err);
        }
        resolve(hash);
    });
});
exports.encryptCredential = encryptCredential;
const validateCredential = async (value, hashedValue) => new Promise((resolve, reject) => {
    bcrypt_nodejs_1.default.compare(value, hashedValue, (err, res) => {
        if (err) {
            return reject(err);
        }
        resolve(res);
    });
});
exports.validateCredential = validateCredential;


/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("apollo-server");;

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("apollo-server-express");;

/***/ }),

/***/ "apollo-server-lambda":
/*!***************************************!*\
  !*** external "apollo-server-lambda" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("apollo-server-lambda");;

/***/ }),

/***/ "bcrypt-nodejs":
/*!********************************!*\
  !*** external "bcrypt-nodejs" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("bcrypt-nodejs");;

/***/ }),

/***/ "graphql-import":
/*!*********************************!*\
  !*** external "graphql-import" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("graphql-import");;

/***/ }),

/***/ "graphql-subscriptions":
/*!****************************************!*\
  !*** external "graphql-subscriptions" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("graphql-subscriptions");;

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");;

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("moment");;

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("sequelize");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/server.ts");
/******/ })()

));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjL3NlcnZlci5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL2V4cHJlc3MtdHlwZXNjcmlwdC1ncmFwaHFsLy4vZW52aXJvbm1lbnQvZW52aXJvbm1lbnRzLnRzIiwid2VicGFjazovL2V4cHJlc3MtdHlwZXNjcmlwdC1ncmFwaHFsLy4vc3JjL2NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvLi9zcmMvZGIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvLi9zcmMvbW9kZWxzL05vdGlmaWNhdGlvbi50cyIsIndlYnBhY2s6Ly9leHByZXNzLXR5cGVzY3JpcHQtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvUG9zdC50cyIsIndlYnBhY2s6Ly9leHByZXNzLXR5cGVzY3JpcHQtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvVXNlci50cyIsIndlYnBhY2s6Ly9leHByZXNzLXR5cGVzY3JpcHQtZ3JhcGhxbC8uL3NyYy9tb2RlbHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL2luZGV4LnRzIiwid2VicGFjazovL2V4cHJlc3MtdHlwZXNjcmlwdC1ncmFwaHFsLy4vc3JjL3Jlc29sdmVycy9ub3RpZmljYXRpb24udHMiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvLi9zcmMvcmVzb2x2ZXJzL3VzZXIudHMiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvLi9zcmMvc2VydmVyLnRzIiwid2VicGFjazovL2V4cHJlc3MtdHlwZXNjcmlwdC1ncmFwaHFsLy4vc3JjL3R5cGVzL2luZGV4LnRzIiwid2VicGFjazovL2V4cHJlc3MtdHlwZXNjcmlwdC1ncmFwaHFsLy4vc3JjL3V0aWxzL2F1dGgudHMiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyXCIiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyLWV4cHJlc3NcIiIsIndlYnBhY2s6Ly9leHByZXNzLXR5cGVzY3JpcHQtZ3JhcGhxbC9leHRlcm5hbCBcImFwb2xsby1zZXJ2ZXItbGFtYmRhXCIiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvZXh0ZXJuYWwgXCJiY3J5cHQtbm9kZWpzXCIiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvZXh0ZXJuYWwgXCJncmFwaHFsLWltcG9ydFwiIiwid2VicGFjazovL2V4cHJlc3MtdHlwZXNjcmlwdC1ncmFwaHFsL2V4dGVybmFsIFwiZ3JhcGhxbC1zdWJzY3JpcHRpb25zXCIiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvZXh0ZXJuYWwgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9leHByZXNzLXR5cGVzY3JpcHQtZ3JhcGhxbC9leHRlcm5hbCBcIm1vbWVudFwiIiwid2VicGFjazovL2V4cHJlc3MtdHlwZXNjcmlwdC1ncmFwaHFsL2V4dGVybmFsIFwic2VxdWVsaXplXCIiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZXhwcmVzcy10eXBlc2NyaXB0LWdyYXBocWwvd2VicGFjay9zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInR5cGUgRW52aXJvbm1lbnQgPSB7XHJcbiAgQVBQOiBzdHJpbmc7XHJcbiAgSldUX1NFQ1JFVDogc3RyaW5nO1xyXG4gIERCX1VTRVI6IHN0cmluZztcclxuICBEQl9QQVNTV09SRDogc3RyaW5nO1xyXG4gIERCX0RBVEFCQVNFOiBzdHJpbmc7XHJcbiAgREJfSE9TVDogc3RyaW5nO1xyXG4gIERCX1BPUlQ6IG51bWJlcjtcclxuICBEQl9DT05ORUNUT1I6IHN0cmluZztcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBlbnZpcm9ubWVudDogRW52aXJvbm1lbnQgPSB7XHJcbiAgQVBQOiBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIGFzIHN0cmluZyxcclxuICBKV1RfU0VDUkVUOiBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIGFzIHN0cmluZyxcclxuICBEQl9VU0VSOiBwcm9jZXNzLmVudi5EQl9VU0VSIGFzIHN0cmluZyxcclxuICBEQl9QQVNTV09SRDogcHJvY2Vzcy5lbnYuREJfUEFTU1dPUkQgYXMgc3RyaW5nLFxyXG4gIERCX0RBVEFCQVNFOiBwcm9jZXNzLmVudi5EQl9EQVRBQkFTRSBhcyBzdHJpbmcsXHJcbiAgREJfSE9TVDogcHJvY2Vzcy5lbnYuREJfSE9TVCBhcyBzdHJpbmcsXHJcbiAgREJfUE9SVDogK3Byb2Nlc3MuZW52LkRCX1BPUlQsXHJcbiAgREJfQ09OTkVDVE9SOiBwcm9jZXNzLmVudi5EQl9DT05ORUNUT1IgYXMgc3RyaW5nLFxyXG59O1xyXG4iLCJpbXBvcnQgbW9kZWxzLCB7IE1vZGVsVHlwZSB9IGZyb20gJy4vbW9kZWxzJztcclxuaW1wb3J0IHsgSnd0VXNlciB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgeyBQdWJTdWIgfSBmcm9tICdncmFwaHFsLXN1YnNjcmlwdGlvbnMnO1xyXG5pbXBvcnQgeyBSZXF1ZXN0IH0gZnJvbSAnYXBvbGxvLXNlcnZlcic7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuL21vZGVscy9Vc2VyJztcclxuaW1wb3J0IGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xyXG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gJy4uL2Vudmlyb25tZW50L2Vudmlyb25tZW50cyc7XHJcblxyXG5jb25zdCB7IEpXVF9TRUNSRVQgfSA9IGVudmlyb25tZW50O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBNeUNvbnRleHQge1xyXG4gIGdldFVzZXI6ICgpID0+IFByb21pc2U8VXNlcj47XHJcbiAgdmVyaWZ5VXNlcjogKCkgPT4gSnd0VXNlcjtcclxuICBtb2RlbHM6IE1vZGVsVHlwZTtcclxuICBwdWJzdWI6IFB1YlN1YjtcclxuICBhcHBTZWNyZXQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBFeHByZXNzQ29udGV4dCB7XHJcbiAgcmVxOiBSZXF1ZXN0O1xyXG4gIHJlczogUmVzcG9uc2U7XHJcbiAgY29ubmVjdGlvbj86IGFueTtcclxufVxyXG5cclxuY29uc3QgcHVic3ViID0gbmV3IFB1YlN1YigpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFRva2VuID0gKHJlcTogRXhwcmVzcy5SZXF1ZXN0ICYgYW55KTogc3RyaW5nID0+IHtcclxuICBjb25zdCBhdXRoSGVhZGVyID0gcmVxLmdldCgnQXV0aG9yaXphdGlvbicpO1xyXG5cclxuICBpZiAoIWF1dGhIZWFkZXIpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGF1dGhIZWFkZXIucmVwbGFjZSgnQmVhcmVyICcsICcnKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB2ZXJpZnlVc2VyID0gKHRva2VuOiBzdHJpbmcpOiBKd3RVc2VyID0+IHtcclxuICByZXR1cm4gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCkgYXMgSnd0VXNlcjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb250ZXh0KGN0eDogRXhwcmVzc0NvbnRleHQpOiBNeUNvbnRleHQge1xyXG4gIGNvbnN0IHJlcXVlc3QgPSBjdHgucmVxO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZ2V0VXNlcjogKCk6IFByb21pc2U8VXNlcj4gPT4ge1xyXG4gICAgICBjb25zdCB7IFVzZXI6IHVzZXJNb2RlbCB9ID0gbW9kZWxzO1xyXG4gICAgICBjb25zdCB0b2tlbiA9IGdldFRva2VuKHJlcXVlc3QpO1xyXG5cclxuICAgICAgaWYgKCF0b2tlbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB1c2VyID0gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCkgYXMgSnd0VXNlcjtcclxuICAgICAgY29uc3QgeyB1c2VySWQgfSA9IHVzZXI7XHJcblxyXG4gICAgICByZXR1cm4gdXNlck1vZGVsLmZpbmRPbmUoe1xyXG4gICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICBpZDogdXNlcklkLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmF3OiB0cnVlLFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICB2ZXJpZnlVc2VyOiAoKTogSnd0VXNlciA9PiB7XHJcbiAgICAgIGNvbnN0IHRva2VuID0gZ2V0VG9rZW4ocmVxdWVzdCk7XHJcbiAgICAgIGlmICghdG9rZW4pIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGp3dC52ZXJpZnkodG9rZW4sIEpXVF9TRUNSRVQpIGFzIEp3dFVzZXI7XHJcbiAgICB9LFxyXG4gICAgbW9kZWxzLFxyXG4gICAgcHVic3ViLFxyXG4gICAgYXBwU2VjcmV0OiBKV1RfU0VDUkVULFxyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlhbGVjdCwgU2VxdWVsaXplIH0gZnJvbSAnc2VxdWVsaXplJztcclxuaW1wb3J0IHtlbnZpcm9ubWVudH0gZnJvbSAnLi4vLi4vZW52aXJvbm1lbnQvZW52aXJvbm1lbnRzJzsgLy8gZm9yIHNlcnZlcmxlc3MgYXBpXHJcblxyXG5jb25zdCBzZXF1ZWxpemUgPSBuZXcgU2VxdWVsaXplKFxyXG4gIGVudmlyb25tZW50LkRCX0RBVEFCQVNFLFxyXG4gIGVudmlyb25tZW50LkRCX1VTRVIsXHJcbiAgZW52aXJvbm1lbnQuREJfUEFTU1dPUkQsXHJcbiAge1xyXG4gICAgaG9zdDogZW52aXJvbm1lbnQuREJfSE9TVCxcclxuICAgIGRpYWxlY3Q6IGVudmlyb25tZW50LkRCX0NPTk5FQ1RPUiBhcyBEaWFsZWN0LFxyXG4gICAgbG9nZ2luZzogdHJ1ZVxyXG4gIH1cclxuKTtcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnKSB7XHJcbiAgc2VxdWVsaXplLnN5bmMoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2VxdWVsaXplO1xyXG4iLCJpbXBvcnQgeyBCdWlsZE9wdGlvbnMsIE1vZGVsLCBTVFJJTkcsIFVVSUQsIFVVSURWNCB9IGZyb20gJ3NlcXVlbGl6ZSc7XHJcblxyXG5pbXBvcnQgc2VxdWVsaXplIGZyb20gJy4uL2RiJztcclxuXHJcbmNsYXNzIE5vdGlmaWNhdGlvbiBleHRlbmRzIE1vZGVsIHtcclxuICBwdWJsaWMgaWQ6IHN0cmluZztcclxuICBwdWJsaWMgdG9rZW46IHN0cmluZztcclxuICBwdWJsaWMgZGV2aWNlOiBzdHJpbmc7XHJcbiAgcHVibGljIG9zOiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0ZWRBdDogRGF0ZTtcclxuICBwdWJsaWMgcmVhZG9ubHkgdXBkYXRlZEF0OiBEYXRlO1xyXG59XHJcblxyXG5Ob3RpZmljYXRpb24uaW5pdChcclxuICB7XHJcbiAgICBpZDoge1xyXG4gICAgICB0eXBlOiBVVUlELFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFVVSURWNCxcclxuICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuICAgICAgcHJpbWFyeUtleTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICB0b2tlbjoge1xyXG4gICAgICB0eXBlOiBTVFJJTkcsXHJcbiAgICAgIGFsbG93TnVsbDogZmFsc2UsXHJcbiAgICAgIHVuaXF1ZTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBkZXZpY2U6IFNUUklORyxcclxuICAgIG9zOiBTVFJJTkcsXHJcbiAgfSxcclxuICB7XHJcbiAgICBzZXF1ZWxpemUsXHJcbiAgICB0aW1lc3RhbXBzOiB0cnVlLFxyXG4gICAgcGFyYW5vaWQ6IHRydWUsXHJcbiAgfSxcclxuKTtcclxuXHJcbmV4cG9ydCB0eXBlIE5vdGlmaWNhdGlvbk1vZGVsU3RhdGljID0gdHlwZW9mIE1vZGVsICYge1xyXG4gIG5ldyAodmFsdWVzPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIG9wdGlvbnM/OiBCdWlsZE9wdGlvbnMpOiBOb3RpZmljYXRpb247XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE5vdGlmaWNhdGlvbiBhcyBOb3RpZmljYXRpb25Nb2RlbFN0YXRpYztcclxuIiwiaW1wb3J0IHsgQnVpbGRPcHRpb25zLCBNb2RlbCwgU1RSSU5HLCBVVUlELCBVVUlEVjQgfSBmcm9tICdzZXF1ZWxpemUnO1xyXG5cclxuaW1wb3J0IHNlcXVlbGl6ZSBmcm9tICcuLi9kYic7XHJcblxyXG5jbGFzcyBQb3N0IGV4dGVuZHMgTW9kZWwge1xyXG4gIHB1YmxpYyBpZDogc3RyaW5nO1xyXG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBjb250ZW50OiBzdHJpbmc7XHJcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0ZWRBdCE6IERhdGU7XHJcbiAgcHVibGljIHJlYWRvbmx5IHVwZGF0ZWRBdCE6IERhdGU7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRlbGV0ZWRBdCE6IERhdGU7XHJcbn1cclxuXHJcblBvc3QuaW5pdChcclxuICB7XHJcbiAgICBpZDoge1xyXG4gICAgICB0eXBlOiBVVUlELFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IFVVSURWNCxcclxuICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuICAgICAgcHJpbWFyeUtleTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICB0aXRsZTogU1RSSU5HLFxyXG4gICAgY29udGVudDogU1RSSU5HLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgc2VxdWVsaXplLFxyXG4gICAgdGltZXN0YW1wczogdHJ1ZSxcclxuICAgIHBhcmFub2lkOiB0cnVlLFxyXG4gIH0sXHJcbik7XHJcblxyXG5leHBvcnQgdHlwZSBQb3N0TW9kZWxTdGF0aWMgPSB0eXBlb2YgTW9kZWwgJiB7XHJcbiAgbmV3ICh2YWx1ZXM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgb3B0aW9ucz86IEJ1aWxkT3B0aW9ucyk6IFBvc3Q7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvc3QgYXMgUG9zdE1vZGVsU3RhdGljO1xyXG4iLCJpbXBvcnQgeyBCdWlsZE9wdGlvbnMsIERBVEVPTkxZLCBEYXRhVHlwZXMsIE1vZGVsIH0gZnJvbSAnc2VxdWVsaXplJztcclxuXHJcbmltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi9Ob3RpZmljYXRpb24nO1xyXG5pbXBvcnQgUG9zdCBmcm9tICcuL1Bvc3QnO1xyXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCBzZXF1ZWxpemUgZnJvbSAnLi4vZGInO1xyXG5cclxuY29uc3QgeyBTVFJJTkcsIEJPT0xFQU4sIFVVSUQsIFVVSURWMSwgRU5VTSB9ID0gRGF0YVR5cGVzO1xyXG5cclxuZW51bSBHZW5kZXIge1xyXG4gIE1hbGUgPSAnTUFMRScsXHJcbiAgRmVtYWxlID0gJ0ZFTUFMRSdcclxufVxyXG5cclxuZW51bSBBdXRoVHlwZSB7XHJcbiAgRW1haWwgPSAnRU1BSUwnLFxyXG4gIEZhY2Vib29rID0gJ0ZBQ0VCT09LJyxcclxuICBHb29nbGUgPSAnR09PR0xFJyxcclxuICBBcHBsZSA9ICdBUFBMRScsXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyIGV4dGVuZHMgTW9kZWwge1xyXG4gIHB1YmxpYyBpZCE6IHN0cmluZztcclxuICBwdWJsaWMgZW1haWw6IHN0cmluZztcclxuICBwdWJsaWMgcGFzc3dvcmQ6IHN0cmluZztcclxuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyBuaWNrbmFtZTogc3RyaW5nO1xyXG4gIHB1YmxpYyB0aHVtYlVSTDogc3RyaW5nO1xyXG4gIHB1YmxpYyBwaG90b1VSTDogc3RyaW5nO1xyXG4gIHB1YmxpYyBiaXJ0aGRheTogRGF0ZTtcclxuICBwdWJsaWMgZ2VuZGVyOiBHZW5kZXI7XHJcbiAgcHVibGljIHBob25lOiBzdHJpbmc7XHJcbiAgcHVibGljIHNvY2lhbElkOiBzdHJpbmc7XHJcbiAgcHVibGljIGF1dGhUeXBlOiBBdXRoVHlwZTtcclxuICBwdWJsaWMgdmVyaWZpZWQ6IGJvb2xlYW47XHJcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0ZWRBdCE6IERhdGU7XHJcbiAgcHVibGljIHJlYWRvbmx5IHVwZGF0ZWRBdCE6IERhdGU7XHJcbiAgcHVibGljIHJlYWRvbmx5IGRlbGV0ZWRBdDogRGF0ZTtcclxufVxyXG5cclxuVXNlci5pbml0KFxyXG4gIHtcclxuICAgIGlkOiB7XHJcbiAgICAgIHR5cGU6IFVVSUQsXHJcbiAgICAgIGRlZmF1bHRWYWx1ZTogVVVJRFYxLFxyXG4gICAgICBhbGxvd051bGw6IGZhbHNlLFxyXG4gICAgICBwcmltYXJ5S2V5OiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGVtYWlsOiB7XHJcbiAgICAgIHR5cGU6IFNUUklORyxcclxuICAgIH0sXHJcbiAgICBwYXNzd29yZDoge1xyXG4gICAgICB0eXBlOiBTVFJJTkcsXHJcbiAgICAgIGFsbG93TnVsbDogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBuYW1lOiBTVFJJTkcsXHJcbiAgICBuaWNrbmFtZTogU1RSSU5HLFxyXG4gICAgZ2VuZGVyOiBFTlVNKCdNQUxFJywgJ0ZFTUFMRScpLFxyXG4gICAgdGh1bWJVcmw6IFNUUklORyxcclxuICAgIHBob3RvVVJMOiBTVFJJTkcsXHJcbiAgICBiaXJ0aGRheToge1xyXG4gICAgICB0eXBlOiBEQVRFT05MWSxcclxuICAgICAgZ2V0OiBmdW5jdGlvbigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBtb21lbnQudXRjKHRoaXMuZ2V0RGF0YVZhbHVlKCdyZWdEYXRlJykpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNvY2lhbElkOiBTVFJJTkcsXHJcbiAgICBhdXRoVHlwZTogRU5VTSgnRU1BSUwnLCAnRkFDRUJPT0snLCAnR09PR0xFJywgJ0FQUExFJyksXHJcbiAgICB2ZXJpZmllZDoge1xyXG4gICAgICB0eXBlOiBCT09MRUFOLFxyXG4gICAgICBkZWZhdWx0VmFsdWU6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHtcclxuICAgIHNlcXVlbGl6ZSxcclxuICAgIHRpbWVzdGFtcHM6IHRydWUsXHJcbiAgICBwYXJhbm9pZDogdHJ1ZSxcclxuICB9LFxyXG4pO1xyXG5cclxuVXNlci5oYXNNYW55KE5vdGlmaWNhdGlvbik7XHJcbk5vdGlmaWNhdGlvbi5iZWxvbmdzVG8oVXNlcik7XHJcblVzZXIuaGFzTWFueShQb3N0KTtcclxuUG9zdC5iZWxvbmdzVG8oVXNlcik7XHJcblxyXG5leHBvcnQgdHlwZSBVc2VyTW9kZWxTdGF0aWMgPSB0eXBlb2YgTW9kZWwgJiB7XHJcbiAgbmV3ICh2YWx1ZXM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgb3B0aW9ucz86IEJ1aWxkT3B0aW9ucyk6IFVzZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXIgYXMgVXNlck1vZGVsU3RhdGljO1xyXG4iLCJpbXBvcnQgTm90aWZpY2F0aW9uLCB7IE5vdGlmaWNhdGlvbk1vZGVsU3RhdGljIH0gZnJvbSAnLi9Ob3RpZmljYXRpb24nO1xyXG5pbXBvcnQgUG9zdCwgeyBQb3N0TW9kZWxTdGF0aWMgfSBmcm9tICcuL1Bvc3QnO1xyXG5pbXBvcnQgVXNlciwgeyBVc2VyTW9kZWxTdGF0aWMgfSBmcm9tICcuL1VzZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIE5vdGlmaWNhdGlvbixcclxuICBVc2VyLFxyXG4gIFBvc3QsXHJcbn07XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE1vZGVsVHlwZSB7XHJcbiAgVXNlcjogVXNlck1vZGVsU3RhdGljO1xyXG4gIFBvc3Q6IFBvc3RNb2RlbFN0YXRpYztcclxuICBOb3RpZmljYXRpb246IE5vdGlmaWNhdGlvbk1vZGVsU3RhdGljO1xyXG59XHJcbiIsImltcG9ydCBOb3RpZmljYXRpb24gZnJvbSAnLi9ub3RpZmljYXRpb24nO1xyXG5pbXBvcnQgVXNlciBmcm9tICcuL3VzZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlc29sdmVycyA9IFtcclxuICBOb3RpZmljYXRpb24sXHJcbiAgVXNlcixcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBOb3RpZmljYXRpb24sXHJcbiAgVXNlcixcclxufTtcclxuIiwiaW1wb3J0IHsgTm90aWZpY2F0aW9uLCBSZXNvbHZlcnMgfSBmcm9tICcuLi9nZW5lcmF0ZWQvZ3JhcGhxbCc7XHJcblxyXG5jb25zdCByZXNvbHZlcjogUmVzb2x2ZXJzID0ge1xyXG4gIE11dGF0aW9uOiB7XHJcbiAgICBhZGROb3RpZmljYXRpb25Ub2tlbjogYXN5bmMgKF8sIGFyZ3MsIHsgbW9kZWxzIH0pOiBQcm9taXNlPE5vdGlmaWNhdGlvbj4gPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgTm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24gfSA9IG1vZGVscztcclxuICAgICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhd2FpdCBOb3RpZmljYXRpb24uY3JlYXRlKFxyXG4gICAgICAgICAgYXJncy5ub3RpZmljYXRpb24sXHJcbiAgICAgICAgICB7IHJhdzogdHJ1ZSB9LFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgcmV0dXJuIG5vdGlmaWNhdGlvbjtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJlc29sdmVyO1xyXG4iLCJpbXBvcnQge1xyXG4gIEF1dGhQYXlsb2FkLFxyXG4gIE5vdGlmaWNhdGlvbixcclxuICBQb3N0LFxyXG4gIFJlc29sdmVycyxcclxuICBTb2NpYWxVc2VySW5wdXQsXHJcbiAgVXNlcixcclxufSBmcm9tICcuLi9nZW5lcmF0ZWQvZ3JhcGhxbCc7XHJcbmltcG9ydCB7IGVuY3J5cHRDcmVkZW50aWFsLCB2YWxpZGF0ZUNyZWRlbnRpYWwgfSBmcm9tICcuLi91dGlscy9hdXRoJztcclxuaW1wb3J0IHsgQXV0aGVudGljYXRpb25FcnJvciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItZXhwcmVzcyc7XHJcbmltcG9ydCB7IE1vZGVsVHlwZSB9IGZyb20gJy4uL21vZGVscyc7XHJcbmltcG9ydCB7IE9wIH0gZnJvbSAnc2VxdWVsaXplJztcclxuaW1wb3J0IHsgUm9sZSB9IGZyb20gJy4uL3R5cGVzJztcclxuaW1wb3J0IGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xyXG5pbXBvcnQgeyB3aXRoRmlsdGVyIH0gZnJvbSAnYXBvbGxvLXNlcnZlcic7XHJcblxyXG5jb25zdCBVU0VSX1NJR05FRF9JTiA9ICdVU0VSX1NJR05FRF9JTic7XHJcbmNvbnN0IFVTRVJfVVBEQVRFRCA9ICdVU0VSX1VQREFURUQnO1xyXG5cclxuY29uc3Qgc2lnbkluV2l0aFNvY2lhbEFjY291bnQgPSBhc3luYyAoXHJcbiAgc29jaWFsVXNlcjogU29jaWFsVXNlcklucHV0LFxyXG4gIG1vZGVsczogTW9kZWxUeXBlLFxyXG4gIGFwcFNlY3JldDogc3RyaW5nLFxyXG4pOiBQcm9taXNlPEF1dGhQYXlsb2FkPiA9PiB7XHJcbiAgY29uc3QgeyBVc2VyOiBVc2VyIH0gPSBtb2RlbHM7XHJcblxyXG4gIGlmIChzb2NpYWxVc2VyLmVtYWlsKSB7XHJcbiAgICBjb25zdCBlbWFpbFVzZXIgPSBhd2FpdCBVc2VyLmZpbmRPbmUoe1xyXG4gICAgICB3aGVyZToge1xyXG4gICAgICAgIGVtYWlsOiBzb2NpYWxVc2VyLmVtYWlsLFxyXG4gICAgICAgIHNvY2lhbElkOiB7IFtPcC5uZV06IHNvY2lhbFVzZXIuc29jaWFsSWQgfSxcclxuICAgICAgfSxcclxuICAgICAgcmF3OiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKGVtYWlsVXNlcikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VtYWlsIGZvciBjdXJyZW50IHVzZXIgaXMgYWxyZWFkeSBzaWduZWQgaW4nKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmRPckNyZWF0ZSh7XHJcbiAgICB3aGVyZTogeyBzb2NpYWxJZDogYCR7c29jaWFsVXNlci5zb2NpYWxJZH1gIH0sXHJcbiAgICBkZWZhdWx0czoge1xyXG4gICAgICBzb2NpYWxJZDogc29jaWFsVXNlci5zb2NpYWxJZCxcclxuICAgICAgYXV0aFR5cGU6IHNvY2lhbFVzZXIuYXV0aFR5cGUsXHJcbiAgICAgIGVtYWlsOiBzb2NpYWxVc2VyLmVtYWlsLFxyXG4gICAgICBuaWNrbmFtZTogc29jaWFsVXNlci5uYW1lLFxyXG4gICAgICBuYW1lOiBzb2NpYWxVc2VyLm5hbWUsXHJcbiAgICAgIGJpcnRoZGF5OiBzb2NpYWxVc2VyLmJpcnRoZGF5LFxyXG4gICAgICBnZW5kZXI6IHNvY2lhbFVzZXIuZ2VuZGVyLFxyXG4gICAgICBwaG9uZTogc29jaWFsVXNlci5waG9uZSxcclxuICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9KTtcclxuXHJcbiAgaWYgKCF1c2VyIHx8ICh1c2VyICYmIHVzZXJbMV0gPT09IGZhbHNlKSkge1xyXG4gICAgLy8gdXNlciBhbHJlYWR5IGV4aXN0c1xyXG4gIH1cclxuXHJcbiAgY29uc3QgdG9rZW46IHN0cmluZyA9IGp3dC5zaWduKFxyXG4gICAge1xyXG4gICAgICB1c2VySWQ6IHVzZXJbMF0uaWQsXHJcbiAgICAgIHJvbGU6IFJvbGUuVXNlcixcclxuICAgIH0sXHJcbiAgICBhcHBTZWNyZXQsXHJcbiAgKTtcclxuICByZXR1cm4geyB0b2tlbiwgdXNlcjogdXNlclswXSB9O1xyXG59O1xyXG5cclxuY29uc3QgcmVzb2x2ZXI6IFJlc29sdmVycyA9IHtcclxuICBRdWVyeToge1xyXG4gICAgdXNlcnM6IGFzeW5jIChfLCBhcmdzLCB7IGdldFVzZXIsIG1vZGVscyB9KTogUHJvbWlzZTxVc2VyW10+ID0+IHtcclxuICAgICAgY29uc3QgeyBVc2VyIH0gPSBtb2RlbHM7XHJcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRVc2VyKCk7XHJcbiAgICAgIGlmICghdXNlcikgdGhyb3cgbmV3IEF1dGhlbnRpY2F0aW9uRXJyb3IoJ1VzZXIgaXMgbm90IGxvZ2dlZCBpbicpO1xyXG4gICAgICByZXR1cm4gVXNlci5maW5kQWxsKCk7XHJcbiAgICB9LFxyXG4gICAgdXNlcjogKF8sIGFyZ3MsIHsgbW9kZWxzIH0pOiBQcm9taXNlPFVzZXI+ID0+IHtcclxuICAgICAgY29uc3QgeyBVc2VyIH0gPSBtb2RlbHM7XHJcbiAgICAgIHJldHVybiBVc2VyLmZpbmRPbmUoeyB3aGVyZTogYXJncyB9KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBNdXRhdGlvbjoge1xyXG4gICAgc2lnbkluRW1haWw6IGFzeW5jIChfLCBhcmdzLCB7IG1vZGVscywgYXBwU2VjcmV0LCBwdWJzdWIgfSk6IFByb21pc2U8QXV0aFBheWxvYWQ+ID0+IHtcclxuICAgICAgY29uc3QgeyBVc2VyOiBVc2VyIH0gPSBtb2RlbHM7XHJcblxyXG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHtcclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgZW1haWw6IGFyZ3MuZW1haWwsXHJcbiAgICAgICAgfSxcclxuICAgICAgICByYXc6IHRydWUsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKCF1c2VyKSB0aHJvdyBuZXcgQXV0aGVudGljYXRpb25FcnJvcignVXNlciBkb2VzIG5vdCBleHNpc3RzJyk7XHJcblxyXG4gICAgICBjb25zdCB2YWxpZGF0ZSA9IGF3YWl0IHZhbGlkYXRlQ3JlZGVudGlhbChhcmdzLnBhc3N3b3JkLCB1c2VyLnBhc3N3b3JkKTtcclxuXHJcbiAgICAgIGlmICghdmFsaWRhdGUpIHRocm93IG5ldyBBdXRoZW50aWNhdGlvbkVycm9yKCdQYXNzd29yZCBpcyBub3QgY29ycmVjdCcpO1xyXG5cclxuICAgICAgY29uc3QgdG9rZW46IHN0cmluZyA9IGp3dC5zaWduKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHVzZXJJZDogdXNlci5pZCxcclxuICAgICAgICAgIHJvbGU6IFJvbGUuVXNlcixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFwcFNlY3JldCxcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHB1YnN1Yi5wdWJsaXNoKFVTRVJfU0lHTkVEX0lOLCB7IHVzZXJTaWduZWRJbjogdXNlciB9KTtcclxuICAgICAgcmV0dXJuIHsgdG9rZW4sIHVzZXIgfTtcclxuICAgIH0sXHJcbiAgICBzaWduSW5Hb29nbGU6IGFzeW5jIChfLCB7IHNvY2lhbFVzZXIgfSwgeyBhcHBTZWNyZXQsIG1vZGVscyB9KTogUHJvbWlzZTxBdXRoUGF5bG9hZD4gPT5cclxuICAgICAgc2lnbkluV2l0aFNvY2lhbEFjY291bnQoc29jaWFsVXNlciwgbW9kZWxzLCBhcHBTZWNyZXQpLFxyXG5cclxuICAgIHNpZ25JbkZhY2Vib29rOiBhc3luYyAoXywgeyBzb2NpYWxVc2VyIH0sIHsgYXBwU2VjcmV0LCBtb2RlbHMgfSk6IFByb21pc2U8QXV0aFBheWxvYWQ+ID0+XHJcbiAgICAgIHNpZ25JbldpdGhTb2NpYWxBY2NvdW50KHNvY2lhbFVzZXIsIG1vZGVscywgYXBwU2VjcmV0KSxcclxuXHJcbiAgICBzaWduSW5BcHBsZTogYXN5bmMgKF8sIHsgc29jaWFsVXNlciB9LCB7IGFwcFNlY3JldCwgbW9kZWxzIH0pOiBQcm9taXNlPEF1dGhQYXlsb2FkPiA9PlxyXG4gICAgICBzaWduSW5XaXRoU29jaWFsQWNjb3VudChzb2NpYWxVc2VyLCBtb2RlbHMsIGFwcFNlY3JldCksXHJcbiAgICBzaWduVXA6IGFzeW5jIChfLCBhcmdzLCB7IGFwcFNlY3JldCwgbW9kZWxzIH0pOiBQcm9taXNlPEF1dGhQYXlsb2FkPiA9PiB7XHJcbiAgICAgIGNvbnN0IHsgVXNlcjogVXNlciB9ID0gbW9kZWxzO1xyXG5cclxuICAgICAgY29uc3QgZW1haWxVc2VyID0gYXdhaXQgVXNlci5maW5kT25lKHtcclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgZW1haWw6IGFyZ3MudXNlci5lbWFpbCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJhdzogdHJ1ZSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoZW1haWxVc2VyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbWFpbCBmb3IgY3VycmVudCB1c2VyIGlzIGFscmVhZHkgc2lnbmVkIHVwLicpO1xyXG4gICAgICB9XHJcbiAgICAgIGFyZ3MudXNlci5wYXNzd29yZCA9IGF3YWl0IGVuY3J5cHRDcmVkZW50aWFsKGFyZ3MudXNlci5wYXNzd29yZCk7XHJcbiAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBtb2RlbHMuVXNlci5jcmVhdGUoYXJncy51c2VyLCB7IHJhdzogdHJ1ZSB9KTtcclxuICAgICAgY29uc3QgdG9rZW46IHN0cmluZyA9IGp3dC5zaWduKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHVzZXJJZDogdXNlci5pZCxcclxuICAgICAgICAgIHJvbGU6IFJvbGUuVXNlcixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFwcFNlY3JldCxcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHJldHVybiB7IHRva2VuLCB1c2VyIH07XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUHJvZmlsZTogYXN5bmMgKF8sIGFyZ3MsIHsgZ2V0VXNlciwgbW9kZWxzLCBwdWJzdWIgfSk6IFByb21pc2U8VXNlcj4gPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGF1dGggPSBhd2FpdCBnZXRVc2VyKCk7XHJcbiAgICAgICAgaWYgKCFhdXRoKSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgQXV0aGVudGljYXRpb25FcnJvcihcclxuICAgICAgICAgICAgJ1VzZXIgaXMgbm90IGxvZ2dlZCBpbicsXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9kZWxzLlVzZXIudXBkYXRlKFxyXG4gICAgICAgICAgYXJncyxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICBpZDogYXV0aC5pZCxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IG1vZGVscy5Vc2VyLmZpbmRPbmUoe1xyXG4gICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgaWQ6IGF1dGguaWQsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcmF3OiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwdWJzdWIucHVibGlzaChVU0VSX1VQREFURUQsIHsgdXNlciB9KTtcclxuICAgICAgICByZXR1cm4gdXNlcjtcclxuICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBTdWJzY3JpcHRpb246IHtcclxuICAgIHVzZXJTaWduZWRJbjoge1xyXG4gICAgICAvLyBpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2Fwb2xsb2dyYXBocWwvZ3JhcGhxbC1zdWJzY3JpcHRpb25zL2lzc3Vlcy8xOTJcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcbiAgICAgIHN1YnNjcmliZTogKF8sIGFyZ3MsIHsgcHVic3ViIH0pID0+IHB1YnN1Yi5hc3luY0l0ZXJhdG9yKFVTRVJfU0lHTkVEX0lOKSxcclxuICAgIH0sXHJcbiAgICB1c2VyVXBkYXRlZDoge1xyXG4gICAgICBzdWJzY3JpYmU6IHdpdGhGaWx0ZXIoXHJcbiAgICAgICAgKF8sIGFyZ3MsIHsgcHVic3ViIH0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBwdWJzdWIuYXN5bmNJdGVyYXRvcihVU0VSX1VQREFURUQsIHsgdXNlcjogYXJncy51c2VyIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKHBheWxvYWQsIHsgdXNlcklkIH0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IHsgdXNlclVwZGF0ZWQ6IHVwZGF0ZWRVc2VyIH0gPSBwYXlsb2FkO1xyXG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZWRVc2VyLmlkID09PSB1c2VySWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBVc2VyOiB7XHJcbiAgICBub3RpZmljYXRpb25zOiAoXywgYXJncywgeyBtb2RlbHMgfSk6IFByb21pc2U8Tm90aWZpY2F0aW9uW10+ID0+IHtcclxuICAgICAgY29uc3QgeyBOb3RpZmljYXRpb246IG5vdGlmaWNhdGlvbk1vZGVsIH0gPSBtb2RlbHM7XHJcblxyXG4gICAgICByZXR1cm4gbm90aWZpY2F0aW9uTW9kZWwuZmluZEFsbCh7XHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgIHVzZXJJZDogXy5pZCxcclxuICAgICAgICB9LFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBwb3N0czogKF8sIGFyZ3MsIHsgbW9kZWxzIH0pOiBQcm9taXNlPFBvc3RbXT4gPT4ge1xyXG4gICAgICBjb25zdCB7IFBvc3Q6IHBvc3RNb2RlbCB9ID0gbW9kZWxzO1xyXG5cclxuICAgICAgcmV0dXJuIHBvc3RNb2RlbC5maW5kQWxsKHtcclxuICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgdXNlcklkOiBfLmlkLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcmVzb2x2ZXI7XHJcbiIsImltcG9ydCB7IEFwb2xsb1NlcnZlciB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXItbGFtYmRhJztcclxuaW1wb3J0IHsgcmVzb2x2ZXJzIH0gZnJvbSAnLi9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgeyBjcmVhdGVDb250ZXh0IH0gZnJvbSAnLi9jb250ZXh0JztcclxuaW1wb3J0IHsgaW1wb3J0U2NoZW1hIH0gZnJvbSAnZ3JhcGhxbC1pbXBvcnQnO1xyXG5cclxuY29uc3QgdHlwZURlZnMgPSBpbXBvcnRTY2hlbWEoJ3NjaGVtYXMvc2NoZW1hLmdyYXBocWwnKTtcclxuZXhwb3J0IGNvbnN0IGdyYXBocWxIYW5kbGVyID0gbmV3IEFwb2xsb1NlcnZlcih7XHJcbiAgdHlwZURlZnMsXHJcbiAgcmVzb2x2ZXJzLFxyXG4gIHBsYXlncm91bmQ6IHtlbmRwb2ludDogJy9kZXYvZ3JhcGhxbCd9LFxyXG4gIGNvbnRleHQ6IGNyZWF0ZUNvbnRleHRcclxufSkuY3JlYXRlSGFuZGxlcigpOyIsImV4cG9ydCBpbnRlcmZhY2UgSnd0VXNlciB7XHJcbiAgdXNlcklkOiBzdHJpbmc7XHJcbiAgcm9sZTogbnVtYmVyO1xyXG4gIGlhdDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBSb2xlIHtcclxuICBVc2VyLFxyXG4gIEFkbWluLFxyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgQXV0aCB7XHJcbiAgaWQ6IHN0cmluZztcclxuICByb2xlOiBSb2xlO1xyXG59XHJcbiIsImltcG9ydCB7IEp3dFVzZXIgfSBmcm9tICcuLi90eXBlcyc7XHJcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0LW5vZGVqcyc7XHJcbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcclxuXHJcbmNvbnN0IFNBTFRfUk9VTkQgPSAxMDtcclxuXHJcbmV4cG9ydCBjb25zdCB7IEpXVF9TRUNSRVQgPSAndW5kZWZpbmVkJyB9ID0gcHJvY2Vzcy5lbnY7XHJcblxyXG5leHBvcnQgY29uc3QgdmFsaWRhdGVFbWFpbCA9IChlbWFpbDogc3RyaW5nKTogYm9vbGVhbiA9PiB7XHJcbiAgY29uc3QgcmUgPSAvXigoW148PigpW1xcXVxcXFwuLDs6XFxzQFwiXSsoXFwuW148PigpW1xcXVxcXFwuLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoXFxbWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcXSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC87XHJcbiAgcmV0dXJuIHJlLnRlc3QoZW1haWwpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHZlcmlmeVVzZXIgPSAodG9rZW46IHN0cmluZyk6IEp3dFVzZXIgPT4ge1xyXG4gIHJldHVybiBqd3QudmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVUKSBhcyBKd3RVc2VyO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGVuY3J5cHRDcmVkZW50aWFsID0gYXN5bmMgKHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4gPT5cclxuICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBjb25zdCBTQUxUID0gYmNyeXB0LmdlblNhbHRTeW5jKFNBTFRfUk9VTkQpO1xyXG5cclxuICAgIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCBTQUxULCBudWxsLCAoZXJyLCBoYXNoKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XHJcbiAgICAgIH1cclxuICAgICAgcmVzb2x2ZShoYXNoKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlQ3JlZGVudGlhbCA9IGFzeW5jIChcclxuICB2YWx1ZTogc3RyaW5nLFxyXG4gIGhhc2hlZFZhbHVlOiBzdHJpbmcsXHJcbik6IFByb21pc2U8Ym9vbGVhbj4gPT4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gIGJjcnlwdC5jb21wYXJlKHZhbHVlLCBoYXNoZWRWYWx1ZSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIHJldHVybiByZWplY3QoZXJyKTtcclxuICAgIH1cclxuICAgIHJlc29sdmUocmVzKTtcclxuICB9KTtcclxufSk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXJcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFwb2xsby1zZXJ2ZXItZXhwcmVzc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXBvbGxvLXNlcnZlci1sYW1iZGFcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJjcnlwdC1ub2RlanNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImdyYXBocWwtaW1wb3J0XCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJncmFwaHFsLXN1YnNjcmlwdGlvbnNcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImpzb253ZWJ0b2tlblwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9tZW50XCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzZXF1ZWxpemVcIik7OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gbW9kdWxlIGV4cG9ydHMgbXVzdCBiZSByZXR1cm5lZCBmcm9tIHJ1bnRpbWUgc28gZW50cnkgaW5saW5pbmcgaXMgZGlzYWJsZWRcbi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xucmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9zZXJ2ZXIudHNcIik7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0E7Ozs7Ozs7Ozs7Ozs7O0FDdEJBO0FBRUE7QUFHQTtBQUNBO0FBRUE7QUFnQkE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQVJBO0FBVUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsQ0E7QUFDQTtBQUNBO0E7Ozs7Ozs7Ozs7QUMxQ0E7QUFDQTtBQUVBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7Ozs7OztBQ3BCQTtBQUVBO0FBRUE7QUFPQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0E7Ozs7Ozs7Ozs7Ozs7QUMxQ0E7QUFFQTtBQUVBO0FBT0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0E7Ozs7Ozs7Ozs7Ozs7O0FDckNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBaUJBO0FBakJBO0FBbUJBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0E7Ozs7Ozs7Ozs7Ozs7QUMzRkE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7OztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUtBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUFBO0FBRUE7QUFFQTtBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBR0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7Ozs7QUN6TkE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QTs7Ozs7Ozs7Ozs7QUNQQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBOzs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBWUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBQ0E7QUFDQTtBOzs7Ozs7OztBQy9CQTtBQUNBO0E7Ozs7Ozs7O0FDREE7QUFDQTtBOzs7Ozs7OztBQ0RBO0FBQ0E7QTs7Ozs7Ozs7QUNEQTtBQUNBO0E7Ozs7Ozs7O0FDREE7QUFDQTtBOzs7Ozs7OztBQ0RBO0FBQ0E7QTs7Ozs7Ozs7QUNEQTtBQUNBO0E7Ozs7Ozs7O0FDREE7QUFDQTtBOzs7Ozs7OztBQ0RBO0FBQ0E7QTs7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==