import { ApiResponse } from "next-basics";
declare namespace Umami {
    interface User {
        id: string;
        username: string;
        isAdmin: boolean;
        createdAt: string;
    }
    interface Website {
        id: string;
        userId: string;
        revId: number;
        name: string;
        domain: string;
        shareId: string;
        createdAt: Date;
    }
    interface Report {
        id: string;
        userId: string;
        websiteId: string;
        type: string;
        name: string;
        description: string;
        parameters: string;
        createdAt: Date;
        updatedAt: Date;
    }
    interface Team {
        id: string;
        name: string;
        createdAt: string;
    }
    interface TeamUser {
        id: string;
        teamId: string;
        userId: string;
        role: string;
        createdAt: Date;
    }
    interface Share {
        id: string;
        token: string;
    }
    interface WebsiteActive {
        x: number;
    }
    interface WebsiteMetric {
        x: string;
        y: number;
    }
    interface WebsiteEventMetric {
        x: string;
        t: string;
        y: number;
    }
    interface WebsitePageviews {
        pageviews: {
            t: string;
            y: number;
        };
        sessions: {
            t: string;
            y: number;
        };
    }
    interface WebsiteStats {
        pageviews: {
            value: number;
            prev: number;
        };
        visitors: {
            value: number;
            prev: number;
        };
        visits: {
            value: number;
            prev: number;
        };
        bounces: {
            value: number;
            prev: number;
        };
        totaltime: {
            value: number;
            prev: number;
        };
    }
    interface WebsiteSessionStats {
        countries: {
            value: number;
        };
        events: {
            value: number;
        };
        pageviews: {
            value: number;
        };
        visitors: {
            value: number;
        };
        visits: {
            value: number;
        };
    }
    interface RealtimeInit {
        websites: Website[];
        token: string;
        data: RealtimeUpdate;
    }
    interface RealtimeUpdate {
        pageviews: any[];
        sessions: any[];
        events: any[];
        timestamp: number;
    }
    interface SessionActivity {
        createdAt: Date;
        urlPath: string;
        urlQuery: string;
        referrerDomain: string;
        eventId: string;
        eventType: number;
        eventName: string;
        visitId: string;
    }
    interface SessionData {
        websiteId: string;
        sessionId: string;
        dataKey: string;
        dataType: string;
        stringValue: string;
        numberValue: number;
        dateValue: Date;
        createdAt: Date;
    }
    interface WebsiteEvent {
        id: string;
        websiteId: string;
        sessionId: string;
        createdAt: Date;
        urlPath: string;
        urlQuery: string;
        referrerPath: string;
        referrerQuery: string;
        referrerDomain: string;
        pageTitle: string;
        eventType: number;
        eventName: string;
    }
    interface WebsiteSession {
        id: string;
        websiteId: string;
        hostname: string;
        browser: string;
        os: string;
        device: string;
        screen: string;
        language: string;
        country: string;
        subdivision1: string;
        city: string;
        firstAt: Date;
        lastAt: Date;
        visits: number;
        views: number;
        events?: number;
        toataltime?: number;
        createdAt: Date;
    }
    interface WebsiteEventData {
        eventName: string;
        propertyName: string;
        dataType: number;
        propertyValue?: string;
        total: number;
    }
    interface WebsiteEventDataStats {
        events: number;
        properties: number;
        records: number;
    }
    interface WebsiteSessionData {
        propertyName: string;
        total: number;
    }
    interface WebsiteDataField {
        propertyName: string;
        dataType: number;
        value: string;
        total: number;
    }
    interface WebsiteDataValue {
        value: string;
        total: number;
    }
    interface Empty {
    }
    interface WebsiteSearchParams extends SearchParams {
        userId?: string;
        teamId?: string;
        includeTeams?: boolean;
    }
    interface UserSearchParams extends SearchParams {
        teamId?: string;
    }
    interface TeamSearchParams extends SearchParams {
        userId?: string;
    }
    interface ReportSearchParams extends SearchParams {
        userId?: string;
        websiteId?: string;
    }
    interface SearchParams {
        search?: string;
        page?: number;
        pageSize?: number;
        orderBy?: string;
        sortDescending?: boolean;
    }
    interface SearchResult<T> {
        data: T;
        count: number;
        pageSize: number;
        page: number;
        orderBy?: string;
    }
}
declare const log: any;
declare const API_KEY_HEADER = "x-umami-api-key";
interface UmamiApiClientOptions {
    userId?: string;
    secret?: string;
    apiEndpoint?: string;
    apiKey?: string;
}
declare class UmamiApiClient {
    apiEndpoint: string;
    secret: string;
    authToken?: string;
    apiKey?: string;
    constructor(options: UmamiApiClientOptions);
    setAuthToken(data: object): void;
    setSecret(secret: string): void;
    setApiEndPoint(url: string): void;
    getHeaders(headers?: any): any;
    get(url: string, params?: object, headers?: object): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    post(url: string, data?: object, headers?: object): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    put(url: string, params?: object, headers?: object): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    del(url: string, params?: object, headers?: object): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    createUser(data: {
        id?: string;
        username: string;
        password: string;
        role?: string;
    }): Promise<ApiResponse<Umami.User>>;
    getUser(userId: string): Promise<ApiResponse<Umami.User>>;
    getUsers(params: Umami.UserSearchParams): Promise<ApiResponse<Umami.SearchResult<Umami.User[]>>>;
    getUserUsage(userId: string, params: {
        startAt: number;
        endAt: number;
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    getUserTeams(userId: string, params?: Umami.TeamSearchParams): Promise<ApiResponse<Umami.SearchResult<Umami.Team[]>>>;
    getUserWebsites(userId: string, params?: Umami.WebsiteSearchParams): Promise<ApiResponse<Umami.SearchResult<Umami.Website[]>>>;
    deleteUser(userId: string): Promise<ApiResponse<Umami.Empty>>;
    updateUser(userId: string, data: {
        username: string;
        password: string;
    }): Promise<ApiResponse<Umami.User>>;
    getShare(shareId: string): Promise<ApiResponse<Umami.Share>>;
    getReport(reportId: any): Promise<ApiResponse<Umami.Report>>;
    updateReport(reportId: any, data: {
        websiteId: string;
        type: string;
        name: string;
        description: string;
        parameters: string;
    }): Promise<ApiResponse<Umami.Report>>;
    deleteReport(reportId: any): Promise<ApiResponse<Umami.Report>>;
    getReports(params?: Umami.SearchParams): Promise<ApiResponse<SearchResult<Umami.Report[]>>>;
    createReport(data: {
        websiteId: string;
        name: string;
        type: string;
        description: string;
        parameters: {
            [key: string]: any;
        };
    }): Promise<ApiResponse<Umami.Report>>;
    createWebsite(data: {
        name: string;
        domain: string;
    }): Promise<ApiResponse<Umami.Website>>;
    getWebsite(websiteId: string): Promise<ApiResponse<Umami.Website>>;
    updateWebsite(websiteId: string, params: {
        name: string;
        domain: string;
        shareId: string;
    }): Promise<ApiResponse<Umami.Empty>>;
    deleteWebsite(websiteId: string): Promise<ApiResponse<Umami.Empty>>;
    resetWebsite(websiteId: string): Promise<ApiResponse<Umami.Empty>>;
    getWebsites(params?: Umami.WebsiteSearchParams): Promise<ApiResponse<Umami.SearchResult<Umami.Website[]>>>;
    getWebsiteActive(websiteId: string): Promise<ApiResponse<Umami.WebsiteActive>>;
    getWebsiteReports(websiteId: string): Promise<ApiResponse<Umami.Report[]>>;
    getWebsiteValues(websiteId: string, params: {
        startAt: number;
        endAt: number;
    }): Promise<ApiResponse<any>>;
    getWebsiteEvents(websiteId: string, params: {
        startAt: string;
        endAt: string;
        query?: string;
    }): Promise<ApiResponse<SearchResult<Umami.WebsiteEvent[]>>>;
    getWebsiteSessions(websiteId: string, params: {
        startAt: string;
        endAt: string;
    }): Promise<ApiResponse<SearchResult<Umami.WebsiteSession[]>>>;
    getWebsiteSessionStats(websiteId: string, params: {
        startAt: string;
        endAt: string;
        url?: string;
        referrer?: string;
        title?: string;
        query?: string;
        event?: string;
        host?: string;
        os?: string;
        browser?: string;
        device?: string;
        country?: string;
        region?: string;
        city?: string;
    }): Promise<ApiResponse<Umami.WebsiteSessionStats>>;
    getWebsiteSession(websiteId: string, sessionId: string): Promise<ApiResponse<SearchResult<Umami.WebsiteSession>>>;
    getSessionActivity(websiteId: string, sessionId: string, params: {
        startAt: string;
        endAt: string;
    }): Promise<ApiResponse<SearchResult<Umami.SessionActivity[]>>>;
    getSessionData(websiteId: string, sessionId: string): Promise<ApiResponse<SearchResult<Umami.SessionData[]>>>;
    getEventMetrics(websiteId: string, params: {
        startAt: string;
        endAt: string;
        unit: string;
        timezone: string;
        url?: string;
        referrer?: string;
        title?: string;
        host?: string;
        os?: string;
        browser?: string;
        device?: string;
        country?: string;
        region?: string;
        city?: string;
    }): Promise<ApiResponse<Umami.WebsiteEventMetric[]>>;
    getWebsiteMetrics(websiteId: string, params: {
        type: string;
        startAt: number;
        endAt: number;
        url?: string;
        referrer?: string;
        title?: string;
        query?: string;
        event?: string;
        os?: string;
        browser?: string;
        device?: string;
        country?: string;
        region?: string;
        city?: string;
        limit?: number;
        tag?: string;
    }): Promise<ApiResponse<SearchResult<Umami.WebsiteMetric[]>>>;
    getWebsitePageviews(websiteId: string, params: {
        startAt: number;
        endAt: number;
        unit: string;
        timezone: string;
        url?: string;
        referrer?: string;
        title?: string;
        os?: string;
        browser?: string;
        device?: string;
        country?: string;
        region?: string;
        city?: string;
    }): Promise<ApiResponse<Umami.WebsitePageviews>>;
    getWebsiteStats(websiteId: string, params: {
        startAt: number;
        endAt: number;
        url?: string;
        referrer?: string;
        title?: string;
        query?: string;
        event?: string;
        os?: string;
        browser?: string;
        device?: string;
        country?: string;
        region?: string;
        city?: string;
    }): Promise<ApiResponse<Umami.WebsiteStats>>;
    createTeam(data: {
        name: string;
        domain: string;
    }): Promise<ApiResponse<Umami.Team>>;
    getTeam(teamId: string): Promise<ApiResponse<Umami.Team>>;
    getTeams(params?: Umami.TeamSearchParams): Promise<ApiResponse<SearchResult<Umami.Team[]>>>;
    joinTeam(data: {
        accessCode: string;
    }): Promise<ApiResponse<Umami.Team>>;
    getTeamUsers(teamId: string, params?: Umami.UserSearchParams): Promise<ApiResponse<SearchResult<Umami.User[]>>>;
    getTeamUser(teamId: string, userId: string): Promise<ApiResponse<Umami.User>>;
    createTeamUser(teamId: string, data: {
        userId: string;
        role: string;
    }): Promise<ApiResponse<Umami.TeamUser>>;
    updateTeamMember(teamId: string, userId: string, data: {
        role: string;
    }): Promise<ApiResponse<Umami.TeamUser>>;
    deleteTeamUser(teamId: string, userId: string): Promise<ApiResponse<Umami.Empty>>;
    getTeamWebsites(teamId: string, params?: Umami.WebsiteSearchParams): Promise<ApiResponse<Umami.SearchResult<Umami.SearchResult<Umami.Website[]>>>>;
    createTeamWebsite(teamId: string, data: {
        name: string;
        domain: string;
        shareId: string;
    }): Promise<ApiResponse<Umami.Team>>;
    deleteTeamWebsite(teamId: string, websiteId: string): Promise<ApiResponse<Umami.Empty>>;
    updateTeam(teamId: string, data: {
        name: string;
        accessCode: string;
    }): Promise<ApiResponse<Umami.Empty>>;
    deleteTeam(teamId: string): Promise<ApiResponse<Umami.Empty>>;
    login(username: string, password: string): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    verify(): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    getMe(): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    getMyWebsites(params?: Umami.WebsiteSearchParams): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    getMyTeams(params?: Umami.TeamSearchParams): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    updateMyPassword(data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    getRealtime(websiteId: string, data: {
        startAt: number;
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    getEventDataEvents(websiteId: string, params: {
        startAt: number;
        endAt: number;
        event?: string;
    }): Promise<ApiResponse<Umami.WebsiteEventData[]>>;
    getEventDataStats(websiteId: string, params: {
        startAt: number;
        endAt: number;
    }): Promise<ApiResponse<Umami.WebsiteEventDataStats>>;
    getEventDataValues(websiteId: string, params: {
        startAt: number;
        endAt: number;
        eventName: string;
        propertyName: string;
    }): Promise<ApiResponse<Umami.WebsiteDataValue[]>>;
    getEventDataFields(websiteId: string, params: {
        startAt: number;
        endAt: number;
    }): Promise<ApiResponse<Umami.WebsiteDataField[]>>;
    getSessionDataProperties(websiteId: string, params: {
        startAt: number;
        endAt: number;
    }): Promise<ApiResponse<Umami.WebsiteSessionData[]>>;
    getSessionDataValues(websiteId: string, params: {
        startAt: number;
        endAt: number;
        eventName: string;
        propertyName: string;
    }): Promise<ApiResponse<Umami.WebsiteDataValue[]>>;
    transferWebsite(websiteId: string, params: {
        userId?: string;
        teamId?: string;
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    runFunnelReport(data: {
        websiteId: string;
        urls: string[];
        window: number;
        dateRange: {
            startDate: string;
            endDate: string;
        };
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    runInsightsReport(data: {
        websiteId: string;
        dateRange: {
            startDate: string;
            endDate: string;
        };
        fields: {
            name: string;
            type: string;
            label: string;
        }[];
        filters: {
            name: string;
            type: string;
            filter: string;
            value: string;
        }[];
        groups: {
            name: string;
            type: string;
        }[];
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    runRetentionReport(data: {
        websiteId: string;
        dateRange: {
            startDate: string;
            endDate: string;
            timezone: string;
        };
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    runUTMReport(data: {
        websiteId: string;
        dateRange: {
            startDate: string;
            endDate: string;
        };
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    runGoalsReport(data: {
        websiteId: string;
        dateRange: {
            startDate: string;
            endDate: string;
        };
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    runJourneyReport(data: {
        websiteId: string;
        dateRange: {
            startDate: string;
            endDate: string;
        };
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    runRevenueReport(data: {
        websiteId: string;
        dateRange: {
            startDate: string;
            endDate: string;
        };
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    send(data: {
        type: "event";
        payload: {
            data: {
                [key: string]: any;
            };
            hostname: string;
            language: string;
            referrer: string;
            screen: string;
            title: string;
            url: string;
            website: string;
            name: string;
        };
    }): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    config(): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    heartbeat(): Promise<{
        ok: boolean;
        status: number;
        data?: any;
        error?: any;
    }>;
    executeRoute(url: string, method: string, data: any): Promise<ApiResponse<any>>;
}
declare function getClient(params?: {
    userId?: string;
    secret?: string;
    apiEndpoint?: string;
    apiKey?: string;
}): UmamiApiClient;
export { getClient, User, Website, Report, Team, TeamUser, Share, WebsiteActive, WebsiteMetric, WebsiteEventMetric, WebsitePageviews, WebsiteStats, WebsiteSessionStats, RealtimeInit, RealtimeUpdate, SessionActivity, SessionData, WebsiteEvent, WebsiteSession, WebsiteEventData, WebsiteEventDataStats, WebsiteSessionData, WebsiteDataField, WebsiteDataValue, Empty, WebsiteSearchParams, UserSearchParams, TeamSearchParams, ReportSearchParams, SearchParams, SearchResult, log, API_KEY_HEADER, UmamiApiClientOptions, UmamiApiClient };
