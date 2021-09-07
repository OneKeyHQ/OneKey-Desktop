import axios from 'axios';

export const getEndpoint = () => {
    if (process.env.NODE_ENV === 'production') {
        return 'https://defi.onekey.so';
    }
    return '';
};

const request = (_url, options = {}) => {
    const url = _url.startsWith('http') ? _url : `${getEndpoint()}${_url}`;
    return axios({
        url,
        ...options,
    }).then(resp => {
        const body = resp.data;
        if (body.code === 200) {
            return body.data;
        }
        throw new Error(body.message);
    });
};

export default request;
