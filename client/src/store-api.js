import axios from "axios";

axios.defaults.withCredentials = true;
var baseURL = "http://localhost:5000";
if (process.env.NODE_ENV == "production") {
    baseURL = "";
}
const api = axios.create({
    baseURL: baseURL,
});

const handleResponse = (response) => {
    return {
        status: response.status,
        data: response.data,
    };
};

const handleError = (error) => {
    if (error.response) {
        // The request was made, but the server responded with a status code outside of the range 2xx
        return {
            status: error.response.status,
            data: error.response.data,
        };
    } else if (error.request) {
        // The request was made, but no response was received
        return {
            status: 500,
            data: "Server not reachable",
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        return {
            status: 500,
            data: "Unknown error occurred",
        };
    }
};

// Map-related functions
export const getMapById = (id) =>
    api.get(`/api/mapmetadata/${id}`).then(handleResponse).catch(handleError);

export const getUserMaps = (id) =>
    api.get(`/api/mapbyuser/${id}`).then(handleResponse).catch(handleError);

export const getAllMaps = () =>
    api.get("/api/allpublishedmap").then(handleResponse).catch(handleError);

export const getGeoJsonById = (id) =>
    api.get(`/api/mapgeojson/${id}`).then(handleResponse).catch(handleError);

export const createNewMap = (title, type, GeoJsonSchemabuf, tags) =>
    api
        .post("/api/newmap", { title, type, GeoJsonSchemabuf, tags })
        .then(handleResponse)
        .catch(handleError);

export const createDuplicateMapById = (id) =>
    api
        .post(`/api/duplicatemap`, { id })
        .then(handleResponse)
        .catch(handleError);

export const createForkMapById = (id) =>
    api.post("/api/forkmap", { id }).then(handleResponse).catch(handleError);

export const deleteMapById = (id) =>
    api.delete(`/api/deletemap/${id}`).then(handleResponse).catch(handleError);
export const likeMap = (id) =>
    api.post(`/api/likemap`, { id }).then(handleResponse).catch(handleError);
export const dislikeMap = (id) =>
    api.post(`/api/dislikeMap`, { id }).then(handleResponse).catch(handleError);
export const updateMapNameById = (id, title) =>
    api
        .post(`/api/mapname`, { id, title })
        .then(handleResponse)
        .catch(handleError);

export const updateMapTag = (id, newTags) =>
    api
        .post(`/api/updatemaptag`, { id, newTags })
        .then(handleResponse)
        .catch(handleError);

export const updateMapPublishStatus = (id) =>
    api.post(`/api/publishmap`, { id }).then(handleResponse).catch(handleError);

export const updateMapGeoJson = (id, geoBuf) =>
    api
        .post(`/api/updategeojson`, { id, geoBuf })
        .then(handleResponse)
        .catch(handleError);
export const postComment = (text, parentCommentId, mapId) =>
    api
        .post(`/api/postcomment`, { text, parentCommentId, mapId })
        .then(handleResponse)
        .catch(handleError);
export const getcommentbyid = (id) =>
    api
        .post("/api/getcommentbyid", { id })
        .then(handleResponse)
        .catch(handleError);
export const likeComment = (id) =>
    api
        .post(`/api/likecomment`, { id })
        .then(handleResponse)
        .catch(handleError);
export const dislikeComment = (id) =>
    api
        .post(`/api/dislikecomment`, { id })
        .then(handleResponse)
        .catch(handleError);

// Auth-related functions
export const getLoggedIn = () => {
    return api
        .get("/auth/loggedIn")
        .then((response) => {
            // Log the successful response
            return handleResponse(response);
        })
        .catch((error) => {
            // Log the error
            return handleError(error);
        });
};
export const loginUser = (email, password) =>
    api
        .post("/auth/login", { email, password })
        .then(handleResponse)
        .catch(handleError);
export const logoutUser = () =>
    api.post("/auth/logout").then(handleResponse).catch(handleError);
export const registerUser = (email, username, password, passwordVerify) =>
    api
        .post("/auth/register", { email, username, password, passwordVerify })
        .then(handleResponse)
        .catch(handleError);
export const requestReset = (email) =>
    api.post("/auth/reset", { email }).then(handleResponse).catch(handleError);
export const updatePasscode = (
    originalPassword,
    password,
    passwordVerify,
    verificationCode
) =>
    api
        .post("/auth/updatePass", {
            originalPassword,
            password,
            passwordVerify,
            verificationCode,
        })
        .then(handleResponse)
        .catch(handleError);
export const verifyCode = (email, passcode) =>
    api
        .post("/auth/verifyCode", { email, passcode })
        .then(handleResponse)
        .catch(handleError);
export const updatePasscodeNotLoggedIn = (email, password, confirmPassword) =>
    api
        .post("/auth/updatePasscodeNotLoggedIn", {
            email,
            password,
            confirmPassword,
        })
        .then(handleResponse)
        .catch(handleError);
export const updateUsername = (loginToken, newUsername) =>
    api
        .post("/auth/updateUsername", { loginToken, newUsername })
        .then(handleResponse)
        .catch(handleError);
export const updateEmail = (loginToken, newEmail) =>
    api
        .post("/auth/updateEmail", { loginToken, newEmail })
        .then(handleResponse)
        .catch(handleError);
export const deleteAccount = (username, email, password) =>
    api
        .post("/auth/deleteAccount", { username, email, password })
        .then(handleResponse)
        .catch(handleError);
export const updateProfilePic = (data) =>
    api
        .post("/auth/updateProfilePic", data)
        .then(handleResponse)
        .catch(handleError);
export const updateMapPic = (mapId, data) =>
    api
        .post(`/api/updateMapPic?mapId=${mapId}`, data) // Make sure to pass the mapId to the API endpoint
        .then(handleResponse)
        .catch(handleError);

const apis = {
    getMapById,
    getUserMaps,
    getAllMaps,
    getGeoJsonById,
    createNewMap,
    createDuplicateMapById,
    createForkMapById,
    deleteMapById,
    likeMap,
    dislikeMap,
    updateMapNameById,
    updateMapTag,
    updateMapPublishStatus,
    updateMapGeoJson,
    getLoggedIn,
    loginUser,
    logoutUser,
    registerUser,
    requestReset,
    updatePasscode,
    verifyCode,
    updatePasscodeNotLoggedIn,
    updateUsername,
    updateEmail,
    deleteAccount,
    updateProfilePic,
    postComment,
    getcommentbyid,
    likeComment,
    dislikeComment,
    updateMapPic,
};

export default apis;
