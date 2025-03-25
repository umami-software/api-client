import { createSecureToken, buildUrl, httpGet, httpPost, httpPut, httpDelete, hash } from 'next-basics';
import debug from 'debug';

var __assign = function () {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function __generator(thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1)
            throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f)
            throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _)
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                    return t;
                if (y = 0, t)
                    op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return { value: op[1], done: false };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2])
                            _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            }
            catch (e) {
                op = [6, e];
                y = 0;
            }
            finally {
                f = t = 0;
            }
        if (op[0] & 5)
            throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var log = debug('umami:api-client');
var API_KEY_HEADER = 'x-umami-api-key';
var UmamiApiClient = (function () {
    function UmamiApiClient(options) {
        var userId = options.userId, secret = options.secret, _a = options.apiEndpoint, apiEndpoint = _a === void 0 ? '' : _a, apiKey = options.apiKey;
        this.apiEndpoint = apiEndpoint;
        this.secret = hash(secret);
        this.apiKey = apiKey;
        if (userId) {
            this.setAuthToken({ userId: userId });
        }
    }
    UmamiApiClient.prototype.setAuthToken = function (data) {
        this.authToken = createSecureToken(data, this.secret);
    };
    UmamiApiClient.prototype.setSecret = function (secret) {
        this.secret = secret;
    };
    UmamiApiClient.prototype.setApiEndPoint = function (url) {
        this.apiEndpoint = url;
    };
    UmamiApiClient.prototype.getHeaders = function (headers) {
        if (headers === void 0) { headers = {}; }
        if (this.authToken) {
            headers.authorization = "Bearer ".concat(this.authToken);
        }
        if (this.apiKey) {
            headers[API_KEY_HEADER] = this.apiKey;
        }
        return headers;
    };
    UmamiApiClient.prototype.get = function (url, params, headers) {
        var dest = buildUrl("".concat(this.apiEndpoint, "/").concat(url), params);
        log("GET ".concat(dest), params, headers);
        return httpGet(dest, undefined, __assign({}, this.getHeaders(headers)));
    };
    UmamiApiClient.prototype.post = function (url, data, headers) {
        var dest = "".concat(this.apiEndpoint, "/").concat(url);
        log("POST ".concat(dest), data, headers);
        return httpPost(dest, data, this.getHeaders(headers));
    };
    UmamiApiClient.prototype.put = function (url, params, headers) {
        var dest = "".concat(this.apiEndpoint, "/").concat(url);
        log("PUT ".concat(dest), params, headers);
        return httpPut(dest, params, this.getHeaders(headers));
    };
    UmamiApiClient.prototype.del = function (url, params, headers) {
        var dest = buildUrl("".concat(this.apiEndpoint, "/").concat(url), params);
        log("DELETE ".concat(dest), params, headers);
        return httpDelete(dest, undefined, this.getHeaders(headers));
    };
    UmamiApiClient.prototype.createUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("users", data)];
            });
        });
    };
    UmamiApiClient.prototype.getUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("users/".concat(userId))];
            });
        });
    };
    UmamiApiClient.prototype.getUsers = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("users", params)];
            });
        });
    };
    UmamiApiClient.prototype.getUserUsage = function (userId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("users/".concat(userId, "/usage"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getUserTeams = function (userId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("users/".concat(userId, "/teams"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getUserWebsites = function (userId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("users/".concat(userId, "/websites"), params)];
            });
        });
    };
    UmamiApiClient.prototype.deleteUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.del("users/".concat(userId))];
            });
        });
    };
    UmamiApiClient.prototype.updateUser = function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("users/".concat(userId), data)];
            });
        });
    };
    UmamiApiClient.prototype.getShare = function (shareId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("share/".concat(shareId))];
            });
        });
    };
    UmamiApiClient.prototype.getReport = function (reportId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("reports/".concat(reportId))];
            });
        });
    };
    UmamiApiClient.prototype.updateReport = function (reportId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports/".concat(reportId), data)];
            });
        });
    };
    UmamiApiClient.prototype.deleteReport = function (reportId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.del("reports/".concat(reportId))];
            });
        });
    };
    UmamiApiClient.prototype.getReports = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("reports", params)];
            });
        });
    };
    UmamiApiClient.prototype.createReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports", data)];
            });
        });
    };
    UmamiApiClient.prototype.createWebsite = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("websites", data)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsite = function (websiteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId))];
            });
        });
    };
    UmamiApiClient.prototype.updateWebsite = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("websites/".concat(websiteId), params)];
            });
        });
    };
    UmamiApiClient.prototype.deleteWebsite = function (websiteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.del("websites/".concat(websiteId))];
            });
        });
    };
    UmamiApiClient.prototype.resetWebsite = function (websiteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("websites/".concat(websiteId, "/reset"))];
            });
        });
    };
    UmamiApiClient.prototype.getWebsites = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites", params)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteActive = function (websiteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/active"))];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteReports = function (websiteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/reports"))];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteValues = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/values"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteEvents = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/events"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteSessions = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/sessions"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteSessionStats = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/sessions/stats"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteSession = function (websiteId, sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/sessions/").concat(sessionId))];
            });
        });
    };
    UmamiApiClient.prototype.getSessionActivity = function (websiteId, sessionId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/sessions/").concat(sessionId, "/activity"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getSessionData = function (websiteId, sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/sessions/").concat(sessionId, "/properties"))];
            });
        });
    };
    UmamiApiClient.prototype.getEventMetrics = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/events/series"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteMetrics = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/metrics"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsitePageviews = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/pageviews"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getWebsiteStats = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/stats"), params)];
            });
        });
    };
    UmamiApiClient.prototype.createTeam = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("teams", data)];
            });
        });
    };
    UmamiApiClient.prototype.getTeam = function (teamId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("teams/".concat(teamId))];
            });
        });
    };
    UmamiApiClient.prototype.getTeams = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("teams", params)];
            });
        });
    };
    UmamiApiClient.prototype.joinTeam = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("teams/join", data)];
            });
        });
    };
    UmamiApiClient.prototype.getTeamUsers = function (teamId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("teams/".concat(teamId, "/users"), params)];
            });
        });
    };
    UmamiApiClient.prototype.getTeamUser = function (teamId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("teams/".concat(teamId, "/users/").concat(userId))];
            });
        });
    };
    UmamiApiClient.prototype.createTeamUser = function (teamId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("teams/".concat(teamId, "/users"), data)];
            });
        });
    };
    UmamiApiClient.prototype.updateTeamMember = function (teamId, userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("teams/".concat(teamId, "/users/").concat(userId), data)];
            });
        });
    };
    UmamiApiClient.prototype.deleteTeamUser = function (teamId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.del("teams/".concat(teamId, "/users/").concat(userId))];
            });
        });
    };
    UmamiApiClient.prototype.getTeamWebsites = function (teamId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("teams/".concat(teamId, "/websites"), params)];
            });
        });
    };
    UmamiApiClient.prototype.createTeamWebsite = function (teamId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("teams/".concat(teamId, "/websites"), data)];
            });
        });
    };
    UmamiApiClient.prototype.deleteTeamWebsite = function (teamId, websiteId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.del("teams/".concat(teamId, "/websites/").concat(websiteId))];
            });
        });
    };
    UmamiApiClient.prototype.updateTeam = function (teamId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("teams/".concat(teamId), data)];
            });
        });
    };
    UmamiApiClient.prototype.deleteTeam = function (teamId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.del("teams/".concat(teamId))];
            });
        });
    };
    UmamiApiClient.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post('auth/login', { username: username, password: password })];
            });
        });
    };
    UmamiApiClient.prototype.verify = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get('auth/verify')];
            });
        });
    };
    UmamiApiClient.prototype.getMe = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get('me')];
            });
        });
    };
    UmamiApiClient.prototype.getMyWebsites = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get('me/websites', params)];
            });
        });
    };
    UmamiApiClient.prototype.getMyTeams = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get('me/teams', params)];
            });
        });
    };
    UmamiApiClient.prototype.updateMyPassword = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post('me/password', data)];
            });
        });
    };
    UmamiApiClient.prototype.getRealtime = function (websiteId, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("realtime/".concat(websiteId), data)];
            });
        });
    };
    UmamiApiClient.prototype.getEventDataEvents = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/event-data/events"), __assign({ websiteId: websiteId }, params))];
            });
        });
    };
    UmamiApiClient.prototype.getEventDataStats = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/event-data/stats"), __assign({ websiteId: websiteId }, params))];
            });
        });
    };
    UmamiApiClient.prototype.getEventDataValues = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/event-data/values"), __assign({ websiteId: websiteId }, params))];
            });
        });
    };
    UmamiApiClient.prototype.getEventDataFields = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/event-data/fields"), __assign({ websiteId: websiteId }, params))];
            });
        });
    };
    UmamiApiClient.prototype.getSessionDataProperties = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/session-data/properties"), __assign({ websiteId: websiteId }, params))];
            });
        });
    };
    UmamiApiClient.prototype.getSessionDataValues = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get("websites/".concat(websiteId, "/session-data/values"), __assign({ websiteId: websiteId }, params))];
            });
        });
    };
    UmamiApiClient.prototype.transferWebsite = function (websiteId, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("websites/".concat(websiteId, "/transfer"), __assign({ websiteId: websiteId }, params))];
            });
        });
    };
    UmamiApiClient.prototype.runFunnelReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports/funnel", data)];
            });
        });
    };
    UmamiApiClient.prototype.runInsightsReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports/insights", data)];
            });
        });
    };
    UmamiApiClient.prototype.runRetentionReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports/retention", data)];
            });
        });
    };
    UmamiApiClient.prototype.runUTMReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports/utm", data)];
            });
        });
    };
    UmamiApiClient.prototype.runGoalsReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports/goals", data)];
            });
        });
    };
    UmamiApiClient.prototype.runJourneyReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports/journey", data)];
            });
        });
    };
    UmamiApiClient.prototype.runRevenueReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.post("reports/revenue", data)];
            });
        });
    };
    UmamiApiClient.prototype.send = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var type, payload;
            return __generator(this, function (_a) {
                type = data.type, payload = data.payload;
                return [2, this.post('send', { type: type, payload: payload })];
            });
        });
    };
    UmamiApiClient.prototype.config = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get('config')];
            });
        });
    };
    UmamiApiClient.prototype.heartbeat = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.get('heartbeat')];
            });
        });
    };
    UmamiApiClient.prototype.executeRoute = function (url, method, data) {
        return __awaiter(this, void 0, void 0, function () {
            var routes, route, key;
            var _this = this;
            return __generator(this, function (_a) {
                routes = [
                    {
                        path: /^admin\/users$/,
                        get: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.getUsers(data)];
                        }); }); },
                    },
                    {
                        path: /^admin\/websites$/,
                        get: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.getWebsites(data)];
                        }); }); },
                    },
                    {
                        path: /^me$/,
                        get: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2, this.getMe()];
                        }); }); },
                    },
                    {
                        path: /^me\/password$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.updateMyPassword(data)];
                        }); }); },
                    },
                    {
                        path: /^me\/teams$/,
                        get: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.getMyTeams(data)];
                        }); }); },
                    },
                    {
                        path: /^me\/websites$/,
                        get: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.getMyWebsites(data)];
                        }); }); },
                    },
                    {
                        path: /^realtime\/[0-9a-f-]+$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getRealtime(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^reports\/[0-9a-f-]+$/,
                        get: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getReport(id)];
                            }); });
                        },
                        post: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.updateReport(id, data)];
                            }); });
                        },
                        delete: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.deleteReport(id)];
                            }); });
                        },
                    },
                    {
                        path: /^reports$/,
                        get: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.getReports(data)];
                        }); }); },
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.createReport(data)];
                        }); }); },
                    },
                    {
                        path: /^reports\/funnel$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.runFunnelReport(data)];
                        }); }); },
                    },
                    {
                        path: /^reports\/insight$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.runInsightsReport(data)];
                        }); }); },
                    },
                    {
                        path: /^reports\/retention$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.runRetentionReport(data)];
                        }); }); },
                    },
                    {
                        path: /^reports\/revenue$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.runRevenueReport(data)];
                        }); }); },
                    },
                    {
                        path: /^reports\/utm$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.runUTMReport(data)];
                        }); }); },
                    },
                    {
                        path: /^reports\/goals$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.runGoalsReport(data)];
                        }); }); },
                    },
                    {
                        path: /^reports\/journey$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.runJourneyReport(data)];
                        }); }); },
                    },
                    {
                        path: /^teams$/,
                        get: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.getTeams(data)];
                        }); }); },
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.createTeam(data)];
                        }); }); },
                    },
                    {
                        path: /^teams\/join$/,
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.joinTeam(data)];
                        }); }); },
                    },
                    {
                        path: /^teams\/[0-9a-f-]+$/,
                        get: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getTeam(id)];
                            }); });
                        },
                        post: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.updateTeam(id, data)];
                            }); });
                        },
                        delete: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.deleteTeam(id)];
                            }); });
                        },
                    },
                    {
                        path: /^teams\/[0-9a-f-]+\/users$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getTeamUsers(id, data)];
                            }); });
                        },
                        post: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.createTeamUser(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^teams\/[0-9a-f-]+\/users\/[0-9a-f-]+$/,
                        get: function (_a) {
                            var teamId = _a[1], userId = _a[3];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getTeamUser(teamId, userId)];
                            }); });
                        },
                        post: function (_a, data) {
                            var teamId = _a[1], userId = _a[3];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.updateTeamMember(teamId, userId, data)];
                            }); });
                        },
                        delete: function (_a) {
                            var teamId = _a[1], userId = _a[3];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.deleteTeamUser(teamId, userId)];
                            }); });
                        },
                    },
                    {
                        path: /^teams\/[0-9a-f-]+\/websites$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getTeamWebsites(id, data)];
                            }); });
                        },
                        post: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.createTeamWebsite(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^users$/,
                        get: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.getUsers(data)];
                        }); }); },
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.createUser(data)];
                        }); }); },
                    },
                    {
                        path: /^users\/[0-9a-f-]+$/,
                        get: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getUser(id)];
                            }); });
                        },
                        post: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.updateUser(id, data)];
                            }); });
                        },
                        delete: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.deleteUser(id)];
                            }); });
                        },
                    },
                    {
                        path: /^users\/[0-9a-f-]+\/teams$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getUserTeams(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^users\/[0-9a-f-]+\/websites$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getUserWebsites(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^users\/[0-9a-f-]+\/usage$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getUserUsage(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites$/,
                        get: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.getWebsites(data)];
                        }); }); },
                        post: function (_a, data) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                            return [2, this.createWebsite(data)];
                        }); }); },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+$/,
                        get: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsite(id)];
                            }); });
                        },
                        post: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.updateWebsite(id, data)];
                            }); });
                        },
                        delete: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.deleteWebsite(id)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/active$/,
                        get: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsiteActive(id)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/daterange$/,
                        get: function (_a) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsiteActive(id)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/event-data\/events$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getEventDataEvents(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/event-data\/stats$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getEventDataStats(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/event-data\/values$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getEventDataValues(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/event-data\/fields$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getEventDataFields(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/events$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsiteEvents(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/events\/series$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getEventMetrics(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/metrics$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsiteMetrics(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/pageviews$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsitePageviews(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/reports$/,
                        post: function (_a) {
                            var id = _a[1];
                            return _this.getWebsiteReports(id);
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/reset$/,
                        post: function (_a) {
                            var id = _a[1];
                            return _this.resetWebsite(id);
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/session-data\/properties$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getSessionDataProperties(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/session-data\/values$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getSessionDataValues(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/sessions$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsiteSessions(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/sessions\/stats$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsiteSessionStats(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/sessions\/[0-9a-f-]+$/,
                        get: function (_a) {
                            var websiteId = _a[1], sessionId = _a[3];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsiteSession(websiteId, sessionId)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/sessions\/[0-9a-f-]+\/activity$/,
                        get: function (_a, data) {
                            var websiteId = _a[1], sessionId = _a[3];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getSessionActivity(websiteId, sessionId, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/sessions\/[0-9a-f-]+\/properties$/,
                        get: function (_a) {
                            var websiteId = _a[1], sessionId = _a[3];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getSessionData(websiteId, sessionId)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/stats$/,
                        get: function (_a, data) {
                            var id = _a[1];
                            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                return [2, this.getWebsiteStats(id, data)];
                            }); });
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/transfer$/,
                        post: function (_a, data) {
                            var id = _a[1];
                            return _this.transferWebsite(id, data);
                        },
                    },
                    {
                        path: /^websites\/[0-9a-f-]+\/values$/,
                        pogetst: function (_a, data) {
                            var id = _a[1];
                            return _this.getWebsiteValues(id, data);
                        },
                    },
                ];
                route = routes.find(function (_a) {
                    var path = _a.path;
                    return url.match(path);
                });
                key = method.toLowerCase();
                if (route && route[key]) {
                    return [2, route[key](url.split('/'), data)];
                }
                return [2, { ok: false, status: 404, error: { status: 404, message: "Not Found: ".concat(url) } }];
            });
        });
    };
    return UmamiApiClient;
}());

function getClient(params) {
    var _a = params || {}, _b = _a.userId, userId = _b === void 0 ? process.env.UMAMI_API_CLIENT_USER_ID : _b, _c = _a.secret, secret = _c === void 0 ? process.env.UMAMI_API_CLIENT_SECRET : _c, _d = _a.apiEndpoint, apiEndpoint = _d === void 0 ? process.env.UMAMI_API_CLIENT_ENDPOINT : _d, _e = _a.apiKey, apiKey = _e === void 0 ? process.env.UMAMI_API_KEY : _e;
    return new UmamiApiClient({
        userId: userId,
        secret: secret,
        apiEndpoint: apiEndpoint,
        apiKey: apiKey,
    });
}

export { API_KEY_HEADER, UmamiApiClient, getClient, log };
